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

export class CachedValue<Type> {
  value: Type;
  dirty: boolean;
  constructor(value: Type) {
    this.value = value;
    this.dirty = true;
  }
}

export class ElementCache {
  element: AbstractElement<string>;

  x: CachedValue<number> = new CachedValue(0);
  y: CachedValue<number> = new CachedValue(0);
  width: CachedValue<number> = new CachedValue(0);
  height: CachedValue<number> = new CachedValue(0);
  backgroundColor: CachedValue<RGBA> = new CachedValue(asRGBA(0, 0, 0, 0, '1'));
  backgroundImage: CachedValue<Texture> = new CachedValue(null);

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

    // [CSS] - left
    this.x.value = formatNumValue(element, 'left', style.left);
    if (this.x.value == null) {
      if (element.parent != null) this.x.value = element.parent.cache.x.value;
      else this.x.value = 0;
    }

    // [CSS] - top
    this.y.value = formatNumValue(element, 'top', style.top);
    if (this.y.value == null) {
      if (element.parent != null) this.y.value = element.parent.cache.y.value;
      else this.y.value = 0;
    }

    // [CSS] - width
    this.width.value = formatNumValue(element, 'width', style.width);
    if (this.width.value == null) {
      if (tag == 'img') {
        const img = element as PWUIImg;
        if (img.width != null) {
          this.width.value = img.width;
        }
        else if (this.backgroundImage.value != null) {
          this.width.value = this.backgroundImage.value.getWidth();
        } else {
          this.width.value = 0;
        }
      } else {
        this.width.value = 0;
      }
    }

    // [CSS] - height
    this.height.value = formatNumValue(element, 'height', style.height);
    if (this.height.value == null) {
      if (tag == 'img') {
        const img = element as PWUIImg;
        if (img.height != null) {
          this.height.value = img.height;
        }
        else if (this.backgroundImage.value != null) {
          this.height.value = this.backgroundImage.value.getHeight();
        } else {
          this.height.value = 0;
        }
      } else {
        this.height.value = 0;
      }
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
      calcVal += element.parent.cache.x.value;
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
