import { UIElement, UIManager } from '@asledgehammer/pipewrench';
import { HTMLElement, CSS_DEFAULT_ELEMENT, IHTMLElementAttributes } from '../HTMLElement';
import { AnyProps, ReactElement } from '../../React';

export interface DivAttributes extends IHTMLElementAttributes { }

export const CSS_DEFAULT_DIV = {
  ...CSS_DEFAULT_ELEMENT
};

export class HTMLDivElement extends HTMLElement<'div'> implements DivAttributes {
  constructor(props: AnyProps, children: ReactElement[]) {
    super('div', CSS_DEFAULT_DIV, props, children);
  }
}
