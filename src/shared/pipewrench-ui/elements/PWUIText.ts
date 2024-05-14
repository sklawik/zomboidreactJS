import { Element, UIElement } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';

export const CSS_DEFAULTS_TEXTAREA = {
  'background-color': 'transparent',
  'color': 'rgba(255, 255, 255, 1)'
};

export interface IPWUITextAreaAttributes extends IAbstractElementAttributes { }

export type TextProps = Props & {};

export class PWUIText extends AbstractElement<'text'> {

  constructor(props: TextProps, children: Element[], text: string) {
    super('text', CSS_DEFAULTS_TEXTAREA, props, children);
    this.text = text;
    this.javaObject = new UIElement(this);
  }
}
