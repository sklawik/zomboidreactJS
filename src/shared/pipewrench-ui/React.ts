// Note: Using a modified form of the minified TSTL JSX framework provided by Pyry.
//
//   URL: https://gist.github.com/probable-basilisk/3d1ff2c9a932c03cfb598f02678951c3

import { IPWUIElementAttributes, PWUIElement } from './elements/PWUIElement';
import { IPWUIRadialMenuAttributes, PWUIRadialMenu } from './elements/PWUIRadialMenu';
import { PWUITextArea as PWUITextArea } from './elements/Text';
import { Element, ElementChildren, ElementConstructor } from './PipeWrenchUI';

/* ########################################################## */

// Element Interfaces
declare global {
  namespace JSX {
    interface IntrinsicElements {
      element: IPWUIElementAttributes;
      radialmenu: IPWUIRadialMenuAttributes;
    }
  }
}

// Element Classes.
export let primitives: { [name: string]: Element } = {
  element: PWUIElement,
  radialmenu: PWUIRadialMenu,
  textarea: PWUITextArea,
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
      assert(t in primitives, `No base element [${t}]!`);
      return new (primitives[t] as any)(props, flatChildren);
    } else if (isActualFunction(t)) {
      return t(props, flatChildren);
    } else {
      return new (t as ElementConstructor)(props, flatChildren);
    }
  };

  function recursiveFlattenChildren(
    children: ElementChildren,
    target: Element[]
  ): void {
    if (typeof children == 'string') {
      target.push(new PWUITextArea({ text: children }));
    } else {
      try {
        for (const child of children as ElementChildren[]) {
          recursiveFlattenChildren(child, target);
        }
      } catch (err) {
        target.push(children);
      }
    }
  }

  function flattenChildren(children: ElementChildren): Element[] {
    let result: Element[] = [];
    recursiveFlattenChildren(children, result);
    return result;
  }

  // TSTL and TS disagree on what `typeof MyClass` is, so to distinguish between class constructors and functions we
  // have to break out to Lua.
  function isActualFunction(f: unknown): f is (...args: any[]) => any {
    return type(f) == 'function';
  }
}

export const createUI = (...elements: Element[]) => {
  for (const element of elements) {
    if ((element as any).addToUIManager != null) {
      (element as any).addToUIManager();
    }
  }
};
