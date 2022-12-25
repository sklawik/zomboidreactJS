import { clamp, RANGE_1, RANGE_255 } from '../math/Math';
import { RGB } from './RGB';

/**
 * HSL - (Hue, Saturation, Luminance)
 * ```
 * | Value      | Range      |
 * | ---------- | ---------- |
 * | Hue        | [0 -> 359] |
 * | Saturation | [0 ->  99] |
 * | Luminance  | [0 ->  99] |
 * ```
 */
export type HSL = { h: number; s: number; l: number };

export const parseHSL = (raw: string): HSL => {
  if (raw.indexOf('hsl(') === -1 || !raw.endsWith(')')) {
    throw new Error(`Invalid hsl() rule: ${raw}`);
  }
  let values = raw
    .replace('hsl(', '')
    .substring(0, raw.length - 1)
    .split(',');
  if (values.length !== 3) {
    throw new Error(`Invalid hsl() rule: ${raw} (Not 3 values.)`);
  }
  let h = tonumber(values[0].trim());
  let s = tonumber(values[1].trim());
  let l = tonumber(values[2].trim());
  if (h === 360) h = 0;
  h /= 360;
  s /= 100;
  l /= 100;

  return {
    h: clamp(h, RANGE_1),
    s: clamp(s, RANGE_1),
    l: clamp(l, RANGE_1)
  };
};

/**
 * @param color The hsl color values.
 *
 * @return The calculated rgb color values.
 */
export const HSL_2_RGB = (color: HSL, format: '1' | '255'): RGB => {
  let { h, s, l } = color;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    1 - (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))));
  if (format === '1') {
    return {
      r: clamp(f(0), RANGE_1),
      g: clamp(f(8), RANGE_1),
      b: clamp(f(4), RANGE_1),
      format
    };
  } else {
    return {
      r: Math.round(clamp(255 * f(0), RANGE_255)),
      g: Math.round(clamp(255 * f(8), RANGE_255)),
      b: Math.round(clamp(255 * f(4), RANGE_255)),
      format
    };
  }
};
