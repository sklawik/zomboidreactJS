import { getMouseX, getMouseY, isMouseButtonDown } from "@asledgehammer/pipewrench";
import { int } from "../util/Alias";
import { MouseMoveEvent } from "../event/mouse/MouseMoveEvent";
import { HTMLElement } from "../html/HTMLElement";

export const MOUSE_BUTTON_LEFT = 0;
export const MOUSE_BUTTON_RIGHT = 1;
export const MOUSE_BUTTON_WHEEL = 2;

export class HTMLMouse {

    screenX: int;
    screenY: int;
    dx: int;
    dy: int;

    buttons: boolean[] = [false, false, false];
    buttonsLast: boolean[] = [false, false, false];

    constructor() {
        this.screenX = -1;
        this.screenY = -1;
        this.dx = 0;
        this.dy = 0;
    }

    update() {
        // Grab the updated mouse coordinates.
        const mx = getMouseX();
        const my = getMouseY();

        // Update the delta coordinates.
        this.dx = mx - this.screenX;
        this.dy = my - this.screenY;

        // Finally, set the updated mouse coordinates.
        this.screenX = mx;
        this.screenY = my;

        // Grab the new button presses.
        for (let index = 0; index < this.buttons.length; index++) {
            this.buttons[index] = isMouseButtonDown(index);
        }

        // Next, we compare the states for changes to fire events.
        for (let index = 0; index < this.buttons.length; index++) {
            // A press or release has occurred.
            if (this.buttons[index] !== this.buttonsLast[index]) {
                const pressOrRelease = this.buttons[index];
                if (pressOrRelease) {
                    print('mousedown = ' + index);
                } else {
                    print('mouseup = ' + index);
                }
            }
        }

        // Finally, we set the new button-press states.
        for (let index = 0; index < this.buttons.length; index++) {
            this.buttonsLast[index] = this.buttons[index];
        }
    }

    newMoveEvent(target: HTMLElement<string>): MouseMoveEvent {
        const event = new MouseMoveEvent(this, target);
        return event;
    }

    /** @returns True if the mouse moved within the last update. */
    get moved(): boolean {
        return this.dx != 0 || this.dy != 0;
    }
}