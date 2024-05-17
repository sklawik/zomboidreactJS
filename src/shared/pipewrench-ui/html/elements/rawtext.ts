import { HTMLElement, CSS_DEFAULT_ELEMENT } from '../HTMLElement';

export class HTMLRawText extends HTMLElement<''> {
  constructor(text: string) {
    super('', CSS_DEFAULT_ELEMENT, {}, []);
    this.innerText = text;
  }
}
