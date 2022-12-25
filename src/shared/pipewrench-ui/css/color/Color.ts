/** @noSelfInFile */

import { RGBA, parseRGBA, asRGBA, formatRGBA } from './RGBA';
import {
  RGB,
  parseRGB,
  asRGB,
  formatRGB,
  RGB_2_CMYK,
  RGB_2_HEX,
  RGB_2_HSL
} from './RGB';

import { CMYK, parseCMYK, CMYK_2_RGB } from './CMYK';
import { parseHEX } from './HEX';
import { HSL, parseHSL, HSL_2_RGB } from './HSL';

export const transparent = (format: '1' | '255' = '1'): RGBA => {
  return { r: 0, g: 0, b: 0, a: 0, format };
};

export {
  /* CMYK.ts */
  CMYK,
  parseCMYK,
  CMYK_2_RGB,

  /* HEX.ts */
  parseHEX,

  /* HSL.ts */
  HSL,
  parseHSL,
  HSL_2_RGB,

  /* RGB.ts */
  RGB,
  parseRGB,
  asRGB,
  formatRGB,
  RGB_2_CMYK,
  RGB_2_HEX,
  RGB_2_HSL,

  /* RGBA.ts */
  RGBA,
  parseRGBA,
  asRGBA,
  formatRGBA
};
