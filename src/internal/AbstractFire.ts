import { Mesh, Color, type Material, type Matrix4, type Vector3 } from 'three'

/**
 * The subset of fire uniforms shared by the GLSL and TSL implementations.
 *
 * Both back-ends expose their animated parameters as `{ value }` boxes (a
 * Three.js `IUniform` for GLSL, a TSL uniform node for WebGPU), so the shared
 * lifecycle logic can read and write them through this common shape.
 */
export interface FireUniformBag {
  time: { value: number }
  color: { value: Color }
  invModelMatrix: { value: Matrix4 }
  scale: { value: Vector3 }
  magnitude: { value: number }
  lacunarity: { value: number }
  gain: { value: number }
}

/**
 * Shared base class for the volumetric fire meshes.
 *
 * Holds the animation/update lifecycle, GPU resource disposal, and the public
 * parameter accessors. Subclasses only build their geometry/material and expose
 * their uniform bag via {@link getUniforms}.
 *
 * @typeParam TMat - The concrete material type used by the subclass.
 */
export abstract class AbstractFire<TMat extends Material> extends Mesh {
  declare material: TMat
  protected _time = 0

  /** Returns the back-end's uniform bag (GLSL `material.uniforms` or TSL nodes). */
  protected abstract getUniforms(): FireUniformBag

  /**
   * Updates the fire animation and matrix uniforms.
   *
   * Call this each frame. In React Three Fiber it runs automatically via
   * `useFrame`.
   *
   * @param time - Current time in seconds (optional)
   */
  public update(time?: number): void {
    const uniforms = this.getUniforms()
    if (time !== undefined) {
      this._time = time
      uniforms.time.value = time
    }
    this.updateMatrixWorld()
    uniforms.invModelMatrix.value.copy(this.matrixWorld).invert()
    uniforms.scale.value.copy(this.scale)
  }

  /**
   * Releases the GPU resources owned by this fire (geometry and material).
   *
   * Call this when removing the fire from the scene to avoid leaking GPU
   * memory. In React Three Fiber it is invoked automatically on unmount. The
   * texture passed in is **not** disposed — its lifecycle is owned by the caller
   * (or the R3F loader cache).
   */
  public dispose(): void {
    this.geometry?.dispose()
    this.material?.dispose()
  }

  /** Current animation time in seconds. */
  public get time(): number {
    return this._time
  }

  public set time(value: number) {
    this._time = value
    this.getUniforms().time.value = value
  }

  /**
   * Fire color tint.
   *
   * @example
   * ```ts
   * fire.fireColor = 'orange'
   * fire.fireColor = 0xff4400
   * fire.fireColor = new Color(1, 0.5, 0)
   * ```
   */
  public get fireColor(): Color {
    return this.getUniforms().color.value
  }

  public set fireColor(color: Color | string | number) {
    this.getUniforms().color.value = color instanceof Color ? color : new Color(color)
  }

  /**
   * Fire shape intensity. Higher values create more dramatic shapes.
   * Range: 0.5 - 3.0, Default: 1.3
   */
  public get magnitude(): number {
    return this.getUniforms().magnitude.value
  }

  public set magnitude(value: number) {
    this.getUniforms().magnitude.value = value
  }

  /**
   * Noise lacunarity (frequency multiplier per octave).
   * Range: 1.0 - 4.0, Default: 2.0
   */
  public get lacunarity(): number {
    return this.getUniforms().lacunarity.value
  }

  public set lacunarity(value: number) {
    this.getUniforms().lacunarity.value = value
  }

  /**
   * Noise gain (amplitude multiplier per octave).
   * Range: 0.1 - 1.0, Default: 0.5
   */
  public get gain(): number {
    return this.getUniforms().gain.value
  }

  public set gain(value: number) {
    this.getUniforms().gain.value = value
  }
}
