/** @noSelfInFile */

import { clamp, RANGE_1, RANGE_255 } from '../math/Math';
import { RGB } from './RGB';

/**
 * RGBA - (Red, Green, Blue, Alpha)
 *
 *  * Format 1: (OpenGL)
 * ```
 * | Value | Range      |
 * | ----- | ---------- |
 * | Red   | [0 ->   1] |
 * | Green | [0 ->   1] |
 * | Blue  | [0 ->   1] |
 * | Alpha | [0 ->   1] |
 * ```
 *
 * * Format 255: (CSS)
 * ```
 * | Value | Range      |
 * | ----- | ---------- |
 * | Red   | [0 -> 255] |
 * | Green | [0 -> 255] |
 * | Blue  | [0 -> 255] |
 * | Alpha | [0 ->   1] |
 * ```
 */
export type RGBA = RGB & { a: number };

export const parseRGBA = (raw: string, format: '1' | '255'): RGBA => {
  if (raw.indexOf('rgba(') === -1 || !raw.endsWith(')')) {
    throw new Error(`Invalid rgba() rule: ${raw}`);
  }

  // [red=[0, 255], green=[0, 255], blue=[0, 255], alpha=[0, 1]]
  let values = raw
    .replace('rgba(', '')
    .replace(')', '')
    .split(',');
  if (values.length !== 4) {
    throw new Error(`Invalid rgba() rule: ${raw} (Not 4 values)`);
  }

  let result = {
    r: clamp(Math.round(tonumber(values[0].trim())), RANGE_255),
    g: clamp(Math.round(tonumber(values[1].trim())), RANGE_255),
    b: clamp(Math.round(tonumber(values[2].trim())), RANGE_255),
    a: clamp(tonumber(values[3].trim()), RANGE_1),
    format
  };

  if (format === '1') {
    result.r = result.r / 255;
    result.g = result.g / 255;
    result.b = result.b / 255;
  }

  return result;
};

export const formatRGBA = (color: RGBA, format: '1' | '255'): RGBA => {
  if (format === '1') {
    if (color.format === '1') return { ...color };
    return {
      r: Math.round(clamp(color.r, RANGE_255) / 255),
      g: Math.round(clamp(color.g, RANGE_255) / 255),
      b: Math.round(clamp(color.b, RANGE_255) / 255),
      a: clamp(color.a, RANGE_1),
      format: '1'
    };
  } else {
    if (color.format === '255') return { ...color };
    return {
      r: Math.round(clamp(color.r, RANGE_1) * 255),
      g: Math.round(clamp(color.g, RANGE_1) * 255),
      b: Math.round(clamp(color.b, RANGE_1) * 255),
      a: clamp(color.a, RANGE_1),
      format: '255'
    };
  }
};

export const asRGBA = (
  red: number,
  green: number,
  blue: number,
  alpha: number = 1,
  format: '1' | '255'
): RGBA => {
  return { r: red, g: green, b: blue, a: alpha, format };
};

export const RGBA_2_HEX = (color: RGBA): string => {
  const { format } = color;
  let { r, g, b, a } = color;
  if (format === '1') {
    r *= 255;
    g *= 255;
    b *= 255;
    a *= 255;
  }
  const rgba: string[] = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    a.toString(16)
  ];
  for (let i = 0; i < 4; i++) {
    if (rgba[i].length == 1) rgba[i] = rgba[i] + rgba[i];
  }
  if (
    rgba[0][0] == rgba[0][1] &&
    rgba[1][0] == rgba[1][1] &&
    rgba[2][0] == rgba[2][1] &&
    rgba[3][0] == rgba[3][1]
  ) {
    return `#${rgba[0][0]}${rgba[1][0]}${rgba[2][0]}${rgba[3][0]}`;
  } else {
    return `#${rgba[0]}${rgba[1]}${rgba[2]}${rgba[3]}`;
  }
};
