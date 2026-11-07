import * as React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  width: number;
  height: number;
  /** unique per screen when two banners can exist at once */
  id?: string;
}

/**
 * Ukiyo-e inspired banner: dusk sky, a big vermilion sun, Mount Fuji with a snow cap,
 * layered hills and a few birds. The bottom hills use the page color so the banner melts into the screen.
 */
export function Landscape({ width, height, id = 'sky' }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 200" preserveAspectRatio="xMidYMax slice">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#100D0C" />
          <Stop offset="0.7" stopColor="#2A1713" />
          <Stop offset="1" stopColor="#3A1D16" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="360" height="200" fill={`url(#${id})`} />

      {/* sun with soft halo */}
      <Circle cx="262" cy="78" r="62" fill={colors.shu} opacity={0.08} />
      <Circle cx="262" cy="78" r="46" fill={colors.shu} opacity={0.14} />
      <Circle cx="262" cy="78" r="34" fill={colors.shu} />

      {/* birds */}
      <Path d="M52 44 q5 -6 10 0 q5 -6 10 0" stroke={colors.washi} strokeWidth={1.2} fill="none" opacity={0.55} />
      <Path d="M84 30 q4 -5 8 0 q4 -5 8 0" stroke={colors.washi} strokeWidth={1.2} fill="none" opacity={0.4} />

      {/* far mountains */}
      <Path d="M0 150 L48 118 L86 140 L132 108 L186 146 L236 114 L292 142 L330 120 L360 140 L360 200 L0 200 Z" fill="#1F1916" />

      {/* Mount Fuji */}
      <Path d="M70 200 L146 84 Q160 70 174 84 L250 200 Z" fill="#2C2521" />
      <Path d="M129 110 L146 84 Q160 70 174 84 L191 110 L178 102 L168 114 L158 100 L148 113 Z" fill={colors.washi} opacity={0.88} />

      {/* mist */}
      <Rect x="0" y="150" width="360" height="1.2" fill={colors.washi} opacity={0.08} />
      <Rect x="40" y="160" width="280" height="1.2" fill={colors.washi} opacity={0.06} />

      {/* foreground hills, same color as the page */}
      <Path d="M0 172 Q70 152 150 170 T290 164 T360 170 L360 200 L0 200 Z" fill="#1B1816" />
      <Path d="M0 188 Q90 172 190 186 T360 182 L360 200 L0 200 Z" fill={colors.sumi} />
    </Svg>
  );
}
