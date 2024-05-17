import { onFrontEndTick, onMainMenuEnter, onTickEvenPaused } from "@asledgehammer/pipewrench-events";
import { HTMLDocument } from "./html/elements/html";
import { Window } from "./Window";
import { initPZ } from "./html/PZ";

export let window: Window = new Window();
export let document: HTMLDocument = new HTMLDocument({}, []);

onMainMenuEnter.addListener(() => {

  function update() {
    window.update();
    document.update2();
  }

  // initPZ();

  // (The main menu has a separate tick from in-game)
  onFrontEndTick.addListener(update);
  onTickEvenPaused.addListener(update);
});
