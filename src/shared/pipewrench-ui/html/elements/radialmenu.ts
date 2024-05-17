import { Element, RadialMenu, UIManager } from "@asledgehammer/pipewrench";
import { HTMLElement, CSS_DEFAULT_ELEMENT, IHTMLElementAttributes } from "../HTMLElement";
import { AnyProps } from "../../React";

export const CSS_DEFAULT_RADIALMENU = {
    ...CSS_DEFAULT_ELEMENT
};

export interface RadialMenuAttributes extends IHTMLElementAttributes { }

export class HTMLRadialMenu extends HTMLElement<'radialmenu'> implements RadialMenuAttributes {
    constructor(props: AnyProps, children: Element[]) {
        super('radialmenu', CSS_DEFAULT_RADIALMENU, props, children);
    }
}