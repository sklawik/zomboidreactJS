import { Event } from "./event/Event";
import { document } from "./html/elements/html";
import { HTMLMouse } from "./input/HTMLMouse";

import * as JSON from './util/JSON';

export class Window {
    mouse: HTMLMouse;

    constructor() {
        this.mouse = new HTMLMouse();
    }

    update() {
        this.mouse.update();

        if (this.mouse.moved) {
            this.triggerEvent(this.mouse.newMoveEvent(document));
        }
    }

    triggerEvent(event: Event<string>) {
        document.dispatchEvent(event);
        // print(JSON.stringify(event));
    }
}

export let window: Window = new Window();
