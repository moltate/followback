import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';

interface Props {
  /** 0-100 */
  value: number;
  size?: number;
  caption: string;
}

/**
 * 円相 (ensō): the hand-drawn Zen circle. It is left open, like a brush stroke,
 * and the filled arc shows the follow-back rate.
 */
export function Enso({ value, size = 168, caption }: Props) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const open = 0.92; // the ring is never fully closed, like a real ensō
  const track = circ * open;
  const filled = track * Math.max(0, Math.min(100, value)) / 100;
  const rotate = `rotate(-100 ${size / 2} ${size / 2})`;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.line} strokeWidth={stroke} fill="none" strokeDasharray={`${track} ${circ}`} strokeLinecap="round" transform={rotate} />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.shu} strokeWidth={stroke} fill="none" strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" transform={rotate} />
      </Svg>
      <Text style={styles.value}>
        {value.toFixed(value % 1 === 0 ? 0 : 1)}
        <Text style={styles.pct}>%</Text>
      </Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { fontFamily: fonts.serifBold, fontSize: 40, color: colors.washi, includeFontPadding: false },
  pct: { fontSize: 18, color: colors.washi2 },
  caption: { fontFamily: fonts.sans, fontSize: 11, color: colors.washi2, letterSpacing: 1, marginTop: 2 },
});
