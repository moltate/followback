import * as React from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hanko } from '../components/Hanko';
import { Button, Empty, PageTitle } from '../components/ui';
import { useRelationships } from '../hooks/useRelationships';
import { useStore } from '../store';
import { colors, fonts, radius, space } from '../theme';
import { formatUnixSeconds } from '../utils/date';
import type { Account } from '../types';

export type ListFilter = 'notFollowingBack' | 'fans' | 'mutuals' | 'followers' | 'following';

const FILTERS: { key: ListFilter; kanji: string; label: string }[] = [
  { key: 'notFollowingBack', kanji: '', label: 'Not following back' },
  { key: 'fans', kanji: '', label: 'Fans' },
  { key: 'mutuals', kanji: '', label: 'Mutuals' },
  { key: 'followers', kanji: '', label: 'Followers' },
  { key: 'following', kanji: '', label: 'Following' },
];

type Sort = 'az' | 'newest';
const ROW_HEIGHT = 72;

function openProfile(a: Account) {
  Linking.openURL(a.profileUrl).catch(() => Alert.alert('Could not open Instagram', 'Check that a browser or the Instagram app is installed.'));
}

interface RowProps {
  account: Account;
  showCheck: boolean;
  done: boolean;
  onToggle: (u: string) => void;
}

const Row = React.memo(function Row({ account, showCheck, done, onToggle }: RowProps) {
  return (
    <View style={[styles.row, done && { opacity: 0.45 }]}>
      <Hanko username={account.username} />
      <Pressable style={styles.rowMain} onPress={() => openProfile(account)} accessibilityRole="link" accessibilityLabel={`Open ${account.username} on Instagram`}>
        <Text style={[styles.name, done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>
          @{account.username}
        </Text>
        <Text style={styles.meta}>{account.followedAt ? formatUnixSeconds(account.followedAt) : 'Open on Instagram'}</Text>
      </Pressable>
      {showCheck ? (
        <Pressable
          onPress={() => onToggle(account.username)}
          hitSlop={8}
          style={[styles.check, done && { backgroundColor: colors.matcha, borderColor: colors.matcha }]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Mark ${account.username} as unfollowed`}
        >
          {done ? <Text style={styles.checkMark}>✓</Text> : null}
        </Pressable>
      ) : null}
    </View>
  );
});

export function ListScreen({ filter, onFilterChange }: { filter: ListFilter; onFilterChange: (f: ListFilter) => void }) {
  const { rel } = useRelationships();
  const done = useStore((s) => s.done);
  const toggleDone = useStore((s) => s.toggleDone);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<Sort>('az');

  const data = React.useMemo(() => {
    if (!rel) return [];
    const q = query.trim().toLowerCase().replace(/^@/, '');
    let list = rel[filter];
    if (q) list = list.filter((a) => a.username.includes(q));
    const copy = [...list];
    if (sort === 'az') copy.sort((a, b) => a.username.localeCompare(b.username));
    else copy.sort((a, b) => (b.followedAt ?? 0) - (a.followedAt ?? 0));
    return copy;
  }, [rel, filter, query, sort]);

  const isCleanup = filter === 'notFollowingBack';
  const doneCount = React.useMemo(() => (rel ? rel.notFollowingBack.filter((a) => done[a.username]).length : 0), [rel, done]);
  const total = rel?.notFollowingBack.length ?? 0;

  const openNext = () => {
    const next = data.find((a) => !done[a.username]);
    if (!next) {
      Alert.alert('All done', 'Everyone in this list is marked as unfollowed.');
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openProfile(next);
  };

  const onToggle = React.useCallback(
    (u: string) => {
      void Haptics.selectionAsync();
      toggleDone(u);
    },
    [toggleDone],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Account }) => <Row account={item} showCheck={isCleanup} done={!!done[item.username]} onToggle={onToggle} />,
    [isCleanup, done, onToggle],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.head}>
        <PageTitle kanji="" title="People" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => {
            const on = f.key === filter;
            const count = rel ? rel[f.key].length : 0;
            return (
              <Pressable key={f.key} onPress={() => onFilterChange(f.key)} style={[styles.chip, on && styles.chipOn]} accessibilityRole="button" accessibilityState={{ selected: on }}>
                <Text style={[styles.chipKanji, on && { color: colors.shu }]}>{f.kanji}</Text>
                <Text style={[styles.chipText, on && { color: colors.washi }]}>
                  {f.label} · {count.toLocaleString()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search username"
            placeholderTextColor={colors.washi3}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.search}
            accessibilityLabel="Search username"
          />
          <Pressable onPress={() => setSort(sort === 'az' ? 'newest' : 'az')} style={styles.sort} accessibilityRole="button" accessibilityLabel="Change sort order">
            <Text style={styles.sortText}>{sort === 'az' ? 'A–Z' : 'NEW'}</Text>
          </Pressable>
        </View>
        {isCleanup && total > 0 ? (
          <View style={styles.cleanup}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cleanupTitle}>
                {doneCount} / {total} unfollowed
              </Text>
              <View style={styles.bar}>
                <View style={[styles.barFill, { width: `${(doneCount / total) * 100}%` }]} />
              </View>
            </View>
            <Button label="Open next" onPress={openNext} style={styles.next} />
          </View>
        ) : null}
      </View>

      <FlatList
        data={data}
        keyExtractor={(a) => a.username}
        renderItem={renderItem}
        getItemLayout={(_, i) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * i, index: i })}
        initialNumToRender={18}
        windowSize={9}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Empty kanji="" title={query ? 'No match' : 'Nobody here'} hint={query ? 'Try a different spelling.' : 'This list is empty in your latest import.'} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  head: { paddingHorizontal: space.xl, paddingTop: space.xl },
  chips: { gap: space.sm, paddingBottom: space.md },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm, backgroundColor: colors.sumi2 },
  chipOn: { borderColor: colors.shu, backgroundColor: colors.shuSoft },
  chipKanji: { fontFamily: fonts.serifBold, fontSize: 15, color: colors.washi3 },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.washi2, marginTop: 1 },
  searchRow: { flexDirection: 'row', gap: space.sm },
  search: { flex: 1, height: 46, backgroundColor: colors.sumi2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, paddingHorizontal: space.md, color: colors.washi, fontFamily: fonts.sans, fontSize: 15 },
  sort: { width: 64, height: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, backgroundColor: colors.sumi2 },
  sortText: { fontFamily: fonts.sansBold, fontSize: 12, letterSpacing: 1, color: colors.washi2 },
  cleanup: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.md, padding: space.md, backgroundColor: colors.sumi2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md },
  cleanupTitle: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.washi },
  bar: { height: 3, backgroundColor: colors.line, marginTop: space.sm },
  barFill: { height: 3, backgroundColor: colors.matcha },
  next: { minHeight: 42, paddingHorizontal: space.lg },
  row: { height: ROW_HEIGHT, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowMain: { flex: 1, justifyContent: 'center', height: '100%' },
  name: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.washi },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.washi3, marginTop: 2 },
  check: { width: 34, height: 34, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.washi3, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontFamily: fonts.serifBold, fontSize: 16, color: colors.sumi },
});
