import { Element, UIElement } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';

export const CSS_DEFAULT_RAW_TEXT = {
  'background-color': 'transparent',
  'color': 'rgba(255, 255, 255, 1)'
};

export interface IPWUIRawTextAttributes extends IAbstractElementAttributes { }

export type RawTextProps = Props & {};

export class PWUIRawText extends AbstractElement<''> {

  constructor(props: RawTextProps, children: Element[], text: string) {
    super('', CSS_DEFAULT_RAW_TEXT, props, children);
    this.javaObject = new UIElement(this);
    this.text = text;
  }
}
