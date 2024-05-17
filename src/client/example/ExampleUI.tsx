/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI } from '../../shared/pipewrench-ui/React';
import { HTMLDivElement } from '../../shared/pipewrench-ui/html/elements/div';
import { document } from '../../shared/pipewrench-ui/PipeWrenchUI';

/**
 * Create and add the element here and to the UIManager.
 */
Events.onMainMenuEnter.addListener(() => {
  const element: HTMLDivElement = (
    <div>
      <img src="media/textures/cat_pic.png" style="top: 0px; left: 0px;" />
      <img src="media/textures/cat_pic.png" style="top: 512px; left: 512px;" />
    </div>
  );

  document.appendChild(element);
});
