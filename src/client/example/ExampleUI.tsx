/** @jsx PipeWrenchUI.createElement */

import * as Events from '@asledgehammer/pipewrench-events';
import { PipeWrenchUI, createUI } from '../../shared/pipewrench-ui/React';

Events.onMainMenuEnter.addListener(() => {
  createUI(
    <element
      class="my-element"
      style="top: 64px; left: 64px; width: 50%; height: 512px; background-color: #80ced6;"
    ></element>
  );
});
