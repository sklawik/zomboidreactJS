import { Texture, UIFont, toInt } from '@asledgehammer/pipewrench';
import { HTMLElement, CSS_DEFAULT_ELEMENT, IHTMLElementAttributes } from '../HTMLElement';
import { asRGBA } from '../../css/color/RGBA';
import { TextureCache } from '../../TextureCache';
import { AnyProps, ReactElement } from '../../React';
import { getUIElement } from '../PZ';
import { tPrint } from '../../util/table';

const COLOR_WHITE = asRGBA(1, 1, 1, 1, "1");
const COLOR_TRANSPARENT = asRGBA(1, 1, 1, 0, "1");

let TEX_BROKEN_IMG: Texture | undefined = undefined;

export interface ImageAttributes extends IHTMLElementAttributes {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

export const CSS_DEFAULT_IMG = {
  ...CSS_DEFAULT_ELEMENT,
  'background-color': 'rgba(255,255,255,1)',
  'display': 'inline-block',
};

export class HTMLImageElement extends HTMLElement<'img'> implements ImageAttributes {

  src?: string;
  alt?: string;
  width?: number;
  height?: number;

  constructor(props: AnyProps, children: ReactElement[]) {
    super('img', CSS_DEFAULT_IMG, props, children);

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

    const javaObject = getUIElement();

    // Draw the background of the element.
    let { value: backgroundColor } = this.cache.backgroundColor;
    const { value: texture } = this.cache.backgroundImage;

    if (texture != null) {
      // <img> doesn't need a background-color to render the texture.
      if (backgroundColor == null) backgroundColor = COLOR_WHITE;
      let { r, g, b, a } = backgroundColor;
      if (a != 0) {
        javaObject.DrawTextureScaledColor(texture, x, y, w, h, r, g, b, a);
      }
    } else {
      // <img> background-color should by default be transparent if unresolved.
      const { r, g, b, a } = backgroundColor;
      if (backgroundColor != null && a != 0) {
        javaObject.DrawTextureScaledColor(null, x, y, w, h, r, g, b, a);
      }
    }
  }

  protected renderText(text: string, x: number, y: number, w: number, h: number) {
    const { alt } = this;
    const { value: texture } = this.cache.backgroundImage;

    const javaObject = getUIElement();

    if (texture == null && alt != null && alt.length != 0) {
      javaObject.DrawTextureScaled(TEX_BROKEN_IMG, x + 1, y, 21, 24, 1);
      javaObject.DrawText(UIFont.Large, alt, x + 26, y, 0, 0, 0, 1);
    }
  }
}
