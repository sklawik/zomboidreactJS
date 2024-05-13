import { RadialMenu } from "@asledgehammer/pipewrench";
import { AbstractElement, IAbstractElementAttributes } from "./AbstractElement";

export interface IPWUIRadialMenuAttributes extends IAbstractElementAttributes {}

export class PWUIRadialMenu extends AbstractElement<'radialmenu'> implements IPWUIRadialMenuAttributes {

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        props: { [name: string]: any },
        children?: AbstractElement<string>[]
    ) {
        super(
            'radialmenu',
            new RadialMenu(x, y, width, height),
            props,
            children
        );
    }
}