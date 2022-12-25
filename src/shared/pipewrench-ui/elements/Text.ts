import { Element } from '@asledgehammer/pipewrench';
import { Props } from '../PipeWrenchUI';

export type TextProps = Props & {
  text?: string;
};

export class Text implements Element {
  text: string;
  constructor(props: TextProps, children?: Element[]) {
    this.text = props.text ?? '';
  }
}
