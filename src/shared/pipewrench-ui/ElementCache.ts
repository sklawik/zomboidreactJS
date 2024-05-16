import { Core, Texture } from '@asledgehammer/pipewrench';
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
} from './css/color/Color';
import { TextureCache } from './TextureCache';
import { AbstractElement } from './elements/AbstractElement';
import { PWUIImg } from './elements/img';

export interface Cached {
  dirty: boolean;
}

export class CachedValue<Type> implements Cached {
  value: Type;
  dirty: boolean;
  constructor(value: Type) {
    this.value = value;
    this.dirty = true;
  }
}

export class CachedRectangle implements Cached {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dirty: boolean;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

export class ElementCache {
  element: AbstractElement<string>;

  inner: CachedRectangle = new CachedRectangle(0, 0, 0, 0);
  outer: CachedRectangle = new CachedRectangle(0, 0, 0, 0);

  // x: CachedValue<number> = new CachedValue(0);
  // y: CachedValue<number> = new CachedValue(0);
  width: CachedValue<number> = new CachedValue(0);
  height: CachedValue<number> = new CachedValue(0);
  backgroundColor: CachedValue<RGBA> = new CachedValue(asRGBA(0, 0, 0, 0, '1'));
  backgroundImage: CachedValue<Texture> = new CachedValue(null);

  padding: {

  }

  constructor(element: AbstractElement<string>) {
    this.element = element;
  }

  /**
   *
   * @param force If true, render every value regardless of their dirty states.
   */
  calculate(tag: string, force: boolean = false) {

    this.calculateBackgroundColor(tag, force);
    // Calculate background-image before dimensions for <img> elements.
    this.calculateBackgroundImage(tag, force);

    this.calculateDimensions(tag, force);
  }

  calculateDimensions(tag: string, force: boolean) {
    const { element } = this;
    const { cssRuleset: style } = element;

    // [CSS] - width
    let width = formatNumValue(element, 'width', style.width);
    if (width == null) {
      if (tag == 'img') {
        const img = element as PWUIImg;
        if (img.width != null) {
          width = img.width;
        }
        else if (this.backgroundImage.value != null) {
          width = this.backgroundImage.value.getWidth();
        } else {
          width = 0;
        }
      } else {
        width = 0;
      }
    }

    // [CSS] - height
    let height = formatNumValue(element, 'height', style.height);
    if (height == null) {
      if (tag == 'img') {
        const img = element as PWUIImg;
        if (img.height != null) {
          height = img.height;
        }
        else if (this.backgroundImage.value != null) {
          height = this.backgroundImage.value.getHeight();
        } else {
          height = 0;
        }
      } else {
        height = 0;
      }
    }

    this.outer.x2 = this.outer.x1 + width;
    this.outer.y2 = this.outer.y1 + height;
    this.width.value = width;
    this.height.value = height;

    // [CSS] - left
    this.outer.x1 = formatNumValue(element, 'left', style.left);
    if (this.outer.x1 == null) {
      if (element.parent != null) this.outer.x1 = element.parent.cache.outer.x1;
      else this.outer.x1 = 0;
    }

    // [CSS] - top
    this.outer.y1 = formatNumValue(element, 'top', style.top);
    if (this.outer.y1 == null) {
      if (element.parent != null) this.outer.y1 = element.parent.cache.outer.y1;
      else this.outer.y1 = 0;
    }
  }

  calculateBackgroundColor(tag: string, force: boolean) {
    if (!this.backgroundColor.dirty && !force) return;

    const { element } = this;
    const { cssRuleset } = element;

    if (force || this.backgroundColor.dirty) {
      this.backgroundColor.value = formatColor(element, cssRuleset['background-color']);
      this.backgroundColor.dirty = false;
    }

  }

  calculateBackgroundImage(tag: string, force: boolean) {
    if (!this.backgroundColor.dirty && !force) return;

    const { element } = this;
    const { cssRuleset: style } = element;

    let backgroundImage = style['background-image'];
    if (backgroundImage != null && backgroundImage.indexOf('url(') !== -1) {
      backgroundImage = backgroundImage.replace('url(', '').replace(')', '');
      this.backgroundImage.value = TextureCache.getOrLoad(backgroundImage);
    }
    // If <img>, check src="" attribute.
    else if (tag == 'img') {
      const img = element as PWUIImg;
      if (img.src != null && img.src.length != 0) {
        this.backgroundImage.value = TextureCache.getOrLoad(img.src);
      } else {
        this.backgroundImage.value = null;
      }
    } else {
      this.backgroundImage.value = null;
    }
    this.backgroundImage.dirty = false;
  }
}

export const formatColor = (
  element: AbstractElement<string>,
  value: string
): RGBA => {
  value = value.toLowerCase().trim();
  if (value.indexOf('#') === 0) return parseHEX(value, '1');
  else if (value.indexOf('cmyk(') !== -1) {
    return { ...CMYK_2_RGB(parseCMYK(value), '1'), a: 1 };
  } else if (value.indexOf('rgb(') !== -1) {
    return { ...parseRGB(value, '1'), a: 1 };
  } else if (value.indexOf('rgba(') !== -1) {
    return parseRGBA(value, '1');
  } else if (value.indexOf('hsl(') !== -1) {
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
  element: AbstractElement<string>,
  property: string,
  value: string
): number => {
  // TODO: Implement alternative lengths at scale.
  if (value.endsWith('px')) {
    let calcVal = tonumber(value.replace('px', ''));
    if (element.parent != null) {
      if (property === 'left') {
        calcVal += element.parent.cache.outer.x1;
      } else if (property == 'right') {
        calcVal = element.parent.cache.outer.x2 - (calcVal - element.cache.width.value);
      } else if (property == 'top') {
        calcVal += element.parent.cache.outer.y1;
      } else if (property == 'bottom') {
        calcVal = element.parent.cache.outer.y2 - (calcVal - element.cache.height.value);
      }
    }
    return calcVal;
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
