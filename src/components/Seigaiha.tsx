import * as React from 'react';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  color: string;
  opacity?: number;
}

/**
 * 青海波 (seigaiha): the classic overlapping-waves pattern,
 * drawn as concentric rings that repeat in a staggered grid.
 */
export function Seigaiha({ width, height, color, opacity = 0.12 }: Props) {
  const r = 22; // outer radius of one wave
  const w = r * 2;
  const h = r;
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, opacity }} pointerEvents="none">
      <Defs>
        <Pattern id="wave" width={w} height={h * 2} patternUnits="userSpaceOnUse">
          {[0, 1].map((row) =>
            [0, 1, 2].map((col) => {
              const cx = col * w + (row % 2 === 0 ? 0 : r);
              const cy = row * h + r;
              return [r, r * 0.72, r * 0.44, r * 0.16].map((rad, i) => (
                <Circle key={`${row}-${col}-${i}`} cx={cx} cy={cy} r={rad} stroke={color} strokeWidth={1} fill="none" />
              ));
            }),
          )}
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#wave)" />
    </Svg>
  );
}
