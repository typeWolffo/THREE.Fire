import {
  Mesh,
  BoxGeometry,
  ShaderMaterial,
  Texture,
  Color,
  Vector3,
  Vector4,
  Matrix4,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'
import { FireShader, FireShaderUniforms } from './FireShader'

/**
 * Properties for creating a Fire instance
 */
export interface FireProps {
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
 * Volumetric fire effect using ray marching shaders
 *
 * Creates a procedural fire effect that renders as a translucent volume.
 * The fire shape is defined by a grayscale texture, with white areas being
 * the most dense part of the fire.
 *
 * @example
 * ```ts
 * const texture = textureLoader.load('fire.png')
 * const fire = new Fire({
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
export class Fire extends Mesh {
  public declare material: ShaderMaterial & { uniforms: FireShaderUniforms }
  private _time = 0

  /**
   * Creates a new Fire instance
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
  }: FireProps) {
    const geometry = new BoxGeometry(1, 1, 1)

    const material = new ShaderMaterial({
      defines: {
        ITERATIONS: iterations.toString(),
        OCTAVES: octaves.toString(),
      },
      uniforms: {
        fireTex: { value: fireTex },
        color: { value: color instanceof Color ? color : new Color(color) },
        time: { value: 0.0 },
        seed: { value: Math.random() * 19.19 },
        invModelMatrix: { value: new Matrix4() },
        scale: { value: new Vector3(1, 1, 1) },
        noiseScale: { value: new Vector4(...noiseScale) },
        magnitude: { value: magnitude },
        lacunarity: { value: lacunarity },
        gain: { value: gain },
      },
      vertexShader: FireShader.vertexShader,
      fragmentShader: FireShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    }) as ShaderMaterial & { uniforms: FireShaderUniforms }

    super(geometry, material)

    // Configure texture
    fireTex.magFilter = fireTex.minFilter = LinearFilter
    fireTex.wrapS = fireTex.wrapT = ClampToEdgeWrapping
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
      this.material.uniforms.time.value = time
    }

    this.updateMatrixWorld()
    this.material.uniforms.invModelMatrix.value.copy(this.matrixWorld).invert()
    this.material.uniforms.scale.value.copy(this.scale)
  }

  /**
   * Current animation time in seconds
   */
  public get time(): number {
    return this._time
  }

  public set time(value: number) {
    this._time = value
    this.material.uniforms.time.value = value
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
    return this.material.uniforms.color.value
  }

  public set fireColor(color: Color | string | number) {
    this.material.uniforms.color.value = color instanceof Color ? color : new Color(color)
  }

  /**
   * Fire shape intensity
   *
   * Higher values create more dramatic fire shapes.
   * Range: 0.5 - 3.0, Default: 1.3
   */
  public get magnitude(): number {
    return this.material.uniforms.magnitude.value
  }

  public set magnitude(value: number) {
    this.material.uniforms.magnitude.value = value
  }

  /**
   * Noise lacunarity (frequency multiplier)
   *
   * Controls how much the frequency increases for each noise octave.
   * Range: 1.0 - 4.0, Default: 2.0
   */
  public get lacunarity(): number {
    return this.material.uniforms.lacunarity.value
  }

  public set lacunarity(value: number) {
    this.material.uniforms.lacunarity.value = value
  }

  /**
   * Noise gain (amplitude multiplier)
   *
   * Controls how much the amplitude decreases for each noise octave.
   * Range: 0.1 - 1.0, Default: 0.5
   */
  public get gain(): number {
    return this.material.uniforms.gain.value
  }

  public set gain(value: number) {
    this.material.uniforms.gain.value = value
  }
}
