import { CSSRuleset } from '../css/CSS';
import { CSSReader } from '../css/CSSParser';
import { UIElement, UIManager } from '@asledgehammer/pipewrench';
import { AnyProps, Element, OptionalFunction } from '../PipeWrenchUI';
import { ElementCache } from './ElementCache';

export interface I_PWUIElement {
  style?: string;
  class?: string;
  id?: string;
  'on-update'?: OptionalFunction;
  'on-prerender'?: OptionalFunction;
  'on-render'?: OptionalFunction;
}

/**
 * **PWUIElement is the generic root-element that all PWUI components derive.
 *
 * @author JabDoesThings
 */
export class PWUIElement implements Element {
  /** The element's static-type ID. */
  readonly type: string = 'element';

  /** The internal Java Object that is the handle in Project Zomboid's UI engine. */
  javaObject: UIElement;

  /** The class names assigned to the element. */
  class: string[] = [];

  /** The DOM ID of the element. */
  id: string | null = null;

  parent: PWUIElement | null = null;

  /** The children assigned to the element. */
  children: PWUIElement[] = [];

  /** CSS style for the element specifically. */
  style: CSSRuleset;

  cache: ElementCache;

  protected _style: string | null = null;

  private _dirty: boolean = true;

  constructor(props: AnyProps, children: (PWUIElement | Element)[]) {
    this.cache = new ElementCache(this);

    // Handle properties.
    if (props['id'] != null) this.id = props['id'];
    if (props['class'] != null) this.class = props['class'];
    if (props['style'] != null) {
      this._style = props['style'];
      this.style = CSSReader.parseInline(this._style!);
    } else {
      this._style = null;
      this.style = new CSSRuleset();
    }
    if (props['on-update'] != null) this.onUpdate = props['on-update'];
    if (props['on-prerender'] != null) this.onPreRender = props['on-prerender'];
    if (props['on-render'] != null) this.onRender = props['on-render'];

    // Handle children.
    for (const child of children) {
      if (child instanceof PWUIElement) {
        this.children.push(child);
        child.parent = this;
      } else {
        // Reserved for special elements.
      }
    }

    this.javaObject = new UIElement(this);
  }

  /** (Java-side hook into the mock ISUIElement) */
  update(): void {
    if (this.onUpdate != null) this.onUpdate();
  }

  /** (Java-side hook into the mock ISUIElement) */
  prerender(): void {
    if (this.onPreRender != null) this.onPreRender();

    // Calculate the values used by the element to position & render.
    this.cache.calculate(this._dirty);
    this._dirty = false;
  }

  /** (Java-side hook into the mock ISUIElement) */
  render(): void {
    const x = this.cache.x.value;
    const y = this.cache.y.value;
    const w = this.cache.width.value;
    const h = this.cache.height.value;

    // print(`${x} ${y} ${w} ${h}`);

    // Set dimensions.
    this.javaObject?.setX(x);
    this.javaObject?.setY(y);
    this.javaObject?.setWidth(w);
    this.javaObject?.setHeight(h);

    // Draw the background of the element.
    const { value: backgroundColor } = this.cache.backgroundColor;
    if (backgroundColor.a !== 0) {
      // (Only draw if the color isn't fully transparent)
      const { r, g, b, a } = backgroundColor;
      // print(`${r} ${g} ${b} ${a}`)
      this.javaObject?.DrawTextureScaledColor(null, x, y, w, h, r, g, b, a);
    }

    if (this.onRender != null) this.onRender();
  }

  /**
   * (Hook from UIElement when a resize occurs)
   */
  onResize() {
    this._dirty = true;
  }

  addToUIManager() {
    UIManager.AddUI(this.javaObject!!);
  }

  /**
   * Sets the CSS for the element specifically.
   *
   * @param style Either a built CSSProfile or a raw string of CSS.
   */
  setStyle(style: CSSRuleset | string) {
    if (style instanceof CSSRuleset) {
      this.style = style;
    } else {
      this.style = CSSReader.parseInline(style);
    }
    this.setDirty();
  }

  isDirty(): boolean {
    return this._dirty;
  }

  setDirty() {
    this._dirty = true;
  }

  hasParent(): boolean {
    return this.parent != null;
  }

  hasChildren(): boolean {
    return this.children.length !== 0;
  }

  protected onUpdate() {}
  protected onPreRender() {}
  protected onRender() {}
}
