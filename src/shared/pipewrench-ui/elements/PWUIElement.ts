import { UIElement } from '@asledgehammer/pipewrench';
import { AnyProps, Element } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';

export interface IPWUIElementAttributes extends IAbstractElementAttributes {}

/**
 * **PWUIElement is the generic root-element that all PWUI components derive.
 *
 * @author JabDoesThings
 */
export class PWUIElement extends AbstractElement<'element'> implements IPWUIElementAttributes {

  tag: 'element' = 'element';

  constructor(props: AnyProps, children: Element[]) {
    super('element', undefined, props, children);

    this.javaObject = new UIElement(this);
  }

}
