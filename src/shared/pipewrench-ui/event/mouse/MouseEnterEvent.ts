import { MouseEvent } from "./MouseEvent";
import { MouseExitEvent } from "./MouseExitEvent";
import { RelatableEvent } from "./RelateableEvent";

export class MouseEnterEvent extends MouseEvent<'mouseenter'> implements RelatableEvent<MouseExitEvent> {

    relatedTarget?: MouseExitEvent;

    constructor() {
        super('mouseenter');
    }
}