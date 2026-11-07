import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Enso } from '../components/Enso';
import { FadeIn } from '../components/FadeIn';
import { Landscape } from '../components/Landscape';
import { VerticalLabel } from '../components/ui';
import { useRelationships } from '../hooks/useRelationships';
import { colors, fonts, radius, space } from '../theme';
import { formatDateJP } from '../utils/date';
import type { ListFilter } from './ListScreen';

interface StatProps {
  kanji: string;
  label: string;
  value: number;
  tint?: string;
  onPress?: () => void;
}

function Stat({ kanji, label, value, tint = colors.washi, onPress }: StatProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.stat, { borderTopColor: tint }, pressed && { opacity: 0.75 }]}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[styles.watermark, { color: tint }]}>{kanji}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
    </Pressable>
  );
}

export function DashboardScreen({ onOpenList }: { onOpenList: (f: ListFilter) => void }) {
  const { rel, latest } = useRelationships();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  if (!rel || !latest) return null;
  const bannerH = 190 + insets.top;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ height: bannerH }}>
          <Landscape width={width} height={bannerH} id="dashSky" />
          <View style={styles.bannerText}>
            <Text style={styles.eyebrow}>OVERVIEW</Text>
            <Text style={styles.kanjiTitle}>Overview</Text>
            <Text style={styles.date}>Imported {formatDateJP(latest.importedAt)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <FadeIn>
            <View style={styles.hero}>
              <View style={styles.heroLabel}>
                <VerticalLabel text="RATE" color={colors.washi3} size={14} />
              </View>
              <Enso value={rel.followBackRate} caption="FOLLOW-BACK RATE" />
              <Text style={styles.heroNote}>
                {rel.following.length === 0
                  ? 'You are not following anyone yet.'
                  : `${rel.mutuals.length.toLocaleString()} of the ${rel.following.length.toLocaleString()} people you follow follow you back.`}
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={100}>
            <Pressable
              onPress={() => onOpenList('notFollowingBack')}
              style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel={`Review ${rel.notFollowingBack.length} people who do not follow you back`}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaKanji}>Not following back</Text>
                <Text style={styles.ctaText}>{rel.notFollowingBack.length.toLocaleString()} people do not follow you back</Text>
              </View>
              <Text style={styles.ctaArrow}>→</Text>
            </Pressable>
          </FadeIn>

          <View style={styles.grid}>
            <FadeIn delay={180} style={styles.cell}>
              <Stat kanji="" label="Followers" value={rel.followers.length} onPress={() => onOpenList('followers')} />
            </FadeIn>
            <FadeIn delay={240} style={styles.cell}>
              <Stat kanji="" label="Following" value={rel.following.length} onPress={() => onOpenList('following')} />
            </FadeIn>
            <FadeIn delay={300} style={styles.cell}>
              <Stat kanji="" label="Mutuals" value={rel.mutuals.length} tint={colors.matcha} onPress={() => onOpenList('mutuals')} />
            </FadeIn>
            <FadeIn delay={360} style={styles.cell}>
              <Stat kanji="" label="Fans" value={rel.fans.length} tint={colors.kin} onPress={() => onOpenList('fans')} />
            </FadeIn>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  scroll: { paddingBottom: 32 },
  bannerText: { position: 'absolute', left: space.xl, bottom: space.lg },
  eyebrow: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 4, color: colors.shu },
  kanjiTitle: { fontFamily: fonts.serifBold, fontSize: 48, color: colors.washi, lineHeight: 58 },
  date: { fontFamily: fonts.sans, fontSize: 12, color: colors.washi2, marginTop: 2 },
  content: { paddingHorizontal: space.xl },
  hero: { alignItems: 'center', backgroundColor: colors.sumi2, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: space.xxl, paddingHorizontal: space.xl },
  heroLabel: { position: 'absolute', left: space.lg, top: space.lg },
  heroNote: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 20, color: colors.washi2, textAlign: 'center', marginTop: space.lg },
  cta: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.shuSoft, borderWidth: 1, borderColor: colors.shu, borderRadius: radius.md, padding: space.lg, marginTop: space.lg },
  ctaKanji: { fontFamily: fonts.serifBold, fontSize: 24, color: colors.shu },
  ctaText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.washi, marginTop: 2 },
  ctaArrow: { fontFamily: fonts.sansBold, fontSize: 22, color: colors.shu },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.lg },
  cell: { width: '48%', flexGrow: 1 },
  stat: { overflow: 'hidden', backgroundColor: colors.sumi2, borderWidth: 1, borderTopWidth: 2, borderColor: colors.line, borderRadius: radius.md, padding: space.lg, minHeight: 112, justifyContent: 'flex-end' },
  watermark: { position: 'absolute', right: 6, top: -6, fontFamily: fonts.serifBold, fontSize: 76, opacity: 0.12 },
  statLabel: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 2, color: colors.washi2, textTransform: 'uppercase' },
  statValue: { fontFamily: fonts.serifBold, fontSize: 32, color: colors.washi, marginTop: 2 },
});
