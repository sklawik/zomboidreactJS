import { RelatableEvent } from "./RelateableEvent";
import { MouseEnterEvent } from "./MouseEnterEvent";
import { MouseData, MouseEvent } from "./MouseEvent";
import { HTMLElement } from "../../html/HTMLElement";
import { Event } from "../Event";

export class MouseExitEvent extends MouseEvent<'mouseexit'> implements RelatableEvent<MouseEnterEvent> {

    relatedTarget?: MouseEnterEvent;

    constructor(mouse: MouseData, target: HTMLElement<string>) {
        super('mouseexit', mouse, target);
    }

    cloneEvent(target: HTMLElement<string>): Event<string> {
        return new MouseExitEvent({ ...this, dx: this.movementX, dy: this.movementY }, target);
    }

    test(target: HTMLElement<string>): boolean {
        return false;
    }
}