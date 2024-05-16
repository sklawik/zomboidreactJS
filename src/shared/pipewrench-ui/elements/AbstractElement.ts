import { RadialMenu, UIElement, UIFont, UIManager } from "@asledgehammer/pipewrench";
import { AnyProps, Element, OptionalElementFunction } from "../PipeWrenchUI";
import { CSSRuleset } from "../css/CSS";
import { CSSReader } from "../css/CSSParser";
import { PWUIImg } from "./img";
import { TextureCache } from "../TextureCache";
import { formatColor, formatNumValue } from "../util/Format";
import { ElementCache } from "../cache";

export const CSS_DEFAULT_ELEMENT = {
    'background-color': 'transparent',
    'color': 'rgba(0, 0, 0, 1)'
};

export interface IAbstractElementAttributes {
    style?: string;
    class?: string;
    id?: string;
    onupdate?: OptionalElementFunction;
    onprerender?: OptionalElementFunction;
    onrender?: OptionalElementFunction;
}

export abstract class AbstractElement<T extends string> implements Element, IAbstractElementAttributes {

    tag: T;

    innerText: string;

    /** The internal Java Object that is the handle in Project Zomboid's UI engine. */
    javaObject: UIElement | RadialMenu;

    /** The class names assigned to the element. */
    class?: string;

    /** The DOM ID of the element. */
    id: string | null = null;

    /** CSS style for the element specifically. */
    cssRuleset: CSSRuleset;
    readonly cssRulesetDefault: { [rule: string]: string };
    style?: string;

    onupdate?: ((element: Element) => void);
    onprerender?: ((element: Element) => void);
    onrender?: ((element: Element) => void);

    /** The children assigned to the element. */
    readonly children: AbstractElement<string>[] = [];
    parent?: AbstractElement<string>;

    private _dirty: boolean = true;

    cache: ElementCache;

    flagToRemove: boolean = false;

    constructor(tag: T, defaultCSS: { [rule: string]: string }, props: AnyProps, children: Element[]) {
        this.tag = tag;
        this.cssRulesetDefault = defaultCSS;
        this.cache = new ElementCache(this);

        // Handle properties.
        if (props['id'] != null) this.id = props['id'];
        if (props['class'] != null) this.class = props['class'];
        if (props['style'] != null) {
            this.style = props['style'] as string;
            this.cssRuleset = CSSReader.parseInline(defaultCSS, this.style!);
        } else {
            this.style = null;
            this.cssRuleset = new CSSRuleset(defaultCSS);
        }
        if (props['onupdate'] != null) this.onupdate = props['onupdate'];
        if (props['onprerender'] != null) this.onprerender = props['onprerender'];
        if (props['onrender'] != null) this.onrender = props['onrender'];

        // Handle children.
        if (children && children.length) {
            for (let index = 0; index < children.length; index++) {
                const child = children[index] as AbstractElement<string>;
                this.children.push(child);
                child.parent = this;
            }
        }
    }

    /** (Java-side hook into the mock ISUIElement) */
    update2(): void {

        if (this.checkRemovalFlag()) return;

        this.updateInternal();

        // Calculate the values used by the element to position & render.
        this.calculate(true);

        if (this.onupdate) this.onupdate(this);

        this.updateChildren();
    }

    protected updateInternal() { }

    /**
     * Check to see if this needs to be removed.
     */
    protected checkRemovalFlag(): boolean {
        if (this.flagToRemove) {
            if (this.parent && this.parent.children.length) {
                const indexOf = this.parent.children.indexOf(this);
                if (indexOf !== -1) this.parent.children.splice(indexOf, 1);
                this.parent = null;
            }
            this.flagToRemove = false;
            return true;
        }

        return false;
    }

    protected updateChildren() {
        if (this.children.length != 0) {
            for (const child of this.children) {
                if (child != null && child.update2 != null) child.update2();
            }
        }
    }

    calculate(force: boolean) {
        this.calculateBackgroundColor(force);
        // Calculate background-image before dimensions for <img> elements.
        this.calculateBackgroundImage(force);

        this.calculateDimensions(force);
    }

    calculateDimensions(force: boolean) {
        const element = this;
        const { cache, cssRuleset: style, tag } = this;

        // [CSS] - width
        let width = formatNumValue(element, 'width', style.width);
        if (width == null) {
            if (tag == 'img') {
                const img = (element as any) as PWUIImg;
                if (img.width != null) {
                    width = img.width;
                }
                else if (cache.backgroundImage.value != null) {
                    width = cache.backgroundImage.value.getWidth();
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
                const img = (element as any) as PWUIImg;
                if (img.height != null) {
                    height = img.height;
                }
                else if (cache.backgroundImage.value != null) {
                    height = cache.backgroundImage.value.getHeight();
                } else {
                    height = 0;
                }
            } else {
                height = 0;
            }
        }

        cache.outer.x2 = cache.outer.x1 + width;
        cache.outer.y2 = cache.outer.y1 + height;
        cache.width.value = width;
        cache.height.value = height;

        // [CSS] - left
        cache.outer.x1 = formatNumValue(element, 'left', style.left);
        if (cache.outer.x1 == null) {
            if (element.parent != null) cache.outer.x1 = element.parent.cache.outer.x1;
            else cache.outer.x1 = 0;
        }

        // [CSS] - top
        cache.outer.y1 = formatNumValue(element, 'top', style.top);
        if (cache.outer.y1 == null) {
            if (element.parent != null) cache.outer.y1 = element.parent.cache.outer.y1;
            else cache.outer.y1 = 0;
        }
    }

    calculateBackgroundColor(force: boolean) {
        const element  = this;
        const { cache, cssRuleset } = this;

        if (!cache.backgroundColor.dirty && !force) return;

        if (force || cache.backgroundColor.dirty) {
            cache.backgroundColor.value = formatColor(element, cssRuleset['background-color']);
            cache.backgroundColor.dirty = false;
        }

    }

    calculateBackgroundImage(force: boolean) {

        const element  = this;
        const { cache, cssRuleset, tag } = this;

        if (!cache.backgroundColor.dirty && !force) return;

        let backgroundImage = cssRuleset['background-image'];
        if (backgroundImage != null && backgroundImage.indexOf('url(') !== -1) {
            backgroundImage = backgroundImage.replace('url(', '').replace(')', '');
            cache.backgroundImage.value = TextureCache.getOrLoad(backgroundImage);
        }
        // If <img>, check src="" attribute.
        else if (tag == 'img') {
            const img = (element as any) as PWUIImg;
            if (img.src != null && img.src.length != 0) {
                cache.backgroundImage.value = TextureCache.getOrLoad(img.src);
            } else {
                cache.backgroundImage.value = null;
            }
        } else {
            cache.backgroundImage.value = null;
        }
        cache.backgroundImage.dirty = false;
    }

    /** (Java-side hook into the mock ISUIElement) */
    prerender(): void {
        if (this.onprerender) this.onprerender(this);

        // Pre-render children.
        if (this.children.length != 0) {
            for (const child of this.children) {
                if (child != null && child.prerender != null) child.prerender();
            }
        }

        this._dirty = false;
    }

    /** (Java-side hook into the mock ISUIElement) */
    render(): void {
        // print(`[${this.tag}] => render()`);
        if (this.javaObject != null) {
            const x = this.cache.outer.x1;
            const y = this.cache.outer.y1;
            const w = this.cache.width.value;
            const h = this.cache.height.value;

            // No area to render, or missing data.
            if (x == null || y == null || w == null || w == 0 || h == null || h == 0) {
                print(`[${this.tag}] => x: ${x}, y: ${y}, w: ${w}, h: ${h}`);
            } else {
                // Set dimensions.
                this.javaObject.setX(x);
                this.javaObject.setY(y);
                this.javaObject.setWidth(w);
                this.javaObject.setHeight(h);

                this.renderBackground(x, y, w, h);
                this.renderText(this.innerText, x, y, w, h);
            }
        }

        if (this.onrender) this.onrender(this);

        // Render children.
        if (this.children.length != 0) {
            for (let index = 0; index < this.children.length; index++) {
                const child = this.children[index];
                if (child != null && child.render != null) child.render();
            }
        }
    }

    protected renderBackground(x: number, y: number, w: number, h: number) {

        if (this.javaObject == null) return;

        // Draw the background of the element.
        const { value: backgroundColor } = this.cache.backgroundColor;
        const { value: texture } = this.cache.backgroundImage;

        // print(texture);
        // print(backgroundColor);

        if (texture != null) {
            // (Only draw if the color isn't fully transparent)
            if (backgroundColor == null || backgroundColor.a != 0) {
                const { r, g, b, a } = backgroundColor;
                this.javaObject.DrawTextureScaledColor(texture, x, y, w, h, r, g, b, a);
            }
        } else {
            if (backgroundColor == null || backgroundColor.a != 0) {
                const { r, g, b, a } = backgroundColor;
                this.javaObject.DrawTextureScaledColor(null, x, y, w, h, r, g, b, a);
            }
        }
    }

    /**
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
        if (text != null && text.length != 0) {
            this.javaObject.DrawText(UIFont.Large, text, x, y, 1, 1, 1, 1);
        }
    }

    /**
     * (Hook from UIElement when a resize occurs)
     */
    onResize() {
        this._dirty = true;
    }

    addToUIManager() {
        UIManager.AddUI(this.javaObject);
    }

    /**
     * Sets the CSS for the element specifically.
     *
     * @param style Either a built CSSProfile or a raw string of CSS.
     */
    setStyle(style: CSSRuleset | string) {
        if (style instanceof CSSRuleset) {
            this.cssRuleset = style;
        } else {
            this.cssRuleset = CSSReader.parseInline(this.cssRulesetDefault, style);
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
} 