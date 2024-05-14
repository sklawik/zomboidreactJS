import { Element, RadialMenu } from "@asledgehammer/pipewrench";
import { AbstractElement, IAbstractElementAttributes } from "./AbstractElement";
import { AnyProps } from "../PipeWrenchUI";

export const CSS_DEFAULTS_RADIALMENU = {
    'background-color': 'transparent'
};

export interface IPWUIRadialMenuAttributes extends IAbstractElementAttributes { }

export class PWUIRadialMenu extends AbstractElement<'radialmenu'> implements IPWUIRadialMenuAttributes {

    constructor(props: AnyProps, children: Element[]) {
        super('radialmenu', CSS_DEFAULTS_RADIALMENU, props, children);
        this.javaObject = new RadialMenu(0, 0, 0, 0);
        this.javaObject.setTable(this);
    }
}