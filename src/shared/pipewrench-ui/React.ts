// Note: Using a modified form of the minified TSTL JSX framework provided by Pyry.
//
//   URL: https://gist.github.com/probable-basilisk/3d1ff2c9a932c03cfb598f02678951c3

import { HTMLBodyElement, BodyAttributes } from './html/elements/body';
import { DivAttributes, HTMLDivElement } from './html/elements/div';
import { ImageAttributes, HTMLImageElement } from './html/elements/img';
import { RadialMenuAttributes, HTMLRadialMenu } from './html/elements/radialmenu';
import { HTMLRawText } from './html/elements/rawtext';
import { SpanAttributes, HTMLSpanElement } from './html/elements/span';

/* ########################################################## */

export type OptionalElementFunction = (element: ReactElement) => void;
export type ReactElementFactory = (props: Props, children?: ReactElement[]) => ReactElement;
export type ReactElementChildren = string | ReactElement | ReactElementChildren[];
export type Props = {};
export type AnyProps = Props & { [prop: string]: any };
export interface ReactElement {

}
export interface ElementConstructor {
  new(props: any, children?: ReactElement[]): ReactElement;
}

/* ########################################################## */

// Element Interfaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      body: BodyAttributes;
      div: DivAttributes;
      span: SpanAttributes;
      img: ImageAttributes;
      radialmenu: RadialMenuAttributes;
    }
  }
}

// Element Classes.
export let primitives: { [name: string]: ReactElement } = {
  body: HTMLBodyElement,
  div: HTMLDivElement,
  span: HTMLSpanElement,
  img: HTMLImageElement,
  radialmenu: HTMLRadialMenu,
};

/* ########################################################## */

export namespace PipeWrenchUI {
  export const createElement = (
    t: string | Function | ElementConstructor,
    props?: object,
    ...children: any[]
  ): any => {
    props = props ?? {};
    let flatChildren = flattenChildren(children);
    if (typeof t == 'string') {
      if (primitives[t] == null) {
        print(`No base element [${t}]!`);
        return null;
      }
      return new (primitives[t] as any)(props, flatChildren);
    } else if (isActualFunction(t)) {
      return t(props, flatChildren);
    } else {
      return new (t as ElementConstructor)(props, flatChildren);
    }
  };

  function recursiveFlattenChildren(
    children: ReactElementChildren,
    target: ReactElement[]
  ): void {
    if (typeof children == 'string') {
      target.push(new HTMLRawText(children));
    }
    else if (typeof children == 'object') {
      if (type(children) == 'table' && (children as any[])[0] != null) {
        for (const child of children as ReactElementChildren[]) {
          recursiveFlattenChildren(child, target);
        }
      } else {
        target.push(children);
      }
    }
    else {
      for (const child of children as ReactElementChildren[]) {
        recursiveFlattenChildren(child, target);
      }
    }
  }

  function flattenChildren(children: ReactElementChildren): ReactElement[] {
    let result: ReactElement[] = [];
    recursiveFlattenChildren(children, result);
    return result;
  }

  // TSTL and TS disagree on what `typeof MyClass` is, so to distinguish between class constructors and functions we
  // have to break out to Lua.
  function isActualFunction(f: unknown): f is (...args: any[]) => any {
    return type(f) == 'function';
  }
}

// export function createElement(...elements: ReactElement[]) {
//   for (const element of elements) {
//     if ((element as any).addToUIManager != null) {
//       (element as any).addToUIManager();
//     }
//   }
// };
