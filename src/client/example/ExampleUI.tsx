/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI } from '../../shared/pipewrench-ui/React';
import { HTMLDivElement } from '../../shared/pipewrench-ui/html/elements/div';
import { document } from '../../shared/pipewrench-ui/html/elements/html';

/**
 * Create and add the element here and to the UIManager.
 */
Events.onMainMenuEnter.addListener(() => {
  const element: HTMLDivElement = (
    <div>
      <img id="image-1" src="media/textures/cat_pic.png" style="top: 0px; left: 0px;" />
      <img id="image-2" src="media/textures/cat_pic.png" style="top: 512px; left: 512px;" />
    </div>
  );

  document.appendChild(element);
  document.debug = true;

  print(document.printTree(0));

  const img1 = document.getElementById('image-1');
  const img2 = document.getElementById('image-2');

  print(`img1: ` + tostring(img1));
  print(`img2: ` + tostring(img2));

  img1.addEventListener('mousemove', (event) => {
    print('img1: mousemove');
  });

  img2.addEventListener('mousemove', (event) => {
    print('img2: mousemove');
  });

});
