import { UIElement } from '@asledgehammer/pipewrench';
import { AbstractElement, CSS_DEFAULT_ELEMENT } from './AbstractElement';

export class PWUIRawText extends AbstractElement<''> {
  constructor(text: string) {
    super('', CSS_DEFAULT_ELEMENT, {}, []);
    this.javaObject = new UIElement(this);
    this.innerText = text;
  }
}
