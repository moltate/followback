import * as React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, PageTitle } from '../components/ui';
import { useImport } from '../hooks/useImport';
import { useStore } from '../store';
import { colors, fonts, space } from '../theme';
import { formatDate } from '../utils/date';

export function SettingsScreen() {
  const snapshots = useStore((s) => s.snapshots);
  const deleteSnapshot = useStore((s) => s.deleteSnapshot);
  const clearAll = useStore((s) => s.clearAll);
  const imp = useImport();

  const confirmClear = () =>
    Alert.alert('Delete all data?', 'All imports and checkmarks on this phone will be removed. Your Instagram account is not affected.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: clearAll },
    ]);

  const confirmDelete = (id: string, label: string) =>
    Alert.alert('Delete this import?', label, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteSnapshot(id) },
    ]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PageTitle kanji="" title="Settings" />

        <Text style={styles.label}>NEW IMPORT</Text>
        <Card>
          <Text style={styles.body}>Download a fresh export from Instagram, then import followers_1.json and following.json together. Older imports are kept so you can compare.</Text>
          {imp.last ? (
            <Text style={styles.ok}>
              Imported {imp.last.followers.toLocaleString()} followers and {imp.last.following.toLocaleString()} following.
            </Text>
          ) : null}
          {imp.error ? <Text style={styles.err}>{imp.error}</Text> : null}
          {imp.warnings.map((w, i) => (
            <Text key={i} style={styles.warn}>{w}</Text>
          ))}
          <Button label="Import files" onPress={() => void imp.run()} loading={imp.loading} style={{ marginTop: space.lg }} />
        </Card>

        <Text style={styles.label}>SAVED IMPORTS</Text>
        <Card style={{ paddingVertical: space.sm }}>
          {[...snapshots].reverse().map((s, i) => {
            const label = `${formatDate(s.importedAt)} · ${s.followers.length.toLocaleString()} followers · ${s.following.length.toLocaleString()} following`;
            return (
              <View key={s.id} style={[styles.snap, i > 0 && styles.snapBorder]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.snapTitle}>{formatDate(s.importedAt)}{i === 0 ? '  ·  latest' : ''}</Text>
                  <Text style={styles.snapMeta}>
                    {s.followers.length.toLocaleString()} followers · {s.following.length.toLocaleString()} following
                  </Text>
                </View>
                <Pressable onPress={() => confirmDelete(s.id, label)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Delete import from ${formatDate(s.importedAt)}`}>
                  <Text style={styles.del}>Delete</Text>
                </Pressable>
              </View>
            );
          })}
        </Card>

        <Text style={styles.label}>PRIVACY</Text>
        <Card>
          <Text style={styles.body}>
            Everything stays on this phone. FollowBack never asks for your Instagram password and never talks to Instagram's servers. To unfollow, it opens the person's profile and you tap Unfollow yourself, which keeps your account safe from bans.
          </Text>
        </Card>

        <Button label="Delete all data" kind="danger" onPress={confirmClear} style={{ marginTop: space.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  scroll: { padding: space.xl, paddingBottom: 48 },
  label: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 3, color: colors.washi3, marginTop: space.xl, marginBottom: space.sm },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 22, color: colors.washi2 },
  ok: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.matcha, marginTop: space.md },
  err: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.shu, marginTop: space.md },
  warn: { fontFamily: fonts.sans, fontSize: 12, color: colors.kin, marginTop: space.sm },
  snap: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.md },
  snapBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  snapTitle: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.washi },
  snapMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.washi3, marginTop: 2 },
  del: { fontFamily: fonts.serifBold, fontSize: 15, color: colors.shu },
});
