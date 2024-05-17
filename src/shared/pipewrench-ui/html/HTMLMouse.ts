import { getMouseX, getMouseY } from "@asledgehammer/pipewrench";
import { int } from "../util/Alias";

export class HTMLMouse {

    screenX: int;
    screenY: int;
    dx: int;
    dy: int;

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
    }

    /** @returns True if the mouse moved within the last update. */
    get moved(): boolean {
        return this.dx != 0 || this.dy != 0;
    }
}