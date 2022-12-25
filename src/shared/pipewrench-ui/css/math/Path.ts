/**
 * @author JabDoesThings
 */

import { easeIn, easeInOut, easeOut, lerp } from './Math';

export type PathMode = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
export type PathCallback = (step: PathStep, lerp: number) => void;
export type PathStep = { x: number; y: number; scale: number };

export class Path {
  private _callbacks: PathCallback[] = [];
  private _from: PathStep;
  private _to: PathStep;
  private _mode: PathMode;
  private _ticks: number = 1;
  private _tick: number = 0;
  private _x: number = 0;
  private _y: number = 0;
  private _scale: number = 1;

  reset(coords: PathStep) {
    if (coords.x != null) this._x = coords.x;
    if (coords.y != null) this._y = coords.y;
    if (coords.scale != null) this._scale = coords.scale;

    const { _callbacks: callbacks, _x: x, _y: y, _scale: scale } = this;
    if (callbacks != null && callbacks.length !== 0) {
      const step = { x, y, scale };
      for (const callback of callbacks) {
        callback(step, 1);
      }
    }

    this._from = null;
    this._to = null;
    this._callbacks = null;
    this._mode = null;
    this._tick = 0;
    this._ticks = 0;
  }

  start(
    to: PathStep,
    callbacks: PathCallback[] = null,
    ticks: number = 60,
    mode: PathMode = 'linear'
  ): void {
    const { _x: x, _y: y, _scale: scale } = this;

    if (to.x === x && to.y === y && to.scale === scale) return;

    const _to = (this._to = { ...to });

    if (to.x === x) _to.x = null;
    if (to.y === y) _to.y = null;
    if (to.scale == scale) _to.scale = null;
    if (ticks === 0) ticks = 1;

    this._callbacks = callbacks;
    this._from = { x, y, scale };
    this._tick = 0;
    this._ticks = ticks;
    this._mode = mode;
  }

  update(): void {
    const { _from: from, _to: to, _callbacks: callbacks, _mode: mode } = this;
    if (to == null) return;

    this._tick++;
    const { _tick: tick, _ticks: ticks } = this;

    const tLerp = tick / ticks;
    if (!isNaN(tLerp) && isFinite(tLerp)) {
      let step;
      if (mode === 'ease-in') step = easeIn(tLerp);
      else if (mode === 'ease-out') step = easeOut(tLerp);
      else if (mode === 'ease-in-out') step = easeInOut(tLerp);
      else if (mode === 'linear') step = tLerp;

      const { x: x1, y: y1, scale: s1 } = from;
      const { x: x2, y: y2, scale: s2 } = to;
      const x = (this._x =
        x2 != null ? lerp(step, { min: x1, max: x2 }) : null);
      const y = (this._y =
        y2 != null ? lerp(step, { min: y1, max: y2 }) : null);
      const scale = (this._scale =
        s2 != null ? lerp(step, { min: s1, max: s2 }) : null);

      if (callbacks != null && callbacks.length !== 0) {
        const step = { x, y, scale };
        for (const callback of callbacks) {
          callback(step, tLerp);
        }
      }
    }

    if (tick >= ticks) this.reset(to);
  }

  cancel(
    x: boolean | number = true,
    y: boolean | number = true,
    scale: boolean | number = true
  ) {
    const { _to: to } = this;
    if (to == null) return;
    if ((typeof x === 'boolean' && x) || typeof x === 'number') {
      if (typeof x === 'number') this._x = x;
      to.x = null;
    }
    if ((typeof y === 'boolean' && y) || typeof y === 'number') {
      if (typeof y === 'number') this._y = y;
      to.y = null;
    }
    if ((typeof scale === 'boolean' && scale) || typeof scale === 'number') {
      if (typeof scale === 'number') this._scale = scale;
      to.scale = null;
    }
  }

  get from(): PathStep {
    return { ...this._from };
  }

  get to(): PathStep {
    return { ...this._to };
  }

  get mode(): PathMode {
    return this._mode;
  }

  get ticks(): number {
    return this._ticks;
  }

  get tick(): number {
    return this._tick;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get scale(): number {
    return this._scale;
  }

  get running(): boolean {
    return this._to != null;
  }
}
