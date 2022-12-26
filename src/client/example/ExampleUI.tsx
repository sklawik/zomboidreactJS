/** @jsx PipeWrenchUI.createElement */
/** @noSelfInFile */

import * as Events from '@asledgehammer/pipewrench-events';
import { easeInOut } from '../../shared/pipewrench-ui/css/math/Math';
import { PWUIElement } from '../../shared/pipewrench-ui/elements/PWUIElement';
import { OptionalElementFunction } from '../../shared/pipewrench-ui/PipeWrenchUI';
import { PipeWrenchUI, createUI } from '../../shared/pipewrench-ui/React';

let offset = 0;

const onUpdate: OptionalElementFunction = (element: PWUIElement) => {
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
};

Events.onMainMenuEnter.addListener(() => {
  let element: PWUIElement = (
    <element
      class="my-element"
      style="top: 64px; left: 64px; width: 0; height: 512px"
      on-update={onUpdate}
    ></element>
  );

  createUI(element);

  Events.onFrontEndTick.addListener(() => {
    // Named 'update2' to not be updated by UIManager. This method is much cleaner.
    element.update2();
  });
});
