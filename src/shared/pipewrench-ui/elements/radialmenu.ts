import { Element, RadialMenu } from "@asledgehammer/pipewrench";
import { AbstractElement, CSS_DEFAULT_ELEMENT, IAbstractElementAttributes } from "./AbstractElement";
import { AnyProps } from "../PipeWrenchUI";

export const CSS_DEFAULT_RADIALMENU = {
    ...CSS_DEFAULT_ELEMENT
};

export interface IPWUIRadialMenuAttributes extends IAbstractElementAttributes { }

export class PWUIRadialMenu extends AbstractElement<'radialmenu'> implements IPWUIRadialMenuAttributes {
    constructor(props: AnyProps, children: Element[]) {
        super('radialmenu', CSS_DEFAULT_RADIALMENU, props, children);
        this.javaObject = new RadialMenu(0, 0, 0, 0);
        this.javaObject.setTable(this);
    }
}