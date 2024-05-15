/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI, createUI } from '../../shared/pipewrench-ui/React';
import { PWUIDiv } from '../../shared/pipewrench-ui/elements/div';

/**
 * Create and add the element here and to the UIManager.
 */
Events.onMainMenuEnter.addListener(() => {
  const element: PWUIDiv = (
    <img
      src="media/textures/cat_pic2.png"
      width={471}
      height="512"
      style="top: 64px; left: 64px; background-color: rgba(255,255,255,1);"
    />
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
