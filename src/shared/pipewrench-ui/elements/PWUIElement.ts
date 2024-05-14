import { UIElement } from '@asledgehammer/pipewrench';
import { AnyProps, Element } from '../PipeWrenchUI';
import { AbstractElement, IAbstractElementAttributes } from './AbstractElement';
import * as JSON from '../JSON';

export interface IPWUIElementAttributes extends IAbstractElementAttributes { }

export const CSS_DEFAULTS_ELEMENT = {
  'background-color': 'transparent'
};

/**
 * **PWUIElement is the generic root-element that all PWUI components derive.
 *
 * @author JabDoesThings
 */
export class PWUIElement extends AbstractElement<'element'> implements IPWUIElementAttributes {

  tag: 'element' = 'element';

  constructor(props: AnyProps, children: Element[]) {
    super('element', CSS_DEFAULTS_ELEMENT, props, children);
    this.javaObject = new UIElement(this);

    print('PWUIElement Children: ');
    print(JSON.stringify(children));
  }

}
