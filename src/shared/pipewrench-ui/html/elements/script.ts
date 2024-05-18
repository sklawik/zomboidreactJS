import { tPrint } from '../../util/table';
import { HTMLElement, CSS_DEFAULT_ELEMENT } from '../HTMLElement';

export interface ScriptAttributes {
  src?: string;
  type?: string;
};

export const CSS_DEFAULT_SCRIPT = {
  ...CSS_DEFAULT_ELEMENT,
  'display': 'none',
}

export class HTMLScriptElement extends HTMLElement<'script'> implements ScriptAttributes {

  src?: string;
  type?: string;

  private _firstUpdate: boolean = true;

  constructor(props: ScriptAttributes, children: HTMLElement<string>[]) {
    super('script', CSS_DEFAULT_ELEMENT, props, children);

    if (props['src'] != null) this.src = props['src'];
    if (props['type'] != null) this.type = props['type'];

    print(`[script type=${tostring(this.type)}] => innerText = ${tostring(this.innerText)}`);
  }

  protected updateInternal(): void {
    if (this._firstUpdate) {
      if (this.innerText != null && this.innerText.length) {
        if (this.type == 'text/x-lua') {
          loadstring(this.innerText)[0]();
        }
      }
      this._firstUpdate = false;
    }
  }
}
