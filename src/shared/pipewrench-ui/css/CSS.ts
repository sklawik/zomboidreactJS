import { SelectorBlock as SelectorBlock } from './CSSParser';

/**
 * https://www.w3schools.com/cssref/pr_class_position.php
 *
 * | Rule     | Description                                                                                                                                                                                                                                                                             |
 * | :--      | :--                                                                                                                                                                                                                                                                                     |
 * | static   | Default value. Elements render in order, as they appear in the document flow.                                                                                                                                                                                                           |
 * | absolute | The element is positioned relative to its first positioned (not static) ancestor element.                                                                                                                                                                                               |
 * | fixed    | The element is positioned relative to the browser window.                                                                                                                                                                                                                               |
 * | relative | The element is positioned relative to its normal position, so "left:20px" adds 20 pixels to the element's LEFT position.                                                                                                                                                                |
 * | sticky   | The element is positioned based on the user's scroll position. A sticky element toggles between relative and fixed, depending on the scroll position. It is positioned relative until a given offset position is met in the viewport - then it "sticks" in place (like position:fixed). |
 * | initial  | Sets this property to its default value.                                                                                                                                                                                                                                                |
 * | inherit  | Inherits this property from its parent element.                                                                                                                                                                                                                                         |
 */
export type PositionValue =
  | 'static'
  | 'absolute'
  | 'fixed'
  | 'relative'
  | 'sticky'
  | 'initial'
  | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_class_display.php
 *
 * | Rule         | Description                                                                                                                                              |
 * | :--          | :--                                                                                                                                                      |
 * | block        | Displays an element as a block element (like <p>). It starts on a new line, and takes up the whole width.                                                |
 * | flex         | Displays an element as a block-level flex container.                                                                                                     |
 * | inline       | Displays an element as an inline element (like <span>). Any height and width properties will have no effect.                                             |
 * | inline-block | Displays an element as an inline-level block container. The element itself is formatted as an inline element, but you can apply height and width values. |
 * | none         | The element is completely removed.                                                                                                                       |
 */
export type DisplayValue =
  | 'block'
  | 'flex'
  | 'inline'
  | 'inline-block'
  | 'none';

/**
 * https://www.w3schools.com/cssref/pr_pos_top.php
 *
 * | Rule    | Description                                                                         |
 * | :--     | :--                                                                                 |
 * | auto    | Lets the browser calculate the top edge position. This is default.                  |
 * | length  | Sets the top edge position in px, cm, etc. Negative values are allowed.             |
 * | %       | Sets the top edge position in % of containing element. Negative values are allowed. |
 * | initial | Sets this property to its default value.                                            |
 * | inherit | Inherits this property from its parent element.                                     |
 */
export type TopValue = 'auto' | 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_pos_left.php
 *
 * | Rule    | Description                                                                          |
 * | :--     | :--                                                                                  |
 * | auto    | Lets the browser calculate the left edge position. This is default.                  |
 * | length  | Sets the left edge position in px, cm, etc. Negative values are allowed.             |
 * | %       | Sets the left edge position in % of containing element. Negative values are allowed. |
 * | initial | Sets this property to its default value.                                             |
 * | inherit | Inherits this property from its parent element.                                      |
 */
export type LeftValue = 'auto' | 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_dim_width.php
 *
 * | Rule    | Description                                                |
 * | :--     | :--                                                        |
 * | auto    | Default value. The browser calculates the width.           |
 * | length  | Defines the width in px, cm, etc. Read about length units. |
 * | %       | Defines the width in percent of the containing block.      |
 * | initial | Sets this property to its default value.                   |
 * | inherit | Inherits this property from its parent element.            |
 */
export type WidthRule = 'auto' | 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_dim_height.php
 *
 * | Rule    | Description                                                 |
 * | :--     | :--                                                         |
 * | auto    | Default value. The browser calculates the height.           |
 * | length  | Defines the height in px, cm, etc. Read about length units. |
 * | %       | Defines the height in percent of the containing block.      |
 * | initial | Sets this property to its default value.                    |
 * | inherit | Inherits this property from its parent element.             |
 */
export type HeightRule = 'auto' | 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_dim_min-width.php
 *
 * | Rule    | Description                                                   |
 * | :--     | :--                                                           |
 * | length  | Default value is 0. Defines the minimum width in px, cm, etc. |
 * | %       | Defines the minimum width in percent of the containing block. |
 * | initial | Sets this property to its default value.                      |
 * | inherit | Inherits this property from its parent element.               |
 */
export type MinWidthRule = 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_dim_min-height.php
 *
 * | Rule    | Description                                                   |
 * | :--     | :--                                                           |
 * | length  | Default value is 0. Defines the minimum width in px, cm, etc. |
 * | %       | Defines the minimum width in percent of the containing block. |
 * | initial | Sets this property to its default value.                      |
 * | inherit | Inherits this property from its parent element.               |
 */
export type MinHeightRule = 'initial' | 'inherit';

/**
 * https://www.w3schools.com/cssref/pr_dim_max-width.php
 *
 * | Rule    | Description                                                   |
 * | :--     | :--                                                           |
 * | none    | No maximum width. This is default.                            |
 * | length  | Defines the maximum width in px, cm, etc.                     |
 * | %       | Defines the maximum width in percent of the containing block. |
 * | initial | Sets this property to its default value.                      |
 * | inherit | Inherits this property from its parent element.               |
 */
export type MaxWidthRule = 'initial' | 'inherit' | 'none';

/**
 * https://www.w3schools.com/cssref/pr_dim_max-height.php
 *
 * | Rule    | Description                                                    |
 * | :--     | :--                                                            |
 * | none    | No maximum height. This is default.                            |
 * | length  | Defines the maximum height in px, cm, etc.                     |
 * | %       | Defines the maximum height in percent of the containing block. |
 * | initial | Sets this property to its default value.                       |
 * | inherit | Inherits this property from its parent element.                |
 */
export type MaxHeightRule = 'initial' | 'inherit' | 'none';

export class CSSRuleset {
  'position': PositionValue = 'relative';
  'display': DisplayValue = 'block';
  'top': TopValue = 'auto';
  'left': LeftValue = 'auto';
  'width': WidthRule | string = 'auto';
  'height': HeightRule | string = 'auto';
  'min-width': MinWidthRule | string = '0';
  'min-height': MinHeightRule | string = '0';
  'max-width': MaxWidthRule | string = 'none';
  'max-height': MaxHeightRule | string = 'none';

  'background-color': string = 'none';
  'background-image': string = 'none';

  constructor(raw?: SelectorBlock) {
    if (raw != null) {
      for (const property of Object.keys(raw)) {
        (this as any)[property] = raw[property];
      }
    }
  }

  asInline(): CSSRuleset {
    const copy = new CSSRuleset();
    copy['position'] = this['position'];
    copy['display'] = this['display'];
    copy['top'] = this['top'];
    copy['left'] = this['left'];
    copy['width'] = this['width'];
    copy['height'] = this['height'];
    copy['min-width'] = this['min-width'];
    copy['min-height'] = this['min-height'];
    copy['max-width'] = this['max-width'];
    copy['max-height'] = this['max-height'];
    copy['background-color'] = this['background-color'];
    return copy;
  }

  setRules(other: CSSRuleset) {
    this['position'] = other['position'];
    this['display'] = other['display'];
    this['top'] = other['top'];
    this['left'] = other['left'];
    this['width'] = other['width'];
    this['height'] = other['height'];
    this['min-width'] = other['min-width'];
    this['min-height'] = other['min-height'];
    this['max-width'] = other['max-width'];
    this['max-height'] = other['max-height'];
    this['background-color'] = other['background-color'];
  }
}
