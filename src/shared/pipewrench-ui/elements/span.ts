import { Element, UIElement } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';

export const CSS_DEFAULT_SPAN = {
  'background-color': 'transparent',
  'color': 'rgba(255, 255, 255, 1)'
};

export interface IPWUISpanAttributes extends IAbstractElementAttributes { }

export type SpanProps = Props & {};

export class PWUISpan extends AbstractElement<'span'> {

  constructor(props: SpanProps, children: Element[], text: string) {
    super('span', CSS_DEFAULT_SPAN, props, children);
    this.javaObject = new UIElement(this);
    this.text = text;
  }
}
