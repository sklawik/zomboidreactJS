import { PWUIElement } from './PWUIElement';
import { Core } from '@asledgehammer/pipewrench';
import {
  asRGBA,
  CMYK_2_RGB,
  HSL_2_RGB,
  parseCMYK,
  parseHEX,
  parseHSL,
  parseRGB,
  parseRGBA,
  RGBA,
  transparent
} from '../css/color/Color';

export class CachedValue<Type> {
  value: Type;
  dirty: boolean;
  constructor(value: Type) {
    this.value = value;
  }
}

export class ElementCache {
  element: PWUIElement;

  x: CachedValue<number> = new CachedValue(0);
  y: CachedValue<number> = new CachedValue(0);
  width: CachedValue<number> = new CachedValue(0);
  height: CachedValue<number> = new CachedValue(0);
  backgroundColor: CachedValue<RGBA> = new CachedValue(asRGBA(0, 0, 0, 0, '1'));

  constructor(element: PWUIElement) {
    this.element = element;
  }

  /**
   *
   * @param force If true, render every value regardless of their dirty states.
   */
  calculate(force: boolean = false) {
    const { element } = this;
    const { style } = element;
    this.x.value = formatNumValue(element, 'left', style.left);
    this.y.value = formatNumValue(element, 'top', style.top);
    this.width.value = formatNumValue(element, 'width', style.width);
    this.height.value = formatNumValue(element, 'height', style.height);
    this.backgroundColor.value = formatColor(
      element,
      'background-color',
      style['background-color']
    );
  }
}

export const formatColor = (
  element: PWUIElement,
  property: string,
  value: string
): RGBA => {
  value = value.toLowerCase().trim();
  if (value.indexOf('#') === 0) return parseHEX(value, '1');
  else if (value.indexOf('cmyk(') === 0) {
    return { ...CMYK_2_RGB(parseCMYK(value), '1'), a: 1 };
  } else if (value.indexOf('rgb(') === 0) {
    return { ...parseRGB(value, '1'), a: 1 };
  } else if (value.indexOf('rgba(') === 0) {
    return parseRGBA(value, '1');
  } else if (value.indexOf('hsl(') === 0) {
    return { ...HSL_2_RGB(parseHSL(value), '1'), a: 1 };
  } else if (value.indexOf('inherit') !== -1) {
    if (element.parent != null) {
      return { ...element.parent.cache.backgroundColor.value };
    } else {
      return transparent();
    }
  } else if (
    value.indexOf('transparent') !== -1 ||
    value.indexOf('initial') !== -1 ||
    value.indexOf('none') !== -1 ||
    value.indexOf('unset') !== -1
  ) {
    return transparent();
  }
};

export const formatNumValue = (
  element: PWUIElement,
  property: string,
  value: string
): number => {
  // TODO: Implement alternative lengths at scale.
  if (value.endsWith('px')) {
    return tonumber(value.replace('px', ''));
  } else if (value.endsWith('%')) {
    let compare = 0;
    if (
      property === 'left' ||
      property === 'right' ||
      property === 'width' ||
      property === 'min-width' ||
      property === 'max-width'
    ) {
      compare =
        element.parent != null
          ? element.parent.cache.width.value
          : Core.getInstance().getScreenWidth();
    } else if (
      property === 'top' ||
      property === 'bottom' ||
      property === 'height' ||
      property === 'min-height' ||
      property === 'max-height'
    ) {
      compare =
        element.parent != null
          ? element.parent.cache.height.value
          : Core.getInstance().getScreenHeight();
    } else {
      // TODO: Future percentage checks.
      return 0;
    }
    return (compare * tonumber(value.replace('%', ''))) / 100.0;
  }
};
