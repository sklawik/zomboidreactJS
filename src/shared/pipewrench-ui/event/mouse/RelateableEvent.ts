import { Event } from "../Event";

/**
 * *RelatableEvent*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
 * 
 * @author mozilla.org, asledgehammer
 */
export interface RelatableEvent<OtherEvent extends Event<string>> {

    /** 
     * The `MouseEvent.relatedTarget` read-only property is the secondary target for the
     * [MouseEvent](./MouseEvent.ts), if there is one. 
     */
    relatedTarget?: OtherEvent;
}
