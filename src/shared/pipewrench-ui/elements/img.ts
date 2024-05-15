import { Texture, UIElement, UIFont, toInt } from '@asledgehammer/pipewrench';
import { AnyProps, Element } from '../PipeWrenchUI';
import { AbstractElement, CSS_DEFAULT_ELEMENT, IAbstractElementAttributes } from './AbstractElement';
import { asRGBA } from '../css/color/RGBA';
import { TextureCache } from '../TextureCache';

const COLOR_WHITE = asRGBA(1, 1, 1, 1, "1");
const COLOR_TRANSPARENT = asRGBA(1, 1, 1, 0, "1");

let TEX_BROKEN_IMG: Texture | undefined = undefined;

export interface IPWUIImageAttributes extends IAbstractElementAttributes {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

export const CSS_DEFAULT_IMG = {
  ...CSS_DEFAULT_ELEMENT,
  'background-color': 'transparent',
  'display': 'inline-block',
};

export class PWUIImg extends AbstractElement<'img'> implements IPWUIImageAttributes {

  src?: string;
  alt?: string;
  width?: number;
  height?: number;

  constructor(props: AnyProps, children: Element[]) {
    super('img', CSS_DEFAULT_IMG, props, children);
    this.javaObject = new UIElement(this);

    if (TEX_BROKEN_IMG == undefined) {
      TEX_BROKEN_IMG = TextureCache.getOrLoad('media/textures/broken_image.png');
    }

    // Handle <img> attributes.
    if (props['src'] != null) this.src = `${props['src']}`;
    if (props['alt'] != null) this.alt = `${props['alt']}`;
    else if (this.src != null) this.alt = this.src;
    if (props['width'] != null) this.width = toInt(tonumber(props['width']));
    if (props['height'] != null) this.height = toInt(tonumber(props['height']));
  }

  protected renderBackground(x: number, y: number, w: number, h: number) {

    if (this.javaObject == null) return;

    // Draw the background of the element.
    let { value: backgroundColor } = this.cache.backgroundColor;
    const { value: texture } = this.cache.backgroundImage;

    // print(texture);
    // print(backgroundColor);

    if (texture != null) {
      // <img> doesn't need a background-color to render the texture.
      if (backgroundColor == null) backgroundColor = COLOR_WHITE;
      if (backgroundColor.a != 0) {
        const { r, g, b, a } = backgroundColor;
        this.javaObject.DrawTextureScaledColor(texture, x, y, w, h, r, g, b, a);
      }
    } else {
      // <img> background-color should by default be transparent if unresolved.
      if (backgroundColor != null && backgroundColor.a != 0) {
        const { r, g, b, a } = backgroundColor;
        this.javaObject.DrawTextureScaledColor(null, x, y, w, h, r, g, b, a);
      }
    }
  }

  /**
   * @override
   * 
   * @param text 
   * @param x 
   * @param y 
   * @param w 
   * @param h 
   * 
   * @returns 
   */
  protected renderText(text: string, x: number, y: number, w: number, h: number) {
    if (this.javaObject == null) return;

    const { alt } = this;
    const { value: texture } = this.cache.backgroundImage;

    if (texture == null && alt != null && alt.length != 0) {
      this.javaObject.DrawTextureScaled(TEX_BROKEN_IMG, x + 1, y, 21, 24, 1);
      this.javaObject.DrawText(UIFont.Large, alt, x + 26, y, 0, 0, 0, 1);
    }
  }
}
