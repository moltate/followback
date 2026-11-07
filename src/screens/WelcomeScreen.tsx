import * as React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeIn } from '../components/FadeIn';
import { Landscape } from '../components/Landscape';
import { Button, VerticalLabel } from '../components/ui';
import { colors, fonts, radius, space } from '../theme';
import { useImport } from '../hooks/useImport';

const STEPS = [
  'Instagram → Settings → Accounts Center → Your information and permissions → Download your information.',
  'Choose "Some of your information", tick only "Followers and following", pick format JSON, and download.',
  'Unzip the file on your phone. You will find followers_1.json and following.json.',
  'Come back here, tap Import and select those files together.',
];

export function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const imp = useImport();
  const bannerH = 280 + insets.top;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* banner bleeds to the screen edges */}
        <View style={{ height: bannerH }}>
          <Landscape width={width} height={bannerH} id="welcomeSky" />
          <View style={[styles.bannerTop, { top: insets.top + space.lg }]}>
            <Text style={styles.eyebrow}>FOLLOWBACK</Text>
          </View>
          <View style={[styles.vertical, { top: insets.top + space.xl + 12 }]}>
            <VerticalLabel text="TIDY" color={colors.washi2} size={15} />
          </View>
          <View style={styles.seal}>
            <Text style={styles.sealText}>F</Text>
          </View>
        </View>

        <View style={styles.content}>
          <FadeIn>
            <Text style={styles.title}>Who follows back,{'\n'}who doesn't.</Text>
            <Text style={styles.sub}>See who follows you back, privately. Your data never leaves this phone.</Text>
          </FadeIn>

          <FadeIn delay={120}>
            <Text style={styles.section}>HOW TO START</Text>
            {STEPS.map((s, i) => (
              <View key={i} style={styles.step}>
                <Text style={styles.stepNo}>{i + 1}</Text>
                <Text style={styles.stepText}>{s}</Text>
              </View>
            ))}
          </FadeIn>

          <FadeIn delay={240}>
            <View style={styles.note}>
              <Text style={styles.noteText}>No password needed. FollowBack reads the official file Instagram gives you, so your account stays safe.</Text>
            </View>

            {imp.error ? <Text style={styles.error}>{imp.error}</Text> : null}
            {imp.warnings.map((w, i) => (
              <Text key={i} style={styles.warn}>{w}</Text>
            ))}
            <Button label="Import files" onPress={() => void imp.run()} loading={imp.loading} style={{ marginTop: space.xl }} />
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  scroll: { paddingBottom: 56 },
  bannerTop: { position: 'absolute', left: space.xl },
  vertical: { position: 'absolute', right: space.xl },
  eyebrow: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 5, color: colors.shu },
  seal: { position: 'absolute', left: space.xl, bottom: 26, width: 46, height: 46, backgroundColor: colors.shu, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  sealText: { fontFamily: fonts.serifBold, fontSize: 28, color: colors.sumi },
  content: { paddingHorizontal: space.xl },
  title: { fontFamily: fonts.serifBold, fontSize: 38, lineHeight: 52, color: colors.washi },
  sub: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 22, color: colors.washi2, marginTop: space.md, maxWidth: 300 },
  section: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 3, color: colors.washi3, marginTop: space.xxl, marginBottom: space.md },
  step: { flexDirection: 'row', paddingVertical: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  stepNo: { fontFamily: fonts.serifBold, fontSize: 22, color: colors.shu, width: 36 },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22, color: colors.washi },
  note: { marginTop: space.xl, borderLeftWidth: 3, borderLeftColor: colors.matcha, paddingLeft: space.md },
  noteText: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 20, color: colors.washi2 },
  error: { fontFamily: fonts.sansMedium, color: colors.shu, marginTop: space.lg, fontSize: 14 },
  warn: { fontFamily: fonts.sans, color: colors.kin, marginTop: space.sm, fontSize: 12 },
});
