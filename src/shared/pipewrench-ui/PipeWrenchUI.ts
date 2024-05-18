import { onFrontEndTick, onMainMenuEnter, onTickEvenPaused } from "@asledgehammer/pipewrench-events";
import { window } from "./Window";
import { document } from "./html/elements/html";

onMainMenuEnter.addListener(() => {

  function update() {
    window.update();
    document.update2();
  }

  // (The main menu has a separate tick from in-game)
  onFrontEndTick.addListener(update);
  onTickEvenPaused.addListener(update);
});
