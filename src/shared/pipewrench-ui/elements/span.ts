import { Element, UIElement } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';
import { AbstractElement, CSS_DEFAULT_ELEMENT, IAbstractElementAttributes } from './AbstractElement';

export const CSS_DEFAULT_SPAN = {
  ...CSS_DEFAULT_ELEMENT
};

export interface IPWUISpanAttributes extends IAbstractElementAttributes { }

export type SpanProps = Props & {};

export class PWUISpan extends AbstractElement<'span'> {

  constructor(props: SpanProps, children: Element[], text: string) {
    super('span', CSS_DEFAULT_SPAN, props, children);
    this.javaObject = new UIElement(this);
    this.innerText = text;
  }
}
