/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import {
  easeIn,
  easeInOut,
  easeOut
} from '../../shared/pipewrench-ui/css/math/Math';
import { PWUIElement } from '../../shared/pipewrench-ui/elements/PWUIElement';
import { PipeWrenchUI, createUI } from '../../shared/pipewrench-ui/React';

let offset = 0;

Events.onMainMenuEnter.addListener(() => {
  let element: PWUIElement = (
    <element
      class="my-element"
      style="top: 64px; left: 64px; width: 512px; height: 512px; background-color: #80ced6;"
      on-update={(element: PWUIElement) => {
        if (offset === 256) offset = 0;
        if (offset < 128) {
          let l = offset / 128;
          l = l * l;
          l = easeInOut(l);
          const width = l * 1024;
          element.style['width'] = `${width}px`;
          element.style['background-color'] = `rgba(255, 31, 31, ${l})`;
        } else {
          let l = (offset - 128) / 128;
          l = l * l;
          l = easeInOut(1 - l);
          const r = 255 * (Math.round(255 - l) / 255);
          const gb = 31 * (Math.round(31 - l) / 31);
          const width = l * 1024;
          element.style['width'] = `${width}px`;
          element.style['background-color'] = `rgba(${r}, ${gb}, ${gb}, ${l})`;
        }
        offset++;
      }}
    ></element>
  );

  createUI(element);

  Events.onFrontEndTick.addListener(() => {
    element.update2();
  });
});
