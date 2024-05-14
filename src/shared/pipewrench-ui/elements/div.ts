import { UIElement } from '@asledgehammer/pipewrench';
import { AnyProps, Element } from '../PipeWrenchUI';
import { AbstractElement, CSS_DEFAULT_ELEMENT, IAbstractElementAttributes } from './AbstractElement';

export interface IPWUIDivAttributes extends IAbstractElementAttributes { }

export const CSS_DEFAULT_DIV = {
  ...CSS_DEFAULT_ELEMENT
};

export class PWUIDiv extends AbstractElement<'div'> implements IPWUIDivAttributes {
  constructor(props: AnyProps, children: Element[]) {
    super('div', CSS_DEFAULT_DIV, props, children);
    this.javaObject = new UIElement(this);
  }
}
