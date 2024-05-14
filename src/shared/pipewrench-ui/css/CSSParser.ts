import { CSSChain } from './CSSChain';
import { CSSRuleset } from './CSS';

/**
 * **CSSReader** is a singleton utility for parsing CSS text as objects.
 *
 * @author JabDoesThings
 */
export class CSSReader {
  private constructor() {
    throw new Error('Cannot instantiate CSSReader.');
  }

  static parseInline(raw: { [rule: string]: string }, css: string): CSSRuleset {
    return new CSSRuleset(raw, this.readInlineSelectorBlock(css));
  }

  static parse(css: string): CSSChain {
    if (css == null) throw new Error('The CSS string is null.');
    const group = new CSSChain();
    group.addBlocks(this.read(css));
    return group;
  }

  static read(raw: string): SelectorBlocks {
    const css: SelectorBlocks = {};
    let inSelector = false;
    let selectorBlock = '';
    let selector = '';
    let char = 1;
    let line = 0;

    const parseError = (message: string) => {
      this.parseError(line, char, selector, message);
    };

    for (let index = 0; index < raw.length; index++) {
      const currChar = raw.charAt(index);
      let lineBreak = false;
      if (currChar.replace('\r', '').replace('\n', '') === '') {
        char = 1;
        line++;
        lineBreak = true;
      } else char++;
      if (inSelector) {
        if (currChar === '{') parseError("A '{' inside of the selector block.");
        if (currChar === '}') {
          if (!inSelector) parseError("A '}' outside of the selector block.");
          if (selectorBlock.length !== 0) {
            css[selector.trim()] = this.readInlineSelectorBlock(selectorBlock);
          }
          inSelector = false;
          selector = '';
          selectorBlock = '';
        } else {
          if (!lineBreak) selectorBlock += currChar;
        }
      } else {
        if (currChar === '{') {
          if (inSelector) parseError("A '{' inside of the selector block.");
          inSelector = true;
        } else {
          if (!lineBreak) selector += currChar;
        }
      }
    }
    if (selector.length !== 0) parseError('No {} block for selector.');
    return css;
  }

  static readInlineSelectorBlock(css: string): SelectorBlock {
    let charOffset = 1;
    const error = (message: string) => {
      throw new Error(
        `[line 1:${charOffset}]: Invalid CSS Syntax in inline selector block: ${message}`
      );
    };

    const selection: SelectorBlock = {};
    for (const block of css.split(';')) {
      if (block !== '') {
        const split = block.split(':'); // [property, value]
        if (split.length !== 2) error(`Invalid rule: ${block.trim()}`);
        selection[split[0].trim()] = split[1].trim();
      }
    }
    return selection;
  }

  private static parseError(
    line: number,
    char: number,
    selector: string,
    message: string
  ) {
    throw new Error(
      `[line ${line}:${char}]: Invalid CSS Syntax near selector '${selector}': ${message}`
    );
  }
}

export type SelectorBlocks = { [selection: string]: SelectorBlock };
export type SelectorBlock = { [property: string]: string };
