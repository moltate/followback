import * as React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hanko } from '../components/Hanko';
import { Empty, PageTitle } from '../components/ui';
import { compareSnapshots } from '../services/relationship-engine';
import { useStore } from '../store';
import { colors, fonts, radius, space } from '../theme';
import { formatDate } from '../utils/date';
import type { Account } from '../types';

const PREVIEW = 25;

function Section({ kanji, title, tint, items }: { kanji: string; title: string; tint: string; items: Account[] }) {
  const [all, setAll] = React.useState(false);
  const shown = all ? items : items.slice(0, PREVIEW);
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionKanji, { color: tint }]}>{kanji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.count, { color: tint }]}>{items.length.toLocaleString()}</Text>
      </View>
      {items.length === 0 ? <Text style={styles.none}>No changes</Text> : null}
      {shown.map((a) => (
        <Pressable key={a.username} style={styles.row} onPress={() => void Linking.openURL(a.profileUrl).catch(() => undefined)} accessibilityRole="link" accessibilityLabel={`Open ${a.username}`}>
          <Hanko username={a.username} size={34} />
          <Text style={styles.name}>@{a.username}</Text>
        </Pressable>
      ))}
      {items.length > PREVIEW ? (
        <Pressable onPress={() => setAll(!all)} style={styles.more}>
          <Text style={styles.moreText}>{all ? 'Show less' : `Show all ${items.length.toLocaleString()}`}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function CompareScreen() {
  const snapshots = useStore((s) => s.snapshots);
  const [olderId, setOlderId] = React.useState<string | null>(null);
  const [newerId, setNewerId] = React.useState<string | null>(null);

  // default: the two most recent imports; stays valid if a snapshot is deleted
  const newer = snapshots.find((s) => s.id === newerId) ?? snapshots[snapshots.length - 1];
  const older = snapshots.find((s) => s.id === olderId) ?? snapshots[snapshots.length - 2];

  const diff = React.useMemo(() => (older && newer && older.id !== newer.id ? compareSnapshots(older, newer) : null), [older, newer]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageTitle kanji="" title="Compare" subtitle="What changed between two imports" />
        {snapshots.length < 2 ? (
          <Empty kanji="" title="Import again later" hint="Download a fresh export from Instagram after a few days and import it. Then you can see who followed or left." />
        ) : (
          <>
            <Picker label="From (older)" snapshots={snapshots} selected={older?.id} onSelect={setOlderId} />
            <Picker label="To (newer)" snapshots={snapshots} selected={newer?.id} onSelect={setNewerId} />
            {!diff ? (
              <Empty kanji="" title="Pick two different imports" />
            ) : (
              <>
                <Section kanji="" title="New followers" tint={colors.matcha} items={diff.newFollowers} />
                <Section kanji="" title="Lost followers" tint={colors.shu} items={diff.lostFollowers} />
                <Section kanji="" title="You started following" tint={colors.ai} items={diff.newFollowing} />
                <Section kanji="" title="You stopped following" tint={colors.kin} items={diff.stoppedFollowing} />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Picker({ label, snapshots, selected, onSelect }: { label: string; snapshots: { id: string; importedAt: number }[]; selected?: string; onSelect: (id: string) => void }) {
  return (
    <View style={{ marginBottom: space.md }}>
      <Text style={styles.pickLabel}>{label.toUpperCase()}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
        {snapshots.map((s) => {
          const on = s.id === selected;
          return (
            <Pressable key={s.id} onPress={() => onSelect(s.id)} style={[styles.pick, on && { borderColor: colors.shu }]} accessibilityRole="button" accessibilityState={{ selected: on }}>
              <Text style={[styles.pickText, on && { color: colors.washi }]}>{formatDate(s.importedAt)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  scroll: { padding: space.xl, paddingBottom: 40 },
  pickLabel: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 3, color: colors.washi3, marginBottom: space.sm },
  pick: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm + 2, backgroundColor: colors.sumi2 },
  pickText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.washi2 },
  section: { marginTop: space.xl, backgroundColor: colors.sumi2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: space.lg },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: space.sm },
  sectionKanji: { fontFamily: fonts.serifBold, fontSize: 24, marginRight: space.sm },
  sectionTitle: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, color: colors.washi },
  count: { fontFamily: fonts.serifBold, fontSize: 22 },
  none: { fontFamily: fonts.sans, fontSize: 13, color: colors.washi3, paddingVertical: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  name: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.washi },
  more: { paddingVertical: space.md, alignItems: 'center' },
  moreText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1, color: colors.shu },
});
