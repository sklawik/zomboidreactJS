import { ISUIElement, RadialMenu, UIElement, UIManager } from "@asledgehammer/pipewrench";
import { AnyProps, Element, OptionalElementFunction } from "../PipeWrenchUI";
import { CSSRuleset } from "../css/CSS";
import { CSSReader } from "../css/CSSParser";
import { ElementCache } from "./ElementCache";

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

    /** The internal Java Object that is the handle in Project Zomboid's UI engine. */
    javaObject: UIElement | RadialMenu;

    /** The class names assigned to the element. */
    class?: string;

    /** The DOM ID of the element. */
    id: string | null = null;

    /** CSS style for the element specifically. */
    cssRuleset: CSSRuleset;
    style?: string;

    onupdate?: ((element: Element) => void);
    onprerender?: ((element: Element) => void);
    onrender?: ((element: Element) => void);

    /** The children assigned to the element. */
    readonly children: AbstractElement<string>[] = [];
    parent?: AbstractElement<string>;

    private _dirty: boolean = true;

    cache: ElementCache;

    constructor(tag: T, javaObject: UIElement | RadialMenu, props: AnyProps, children: Element[]) {
        this.tag = tag;
        this.cache = new ElementCache(this);

        // Handle properties.
        if (props['id'] != null) this.id = props['id'];
        if (props['class'] != null) this.class = props['class'];
        if (props['style'] != null) {
            this.style = props['style'] as string;
            this.cssRuleset = CSSReader.parseInline(this.style!);
        } else {
            this.style = null;
            this.cssRuleset = new CSSRuleset();
        }
        if (props['onupdate'] != null) this.onupdate = props['onupdate'];
        if (props['onprerender'] != null) this.onprerender = props['onprerender'];
        if (props['onrender'] != null) this.onrender = props['onrender'];

        // Handle children.
        for (const child of children) {
            if (child instanceof AbstractElement) {
                this.children.push(child);
                child.parent = this;
            }
        }

        this.javaObject = javaObject;
    }

    /** (Java-side hook into the mock ISUIElement) */
    update2(): void {
        // Calculate the values used by the element to position & render.
        this.cache.calculate(true);
        if (this.onupdate) this.onupdate(this);
    }

    /** (Java-side hook into the mock ISUIElement) */
    prerender(): void {
        if (this.onprerender) this.onprerender(this);
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

        this.renderBackground(x, y, w, h);

        if (this.onrender != null) this.onrender(this);
    }

    protected renderBackground(x: number, y: number, w: number, h: number) {
        // Draw the background of the element.
        const { value: backgroundColor } = this.cache.backgroundColor;
        const { value: texture } = this.cache.backgroundImage;

        if (backgroundColor != null && backgroundColor.a !== 0) {
            // (Only draw if the color isn't fully transparent)
            const { r, g, b, a } = backgroundColor;
            // print(`${r} ${g} ${b} ${a}`)
            this.javaObject?.DrawTextureScaledColor(texture, x, y, w, h, r, g, b, a);
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
            this.cssRuleset = CSSReader.parseInline(style);
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