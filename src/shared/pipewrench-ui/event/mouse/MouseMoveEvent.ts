import { HTMLElement } from "../../html/HTMLElement";
import { Rectangle } from "../../util/Rectangle";
import { Event } from "../Event";
import { MouseData, MouseEvent } from "./MouseEvent";

/**
 * The **MouseMoveEvent** is fired at an element when a pointing device (usually a mouse) is moved
 * while the cursor's hotspot is inside it.
 * 
 * @author mozilla.org, asledgehammer
 */
export class MouseMoveEvent extends MouseEvent<'mousemove'> {

    constructor(mouse: MouseData, target: HTMLElement<string>) {
        super('mousemove', mouse, target);
    }

    cloneEvent(target: HTMLElement<string>): Event<string> {
        return new MouseMoveEvent({ ...this, dx: this.movementX, dy: this.movementY }, target);
    }

    test(target: HTMLElement<string>): boolean {
        const { x1, y1, x2, y2 } = target.cache.outer;
        const result = Rectangle.testPoint(x1, y1, x2, y2, this.screenX, this.screenY);
        // print(`[${target.tag}].test(x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}, mx: ${this.screenX}, my: ${this.screenY}) = ${result}`);
        return result;
    }
}