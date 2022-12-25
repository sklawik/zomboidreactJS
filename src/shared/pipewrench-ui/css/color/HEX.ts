import { RGBA } from './RGBA';

export const parseHEX = (hex: string, format: '1' | '255'): RGBA => {
  hex = hex.replace('#', '');
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;
  if (hex.length === 8 /* RRGGBBAA */) {
    r = tonumber(hex.substring(0, 2), 16);
    g = tonumber(hex.substring(2, 4), 16);
    b = tonumber(hex.substring(4, 6), 16);
    a = tonumber(hex.substring(6, 8), 16) / 255;
  } else if (hex.length === 6 /* RRGGBB */) {
    r = tonumber(hex.substring(0, 2), 16);
    g = tonumber(hex.substring(2, 4), 16);
    b = tonumber(hex.substring(4, 6), 16);
  } else if (hex.length === 4 /* RGBA */) {
    r = tonumber(hex.charAt(0), 16);
    g = tonumber(hex.charAt(1), 16);
    b = tonumber(hex.charAt(2), 16);
    a = tonumber(hex.charAt(3), 16) / 255;
  } else if (hex.length === 3 /* RGB */) {
    r = tonumber(hex.charAt(0), 16);
    g = tonumber(hex.charAt(1), 16);
    b = tonumber(hex.charAt(2), 16);
  }
  if (format === '1') {
    r /= 255;
    g /= 255;
    b /= 255;
  }
  return { r, g, b, a, format };
};
