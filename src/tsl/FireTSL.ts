/**
 * @fileoverview TSL Fire mesh class for vanilla Three.js with WebGPU support
 *
 * This is the TSL equivalent of the GLSL Fire class, using MeshBasicNodeMaterial
 * and node-based shaders for WebGPU compatibility.
 */

import { Mesh, BoxGeometry, Texture, Color } from 'three'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import {
  createFireUniforms,
  createFireFragmentNode,
  type FireTSLConfig,
  type FireTSLUniforms,
} from './FireShaderTSL'

export interface FireTSLProps {
  /** Fire texture (grayscale mask defining fire shape) */
  fireTex: Texture
  /** Fire color tint (default: 0xeeeeee) */
  color?: Color | string | number
  /** Ray marching iterations - higher = better quality, lower performance (default: 20) */
  iterations?: number
  /** Noise octaves for turbulence - fixed at 3 for TSL version */
  octaves?: number
  /** Noise scaling parameters [x, y, z, time] (default: [1, 2, 1, 0.3]) */
  noiseScale?: [number, number, number, number]
  /** Fire shape intensity (default: 1.3) */
  magnitude?: number
  /** Noise lacunarity - frequency multiplier (default: 2.0) */
  lacunarity?: number
  /** Noise gain - amplitude multiplier (default: 0.5) */
  gain?: number
}

/**
 * Volumetric fire effect using TSL ray marching shaders
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * Creates a procedural fire effect that renders as a translucent volume.
 * Uses Perlin noise (mx_noise_float) instead of simplex noise.
 *
 * @example
 * ```ts
 * import { FireTSL } from '@wolffo/three-fire/tsl/vanilla'
 *
 * const texture = textureLoader.load('fire.png')
 * const fire = new FireTSL({
 *   fireTex: texture,
 *   color: 0xff4400,
 *   magnitude: 1.5
 * })
 * scene.add(fire)
 *
 * // In animation loop
 * fire.update(time)
 * ```
 */
export class FireTSL extends Mesh {
  public declare material: MeshBasicNodeMaterial
  private uniforms: FireTSLUniforms
  private _time = 0

  /**
   * Creates a new FireTSL instance
   *
   * @param props - Configuration options for the fire effect
   */
  constructor({
    fireTex,
    color = 0xeeeeee,
    iterations = 20,
    // octaves is fixed at 3 in TSL version for performance
    noiseScale = [1, 2, 1, 0.3],
    magnitude = 1.3,
    lacunarity = 2.0,
    gain = 0.5,
  }: FireTSLProps) {
    const geometry = new BoxGeometry(1, 1, 1)

    const config: FireTSLConfig = {
      fireTex,
      color: color instanceof Color ? color : new Color(color),
      noiseScale,
      magnitude,
      lacunarity,
      gain,
    }
    const uniforms = createFireUniforms(config)

    const material = new MeshBasicNodeMaterial()
    material.fragmentNode = createFireFragmentNode(uniforms, iterations)
    material.transparent = true
    material.depthWrite = false
    material.depthTest = false

    super(geometry, material)

    this.uniforms = uniforms
  }

  /**
   * Updates the fire animation and matrix uniforms
   *
   * Call this method in your animation loop to animate the fire effect.
   *
   * @param time - Current time in seconds (optional)
   *
   * @example
   * ```ts
   * function animate() {
   *   fire.update(performance.now() / 1000)
   *   renderer.render(scene, camera)
   *   requestAnimationFrame(animate)
   * }
   * ```
   */
  public update(time?: number): void {
    if (time !== undefined) {
      this._time = time
      this.uniforms.time.value = time
    }

    this.updateMatrixWorld()
    this.uniforms.invModelMatrix.value.copy(this.matrixWorld).invert()
    this.uniforms.scale.value.copy(this.scale)
  }

  public get time(): number {
    return this._time
  }

  public set time(value: number) {
    this._time = value
    this.uniforms.time.value = value
  }

  /**
   * Fire color tint
   *
   * @example
   * ```ts
   * fire.fireColor = 'orange'
   * fire.fireColor = 0xff4400
   * fire.fireColor = new Color(1, 0.5, 0)
   * ```
   */
  public get fireColor(): Color {
    return this.uniforms.color.value
  }

  public set fireColor(color: Color | string | number) {
    this.uniforms.color.value = color instanceof Color ? color : new Color(color)
  }

  /**
   * Fire shape intensity
   *
   * Higher values create more dramatic fire shapes.
   * Range: 0.5 - 3.0, Default: 1.3
   */
  public get magnitude(): number {
    return this.uniforms.magnitude.value
  }

  public set magnitude(value: number) {
    this.uniforms.magnitude.value = value
  }

  /**
   * Noise lacunarity (frequency multiplier)
   *
   * Controls how much the frequency increases for each noise octave.
   * Range: 1.0 - 4.0, Default: 2.0
   */
  public get lacunarity(): number {
    return this.uniforms.lacunarity.value
  }

  public set lacunarity(value: number) {
    this.uniforms.lacunarity.value = value
  }

  /**
   * Noise gain (amplitude multiplier)
   *
   * Controls how much the amplitude decreases for each noise octave.
   * Range: 0.1 - 1.0, Default: 0.5
   */
  public get gain(): number {
    return this.uniforms.gain.value
  }

  public set gain(value: number) {
    this.uniforms.gain.value = value
  }
}
