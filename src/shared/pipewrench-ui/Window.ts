import { HTMLMouse } from "./html/HTMLMouse";
import { int } from "./util/Alias";

export class Window {
    mouse: HTMLMouse;

    constructor() {
        this.mouse = new HTMLMouse();
    }

    update() {
        this.mouse.update();

        if (this.mouse.moved) {
            this.onMouseMove(this.mouse.screenX, this.mouse.screenY, this.mouse.dx, this.mouse.dy);
        }
    }

    onMouseMove(x: int, y: int, dx: int, dy: int) {
        print('onMouseMove: x: ' + x + ', y: ' + y + ', dx: ' + dx + ', dy: ' + dy);
    }
}
