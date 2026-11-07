import * as React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radius, space } from '../theme';

/** Kanji written top-to-bottom (縦書き), the most recognisable trait of Japanese layouts. */
export function VerticalLabel({ text, color = colors.washi3, size = 14 }: { text: string; color?: string; size?: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      {Array.from(text).map((ch, i) => (
        <Text key={i} style={{ fontFamily: fonts.serif, fontSize: size, color, lineHeight: size * 1.35 }}>
          {ch}
        </Text>
      ))}
    </View>
  );
}

/** Screen title: big kanji + small english, with a thin vermilion rule. */
export function PageTitle({ kanji, title, subtitle }: { kanji: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.pageTitle}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>{title.toUpperCase()}</Text>
        <Text style={styles.kanjiTitle}>Overview</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.rule} />
    </View>
  );
}

/** Double-line frame, like the border of a Japanese certificate or scroll. */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardInner}>{children}</View>
    </View>
  );
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, kind = 'primary', loading, disabled, style }: ButtonProps) {
  const bg = kind === 'primary' ? colors.shu : 'transparent';
  const border = kind === 'primary' ? colors.shu : kind === 'danger' ? colors.shu : colors.line;
  const fg = kind === 'danger' ? colors.shu : colors.washi;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, borderColor: border, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }, style]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.btnText, { color: fg }]}>{label}</Text>}
    </Pressable>
  );
}

export function Empty({ kanji, title, hint }: { kanji: string; title: string; hint?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyKanji}>{kanji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {hint ? <Text style={styles.emptyHint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: space.xl },
  eyebrow: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 3, color: colors.washi3 },
  kanjiTitle: { fontFamily: fonts.serifBold, fontSize: 44, color: colors.washi, marginTop: 2 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.washi2, marginTop: 4 },
  rule: { width: 3, height: 52, backgroundColor: colors.shu, marginLeft: space.md },
  card: { backgroundColor: colors.sumi2, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 3 },
  cardInner: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.washi3, borderRadius: radius.sm, padding: space.lg },
  btn: { minHeight: 50, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  btnText: { fontFamily: fonts.sansBold, fontSize: 15, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: 56, paddingHorizontal: space.xl },
  emptyKanji: { fontFamily: fonts.serif, fontSize: 64, color: colors.line },
  emptyTitle: { fontFamily: fonts.serifBold, fontSize: 18, color: colors.washi, marginTop: space.md, textAlign: 'center' },
  emptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.washi2, marginTop: space.sm, textAlign: 'center', lineHeight: 20 },
});
