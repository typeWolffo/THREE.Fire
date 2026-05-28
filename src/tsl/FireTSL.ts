/**
 * @fileoverview TSL Fire mesh class for vanilla Three.js with WebGPU support
 *
 * This is the TSL equivalent of the GLSL Fire class, using MeshBasicNodeMaterial
 * and node-based shaders for WebGPU compatibility.
 */

import { BoxGeometry, type Texture, Color } from 'three'
import { MeshBasicNodeMaterial } from 'three/webgpu'
import {
  createFireUniforms,
  createFireFragmentNode,
  type FireTSLConfig,
  type FireTSLUniforms,
} from './FireShaderTSL'
import { AbstractFire } from '../internal/AbstractFire'

export interface FireTSLProps {
  /** Fire texture (grayscale mask defining fire shape) */
  fireTex: Texture
  /** Fire color tint (default: 0xeeeeee) */
  color?: Color | string | number
  /** Ray marching iterations - higher = better quality, lower performance (default: 20) */
  iterations?: number
  /** Noise octaves for turbulence (default: 3) */
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
 * Volumetric fire effect using TSL ray marching shaders (WebGPU)
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
 *
 * // When done
 * fire.dispose()
 * ```
 */
export class FireTSL extends AbstractFire<MeshBasicNodeMaterial> {
  private uniforms: FireTSLUniforms

  /**
   * Creates a new FireTSL instance
   *
   * @param props - Configuration options for the fire effect
   */
  constructor({
    fireTex,
    color = 0xeeeeee,
    iterations = 20,
    octaves = 3,
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
    material.fragmentNode = createFireFragmentNode(uniforms, iterations, octaves)
    material.transparent = true
    material.depthWrite = false
    material.depthTest = false

    super(geometry, material)

    this.uniforms = uniforms
  }

  protected getUniforms(): FireTSLUniforms {
    return this.uniforms
  }
}
