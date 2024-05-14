/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { asRGBA, RGBA } from '../../shared/pipewrench-ui/css/color/RGBA';
import { easeInOut } from '../../shared/pipewrench-ui/css/math/Math';
import { Element, OptionalElementFunction } from '../../shared/pipewrench-ui/PipeWrenchUI';
import { PipeWrenchUI, createUI } from '../../shared/pipewrench-ui/React';
import { AbstractElement } from '../../shared/pipewrench-ui/elements/AbstractElement';
import { PWUIElement } from '../../shared/pipewrench-ui/elements/PWUIElement';

// This is the tick counter for keeping track of where in the cycle we are for the animation.
let tick = 0;
const tickMax = 256;
const tickMid = tickMax / 2;

// The tracked width of the element.
let width = 0;
const maxWidth = 1024;

// The color values that we keep track of.
const color: RGBA = asRGBA(255, 31, 31, 0, '255');

const onUpdate: OptionalElementFunction = (e: Element) => {

  const element: AbstractElement<string> = e as AbstractElement<string>;

  // The lerp value stores the percentage value [0, 1] that will control how the animation calculates.
  let lerp;

  // In the first half of the animation, we want the element to grow and the alpha to go from 0 -> 1.
  if (tick < tickMid) {
    // A simple 0 -> 1 scale for half the tick cycle.
    lerp = tick / tickMid;
    // This intensifies the 'ease-in-out' animation.
    lerp *= lerp;
    // Transforms the linear percentage into a 'bounce' that is intensified.
    lerp = easeInOut(lerp);

    color.r = 255;
    color.g = 31;
    color.b = 31;
    color.a = lerp;
  }
  // In the second half of the animation, we want the element to shrink, change color, and the alpha to go from 1 -> 0.
  else {
    // the same as above, however descending from 1 -> 0.
    lerp = (tick - tickMid) / tickMid;
    lerp = lerp * lerp;
    lerp = easeInOut(1 - lerp);

    color.r = 255 * (Math.round(255 - lerp) / 255);
    color.g = color.b = 31 * (Math.round(31 - lerp) / 31);
  }

  width = lerp * maxWidth;
  color.a = lerp;

  // Set our values very similar to how JavaScript API works when editing HTMLElement.style.
  const { r, g, b, a } = color;
  element.cssRuleset['width'] = `${width}px`;
  element.cssRuleset['background-color'] = `rgba(${r}, ${g}, ${b}, ${a})`;

  tick = tick === tickMax ? 0 : tick + 1;
};

/**
 * Create and add the element here and to the UIManager.
 */
Events.onMainMenuEnter.addListener(() => {
  const element: PWUIElement = (
      <element
        class="my-element"
        style="top: 64px; left: 64px; width: 471px; height: 512px; background-color: rgba(255,255,255,1); background-image: url(media/textures/cat_pic.png)"
      // onupdate={onUpdate}
      >
        <text style="left: 16px">This is text.</text>
      </element>
  );

  createUI(element);

  /**
   * **NOTE**: The 'update' hook of `zombie.ui.UIElement` is invoked wth a very slow TPS, which is too slow to work for
   * clean animations that occur for HTML, so instead, the element is updated through the game's tick method which is
   * fast enough. This is recommended for all HTML updates.
   */
  Events.onFrontEndTick.addListener(() => {
    element.update2();
  });
});
