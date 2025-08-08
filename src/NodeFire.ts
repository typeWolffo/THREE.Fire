import {
  Mesh,
  BoxGeometry,
  Texture,
  Color,
  Vector4,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'
import NodeMaterial from 'three/src/materials/nodes/NodeMaterial.js'
import { NodeFireShader, NodeFireShaderUniforms } from './NodeFireShader'

/**
 * Properties for creating a NodeFire instance (same as Fire but for TSL)
 */
export interface NodeFireProps {
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
 * TSL Node-based volumetric fire effect using Three.js Shading Language
 *
 * Creates a procedural fire effect that renders as a translucent volume using
 * modern node-based shaders instead of raw GLSL. This provides better 
 * performance and maintainability while achieving the same visual result.
 *
 * @example
 * ```ts
 * const texture = textureLoader.load('fire.png')
 * const fire = new NodeFire({
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
export class NodeFire extends Mesh {
  public declare material: NodeMaterial
  private _time = 0
  private _uniforms: NodeFireShaderUniforms

  /**
   * Creates a new NodeFire instance using TSL node-based shaders
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
  }: NodeFireProps) {
    const geometry = new BoxGeometry(1, 1, 1)
    
    // Create uniforms first
    const uniforms: NodeFireShaderUniforms = {
      fireTex,
      color: color instanceof Color ? color : new Color(color),
      time: 0.0,
      seed: Math.random() * 19.19,
      noiseScale: new Vector4(...noiseScale),
      magnitude,
      lacunarity,
      gain,
      iterations,
      octaves,
    }

    // Create the TSL-based material
    const material = NodeFireShader.createMaterial({ uniforms })

    super(geometry, material)
    
    // Store uniforms for access after super call
    this._uniforms = uniforms

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
      this._uniforms.time = time
    }

    this.updateMatrixWorld()
  }

  /**
   * Current animation time in seconds
   */
  public get time(): number {
    return this._time
  }

  public set time(value: number) {
    this._time = value
    this._uniforms.time = value
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
    return this._uniforms.color
  }

  public set fireColor(color: Color | string | number) {
    this._uniforms.color = color instanceof Color ? color : new Color(color)
  }

  /**
   * Fire shape intensity
   *
   * Higher values create more dramatic fire shapes.
   * Range: 0.5 - 3.0, Default: 1.3
   */
  public get magnitude(): number {
    return this._uniforms.magnitude
  }

  public set magnitude(value: number) {
    this._uniforms.magnitude = value
  }

  /**
   * Noise lacunarity (frequency multiplier)
   *
   * Controls how much the frequency increases for each noise octave.
   * Range: 1.0 - 4.0, Default: 2.0
   */
  public get lacunarity(): number {
    return this._uniforms.lacunarity
  }

  public set lacunarity(value: number) {
    this._uniforms.lacunarity = value
  }

  /**
   * Noise gain (amplitude multiplier)
   *
   * Controls how much the amplitude decreases for each noise octave.
   * Range: 0.1 - 1.0, Default: 0.5
   */
  public get gain(): number {
    return this._uniforms.gain
  }

  public set gain(value: number) {
    this._uniforms.gain = value
  }

  /**
   * Fire texture
   */
  public get fireTex(): Texture | null {
    return this._uniforms.fireTex
  }

  public set fireTex(texture: Texture | null) {
    this._uniforms.fireTex = texture
    if (texture) {
      texture.magFilter = texture.minFilter = LinearFilter
      texture.wrapS = texture.wrapT = ClampToEdgeWrapping
    }
  }

  /**
   * Noise scaling parameters [x, y, z, time]
   */
  public get noiseScale(): Vector4 {
    return this._uniforms.noiseScale
  }

  public set noiseScale(value: Vector4) {
    this._uniforms.noiseScale = value
  }

  /**
   * Random seed for fire variation
   */
  public get seed(): number {
    return this._uniforms.seed
  }

  public set seed(value: number) {
    this._uniforms.seed = value
  }

  /**
   * Ray marching iterations (read-only at runtime)
   */
  public get iterations(): number {
    return this._uniforms.iterations
  }

  /**
   * Noise octaves (read-only at runtime)
   */
  public get octaves(): number {
    return this._uniforms.octaves
  }
}