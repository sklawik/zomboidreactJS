import { int } from "../../util/Alias";
import { Event } from "../Event";

export class MouseEvent<Type extends string> extends Event<Type> {

    /** Returns true if the alt key was down when the mouse event was fired. */
    readonly altKey: boolean;

    /** Returns true if the control key was down when the mouse event was fired. */
    readonly ctrlKey: boolean;

    /** Returns true if the meta key was down when the mouse event was fired. */
    readonly metaKey: boolean;

    /** Returns true if the shift key was down when the mouse event was fired. */
    readonly shiftKey: boolean;



    /** The button number that was pressed (if applicable) when the mouse event was fired. */
    readonly button: int;

    /** The buttons being pressed (if any) when the mouse event was fired. */
    readonly buttons: int;



    /** The X coordinate of the mouse pointer in [viewport coordinates](https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#viewport). */
    readonly clientX: int;

    /** The Y coordinate of the mouse pointer in [viewport coordinates](https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#viewport). */
    readonly clientY: int;

    /** The X coordinate of the mouse pointer relative to the position of the last [MouseMoveEvent](./MouseMoveEvent.ts). */
    readonly movementX: int;

    /** The Y coordinate of the mouse pointer relative to the position of the last [MouseMoveEvent](./MouseMoveEvent.ts). */
    readonly movementY: int;

    /** The X coordinate of the mouse pointer relative to the position of the padding edge of the target node. */
    readonly offsetX: int;

    /** The Y coordinate of the mouse pointer relative to the position of the padding edge of the target node. */
    readonly offsetY: int;

    /** The X coordinate of the mouse pointer relative to the whole document. */
    readonly pageX: int;

    /** The Y coordinate of the mouse pointer relative to the whole document. */
    readonly pageY: int;

    /** The X coordinate of the mouse pointer in [screen coordinates](https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#viewport). */
    readonly screenX: int;

    /** The Y coordinate of the mouse pointer in [screen coordinates](https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#viewport). */
    readonly screenY: int;

    /**
     * Alias for MouseEvent.clientX.
     */
    public get x() {
        return this.clientX;
    }

    /**
     * Alias for MouseEvent.clientY.
     */
    public get y() {
        return this.clientY;
    }

    constructor(_type: Type) {
        super(_type);
    }
}