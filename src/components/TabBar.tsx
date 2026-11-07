import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, space } from '../theme';

export type TabKey = 'home' | 'list' | 'compare' | 'settings';

const TABS: { key: TabKey; kanji: string; label: string }[] = [
  { key: 'home', kanji: '', label: 'Overview' },
  { key: 'list', kanji: '', label: 'People' },
  { key: 'compare', kanji: '', label: 'Compare' },
  { key: 'settings', kanji: '', label: 'Settings' },
];

/** The active tab is stamped like a hanko seal. */
export function TabBar({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={t.label}>
            <View style={[styles.seal, on && styles.sealOn]}>
              <Text style={[styles.kanji, { color: on ? colors.sumi : colors.washi3 }]}>{t.kanji}</Text>
            </View>
            <Text style={[styles.label, { color: on ? colors.washi : colors.washi3 }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.sumi, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space.sm },
  tab: { flex: 1, alignItems: 'center', paddingVertical: space.xs },
  seal: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, transform: [{ rotate: '0deg' }] },
  sealOn: { backgroundColor: colors.shu, borderColor: colors.shu, transform: [{ rotate: '-4deg' }] },
  kanji: { fontFamily: fonts.serifBold, fontSize: 20, includeFontPadding: false },
  label: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 1, marginTop: 4 },
});
