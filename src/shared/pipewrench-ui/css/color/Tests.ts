/** @noSelfInFile */

import { RGB_2_CMYK, RGB_2_HSL } from './RGB';
import { parseHSL as readHSL, HSL_2_RGB } from './HSL';
import { CMYK_2_RGB, parseCMYK as readCMYK } from './CMYK';

export class CSSTests {
  test() {
    this.testHSL();
    this.testCMYK();
  }

  testHSL() {
    const orig = 'hsl(180, 50, 50)';
    const hsl = readHSL(orig);
    const hsl2rgb = HSL_2_RGB(hsl, '1');
    const rgb2hsl = RGB_2_HSL(hsl2rgb);
    // print(`Original: ${orig}`);
    // print('HSL:');
    // print(hsl);
    // print('HSL 2 RGB:');
    // print(hsl2rgb);
    // print('RGB 2 HSL:');
    // print(rgb2hsl);
  }

  testCMYK() {
    const orig = 'cmyk(100%, 0%, 0%, 0%)';
    const cmyk = readCMYK(orig);
    const cmyk2rgb = CMYK_2_RGB(cmyk, '1');
    const rgb2cmyk = RGB_2_CMYK(cmyk2rgb);
    // print(`Original: ${orig}`);
    // print('CMYK:');
    // print(cmyk);
    // print('CMYK 2 RGB:');
    // print(cmyk2rgb);
    // print('RGB 2 CMYK:');
    // print(rgb2cmyk);
  }
}
