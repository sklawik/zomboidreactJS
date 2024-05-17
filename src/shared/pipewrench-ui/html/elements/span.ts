import { Element } from '@asledgehammer/pipewrench';
import { HTMLElement, CSS_DEFAULT_ELEMENT, IHTMLElementAttributes } from '../HTMLElement';
import { Props } from '../../React';

export const CSS_DEFAULT_SPAN = {
  ...CSS_DEFAULT_ELEMENT
};

export interface SpanAttributes extends IHTMLElementAttributes { }

export type SpanProps = Props & {};

export class HTMLSpanElement extends HTMLElement<'span'> {
  constructor(props: SpanProps, children: Element[], text: string) {
    super('span', CSS_DEFAULT_SPAN, props, children);
    this.innerText = text;
  }
}
