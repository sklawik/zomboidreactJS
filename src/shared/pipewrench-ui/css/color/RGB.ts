/** @noSelfInFile */

import { clamp, RANGE_1, RANGE_255 } from '../math/Math';
import { CMYK, RANGE_100 } from './CMYK';
import { HSL } from './HSL';

/**
 * RGB - (Red, Green, Blue)
 *
 *  * Format 1: (OpenGL)
 * ```
 * | Value | Range      |
 * | ----- | ---------- |
 * | Red   | [0 ->   1] |
 * | Green | [0 ->   1] |
 * | Blue  | [0 ->   1] |
 * ```
 *
 * * Format 255: (CSS)
 * ```
 * | Value | Range      |
 * | ----- | ---------- |
 * | Red   | [0 -> 255] |
 * | Green | [0 -> 255] |
 * | Blue  | [0 -> 255] |
 * ```
 */
export type RGB = { r: number; g: number; b: number; format: '1' | '255' };

export const parseRGB = (raw: string, format: '1' | '255'): RGB => {
  if (raw.indexOf('rgb(') === -1 || !raw.endsWith(')')) {
    throw new Error(`Invalid rgb() rule: ${raw}`);
  }

  // [red=[0, 255], green=[0, 255], blue=[0, 255]]
  let values = raw
    .replace('rgba(', '')
    .replace(')', '')
    .split(',');
  if (values.length !== 3) {
    throw new Error(`Invalid rgb() rule: ${raw} (Not 3 values)`);
  }
  let result = {
    r: clamp(Math.round(tonumber(values[0].trim())), RANGE_255),
    g: clamp(Math.round(tonumber(values[1].trim())), RANGE_255),
    b: clamp(Math.round(tonumber(values[2].trim())), RANGE_255),
    format
  };
  if (format === '1') {
    result.r = result.r / 255;
    result.g = result.g / 255;
    result.b = result.b / 255;
  }
  return result;
};

export const RGB_2_HEX = (color: RGB): string => {
  let r = color.r;
  let g = color.g;
  let b = color.b;
  if (color.format === '1') {
    r *= 255;
    g *= 255;
    b *= 255;
  }
  const rgb: string[] = [
    color.r.toString(16),
    color.g.toString(16),
    color.b.toString(16)
  ];
  for (let i = 0; i < 3; i++) {
    if (rgb[i].length == 1) rgb[i] = rgb[i] + rgb[i];
  }
  if (
    rgb[0][0] == rgb[0][1] &&
    rgb[1][0] == rgb[1][1] &&
    rgb[2][0] == rgb[2][1]
  ) {
    return `#${rgb[0][0]}${rgb[1][0]}${rgb[2][0]}`;
  } else {
    return `#${rgb[0]}${rgb[1]}${rgb[2]}`;
  }
};

/**
 * @param color The rgb color values.
 *
 * @return The calculated HSL color values.
 */
export const RGB_2_HSL = (color: RGB): HSL => {
  const { format } = color;
  let { r, g, b } = color;
  if (format === '255') {
    r /= 255;
    g /= 255;
    b /= 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: clamp(h, RANGE_1), s: clamp(s, RANGE_1), l: clamp(l, RANGE_1) };
};

export const RGB_2_CMYK = (color: RGB): CMYK => {
  const { format } = color;
  let { r, g, b } = color;
  if (format === '255') {
    r /= 255;
    g /= 255;
    b /= 255;
  }
  let c = 1 - r;
  let m = 1 - g;
  let y = 1 - b;
  let k = Math.min(c, Math.min(m, y));
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  c = Math.round(c * 10000) / 100;
  m = Math.round(m * 10000) / 100;
  y = Math.round(y * 10000) / 100;
  k = Math.round(k * 10000) / 100;
  return {
    c: clamp(isNaN(c) ? 0 : c, RANGE_100),
    m: clamp(isNaN(m) ? 0 : m, RANGE_100),
    y: clamp(isNaN(y) ? 0 : y, RANGE_100),
    k: clamp(isNaN(k) ? 0 : k, RANGE_100)
  };
};

export const formatRGB = (color: RGB, format: '1' | '255'): RGB => {
  if (format === '1') {
    if (color.format === '1') return { ...color };
    return {
      r: Math.round(clamp(color.r, RANGE_255) / 255),
      g: Math.round(clamp(color.g, RANGE_255) / 255),
      b: Math.round(clamp(color.b, RANGE_255) / 255),
      format: '1'
    };
  } else {
    if (color.format === '255') return { ...color };
    return {
      r: Math.round(clamp(color.r, RANGE_1) * 255),
      g: Math.round(clamp(color.g, RANGE_1) * 255),
      b: Math.round(clamp(color.b, RANGE_1) * 255),
      format: '255'
    };
  }
};

export const asRGB = (
  red: number,
  green: number,
  blue: number,
  format: '1' | '255'
): RGB => {
  return { r: red, g: green, b: blue, format };
};
