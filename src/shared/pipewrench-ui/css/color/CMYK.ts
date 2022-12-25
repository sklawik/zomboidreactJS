import { clamp, RANGE_1, RANGE_255 } from '../math/Math';
import { RGB } from './RGB';

/**
 * CYMK - (Cyan, Yellow, Magenta, Black)
 *
 * ```
 * | Value   | Range      |
 * | ------- | ---------- |
 * | Cyan    | [0 -> 100] |
 * | Yellow  | [0 -> 100] |
 * | Magenta | [0 -> 100] |
 * | Black   | [0 -> 100] |
 * ```
 */
export type CMYK = {
  c: number;
  y: number;
  m: number;
  k: number;
};

export const RANGE_100 = { min: 0, max: 100 };

export const parseCMYK = (raw: string): CMYK => {
  if (raw.indexOf('cmyk(') === -1 || !raw.endsWith(')')) {
    throw new Error(`Invalid cmyk() rule: ${raw}`);
  }
  // [cyan=[0, 100], magenta=[0, 100], yellow=[0, 100], black=[0, 100]]
  let values = raw
    .replace('cmyk(', '')
    .substring(0, raw.length - 1)
    .split(',');
  if (values.length !== 4) {
    throw new Error(`Invalid cmyk() rule: ${raw} (Not 4 values)`);
  }
  return {
    c: clamp(tonumber(values[0].trim()), RANGE_100),
    m: clamp(tonumber(values[1].trim()), RANGE_100),
    y: clamp(tonumber(values[2].trim()), RANGE_100),
    k: clamp(tonumber(values[3].trim()), RANGE_100)
  };
};

export const CMYK_2_RGB = (color: CMYK, format: '1' | '255'): RGB => {
  let c = color.c / 100;
  let m = color.m / 100;
  let y = color.y / 100;
  let k = color.k / 100;
  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;
  let r = 1 - c;
  let g = 1 - m;
  let b = 1 - y;
  if (format === '255') {
    r *= 255;
    g *= 255;
    b *= 255;
    return {
      r: clamp(r, RANGE_255),
      g: clamp(g, RANGE_255),
      b: clamp(b, RANGE_255),
      format
    };
  } else {
    return {
      r: clamp(r, RANGE_1),
      g: clamp(g, RANGE_1),
      b: clamp(b, RANGE_1),
      format
    };
  }
};
