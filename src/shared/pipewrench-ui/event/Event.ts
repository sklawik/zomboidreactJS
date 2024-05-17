export class Event<Type extends string> {

    readonly _type: Type;

    constructor(_type: Type) {
        this._type = _type;
    }
}
