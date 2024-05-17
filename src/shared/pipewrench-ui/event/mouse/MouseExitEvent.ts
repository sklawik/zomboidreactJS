import { RelatableEvent } from "./RelateableEvent";
import { MouseEnterEvent } from "./MouseEnterEvent";
import { MouseEvent } from "./MouseEvent";

export class MouseExitEvent extends MouseEvent<'mouseexit'> implements RelatableEvent<MouseEnterEvent> {

    relatedTarget?: MouseEnterEvent;

    constructor() {
        super('mouseexit');
    }

}