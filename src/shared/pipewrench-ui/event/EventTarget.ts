import { Event } from "./Event";

export type EventListener = (event: Event<string>) => void;

export type AddEventListenerOptions = {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
    signal?: boolean;
}

export type RemoveEventListenerOptions = {
    capture?: boolean;
}

export interface EventTarget {
    dispatchEvent(event: Event<string>): void;
    addEventListener(type: string, listener: Function, options?: AddEventListenerOptions | boolean): void;
    removeEventListener(type: string, listener: Function, options?: RemoveEventListenerOptions | boolean): void;
}