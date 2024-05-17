import { HTMLElement, CSS_DEFAULT_ELEMENT, IHTMLElementAttributes } from '../HTMLElement';
import { AnyProps, ReactElement } from '../../React';

export interface BodyAttributes extends IHTMLElementAttributes { }

export const CSS_DEFAULT_BODY = {
    ...CSS_DEFAULT_ELEMENT,
    'width': '100%',
    'height': '100%',
};

export class HTMLBodyElement extends HTMLElement<'body'> implements BodyAttributes {
    constructor(props: AnyProps, children: ReactElement[]) {
        super('body', CSS_DEFAULT_BODY, props, children);
    }
}
