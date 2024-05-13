import { UIElement } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';
import { AbstractElement } from './AbstractElement';

export type TextProps = Props & {
  text?: string;
};

export class PWUITextArea extends AbstractElement<'textarea'> {
  text: string;

  constructor(props: TextProps, children?: AbstractElement<string>[]) {
    super('textarea', new UIElement(), props, children);
    this.text = props.text ?? '';
  }
}
