import { getTexture, Texture } from '@asledgehammer/pipewrench';

/**
 * **TextureCache** handles caching and a lookup-table for the HTML engine.
 *
 * @author JabDoesThings
 */
export class TextureCache {
  /** The lookup table to store all loaded textures. */
  private static readonly _textures: { [path: string]: Texture } = {};

  private constructor() {
    throw new Error('Cannot instantiate TextureCache.');
  }

  /**
   * Grabs a texture located at the relative URL path. If the texture is not loaded, the cache will try to load it.
   *
   * @param path The relative URL to the texture file.
   *
   * @returns The texture object. If a texture is not found, null is returned.
   */
  static getOrLoad(path: string): Texture {
    path = this.formatPath(path);

    // If the cache has the texture.
    let texture = this.get(path);
    if (texture != null) return texture;

    // Attempt to load the texture.
    texture = getTexture(path);

    // Only store the result if non-null to keep the table clean.
    if (texture != null) this._textures[path] = texture;

    return texture;
  }

  /**
   * Grabs a texture located at the relative URL path.
   *
   * @param path The relative URL to the texture file.
   *
   * @returns The texture object. If the texture is not found, null is returned.
   */
  static get(path: string): Texture {
    return this._textures[this.formatPath(path)];
  }

  /**
   *
   * @param path The relative URL to the texture file.
   *
   * @returns True if the texture object is loaded.
   */
  static isLoaded(path: string): boolean {
    return this._textures[this.formatPath(path)] !== null;
  }

  private static formatPath(path: string): string {
    return path.toLowerCase();
  }
}
