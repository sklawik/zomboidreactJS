import { getTexture, Texture } from '@asledgehammer/pipewrench';

export class TextureCache {
  private static readonly _textures: { [path: string]: Texture } = {};

  private constructor() {
    throw new Error('Cannot instantiate TextureCache.');
  }

  static getOrLoad(path: string): Texture {
    path = this.formatPath(path);
    let texture = this.get(path);
    if (texture != null) return texture;
    texture = this._textures[path] = getTexture(path);
    return texture;
  }

  static get(path: string): Texture {
    return this._textures[this.formatPath(path)];
  }

  static isLoaded(path: string): boolean {
    return this._textures[this.formatPath(path)] !== null;
  }

  private static formatPath(path: string): string {
    return path.toLowerCase();
  }
}
