/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI } from '../../shared/pipewrench-ui/React';
import { HTMLDivElement } from '../../shared/pipewrench-ui/html/elements/div';
import { document } from '../../shared/pipewrench-ui/html/elements/html';
import * as JSON from '../../shared/pipewrench-ui/util/JSON';

/**
 * Create and add the element here and to the UIManager.
 */
Events.onMainMenuEnter.addListener(() => {
  const element: HTMLDivElement = (
    <div>
      <img id="image-1" src="media/textures/cat_pic.png" style="top: 0px; left: 0px;" />
      <img id="image-2" src="media/textures/cat_pic.png" style="top: 512px; left: 512px;" />
      <script type="text/x-lua">
        print('Hello, World!');
      </script>
    </div>
  );

  document.appendChild(element);

  const img1 = document.getElementById('image-1');
  const img2 = document.getElementById('image-2');

  img1.addEventListener('mousemove', (event) => {
    // print('img1: mousemove');
    print(JSON.stringify(event));
  });

  img2.addEventListener('mousemove', (event) => {
    print('img2: mousemove');
  });

});
