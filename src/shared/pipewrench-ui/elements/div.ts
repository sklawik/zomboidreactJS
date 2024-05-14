import { UIElement } from '@asledgehammer/pipewrench';
import { AnyProps, Element } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';

export interface IPWUIDivAttributes extends IAbstractElementAttributes { }

export const CSS_DEFAULT_DIV = {
  'background-color': 'transparent'
};

/**
 * **PWUIElement is the generic root-element that all PWUI components derive.
 *
 * @author JabDoesThings
 */
export class PWUIDiv extends AbstractElement<'div'> implements IPWUIDivAttributes {

  tag: 'div' = 'div';

  constructor(props: AnyProps, children: Element[]) {
    super('div', CSS_DEFAULT_DIV, props, children);
    this.javaObject = new UIElement(this);
  }

}
