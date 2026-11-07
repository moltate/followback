import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, hankoColor, radius } from '../theme';

/**
 * Avatar styled like a 判子 (hanko) seal stamp: a small square with a thin border and a single character.
 * Instagram exports contain no profile pictures, so every account gets a stable colored seal instead.
 */
export function Hanko({ username, size = 44 }: { username: string; size?: number }) {
  const c = hankoColor(username);
  const ch = (username.replace(/[^a-z0-9]/gi, '')[0] ?? '?').toUpperCase();
  return (
    <View style={[styles.seal, { width: size, height: size, borderColor: c }]}>
      <View style={[styles.inner, { borderColor: c }]}>
        <Text style={[styles.ch, { color: c, fontSize: size * 0.46 }]}>{ch}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seal: { borderWidth: 1.5, borderRadius: radius.sm, padding: 2, alignItems: 'center', justifyContent: 'center' },
  inner: { flex: 1, alignSelf: 'stretch', borderWidth: StyleSheet.hairlineWidth, borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
  ch: { fontFamily: fonts.serifBold, includeFontPadding: false, color: colors.washi },
});
