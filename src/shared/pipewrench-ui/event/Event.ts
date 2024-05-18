import { HTMLElement } from "../html/HTMLElement";

export abstract class Event<Type extends string> {

    readonly _type: Type;

    constructor(_type: Type) {
        this._type = _type;
    }

    abstract cloneEvent(target: HTMLElement<string>): Event<string>;

    abstract test(target: HTMLElement<string>): boolean;
}
