import { 
  vec3, 
  vec2,
  float,
  uniform,
  texture,
  Fn,
  dot,
  sqrt,
  mul,
  add,
  triNoise3D
} from 'three/tsl'
import NodeMaterial from 'three/src/materials/nodes/NodeMaterial.js'
import { RaymarchingBox } from 'three/examples/jsm/tsl/utils/Raymarching.js'
import {
  Color,
  Vector4,
  Texture
} from 'three'

/**
 * TSL-based uniforms for the node fire shader
 */
export interface NodeFireShaderUniforms {
  /** Fire texture (grayscale mask) */
  fireTex: Texture | null
  /** Fire color tint */
  color: Color
  /** Current time for animation */
  time: number
  /** Random seed for fire variation */
  seed: number
  /** Noise scaling parameters [x, y, z, time] */
  noiseScale: Vector4
  /** Fire shape intensity */
  magnitude: number
  /** Noise lacunarity - frequency multiplier */
  lacunarity: number
  /** Noise gain - amplitude multiplier */
  gain: number
  /** Ray marching iterations */
  iterations: number
  /** Noise octaves */
  octaves: number
}

/**
 * TSL Fire node function - the core fire sampling logic
 */
// @ts-ignore
const fireNode = /*@__PURE__*/ Fn((localPos, scale, magnitude, time, seed, fireTex) => {
  
  // Convert to cylindrical coordinates for fire shape
  const st = vec2(
    sqrt(dot(localPos.xz, localPos.xz)),
    localPos.y
  ).toVar()

  // Animate position with time
  const animatedPos = vec3(localPos).toVar()
  animatedPos.y.subAssign(mul(add(seed, time), scale.w))
  animatedPos.mulAssign(scale.xyz)

  // Generate turbulence using TSL triNoise3D
  const turbulence = triNoise3D(animatedPos, float(1.0), time).toVar()
  
  // Apply magnitude and turbulence to fire shape
  st.y.addAssign(mul(sqrt(st.y), mul(magnitude, turbulence)))

  // Sample texture with boundary checks
  return texture(fireTex, st)

})

/**
 * TSL Node-based fire shader configuration
 * 
 * This is a true TSL implementation using Three.js Shading Language nodes
 * instead of raw GLSL strings. This provides better performance, 
 * maintainability and leverages Three.js's node-based shader system.
 */
export const NodeFireShader = {
  /**
   * Default uniform values
   */
  createUniforms: (): NodeFireShaderUniforms => ({
    fireTex: null,
    color: new Color(0xeeeeee),
    time: 0.0,
    seed: 0.0,
    noiseScale: new Vector4(1, 2, 1, 0.3),
    magnitude: 1.3,
    lacunarity: 2.0,
    gain: 0.5,
    iterations: 20,
    octaves: 3,
  }),

  /**
   * Creates a TSL-based fire material with proper node architecture
   */
  createMaterial: (options: {
    uniforms?: Partial<NodeFireShaderUniforms>
  } = {}) => {
    const {
      uniforms: customUniforms = {}
    } = options

    // Create base uniforms and merge with custom
    const baseUniforms = NodeFireShader.createUniforms()
    const finalUniforms = { ...baseUniforms, ...customUniforms }

    // Create TSL uniform nodes
    const fireTexUniform = uniform(finalUniforms.fireTex)
    const colorUniform = uniform(finalUniforms.color)
    const timeUniform = uniform(finalUniforms.time) 
    const seedUniform = uniform(finalUniforms.seed)
    const noiseScaleUniform = uniform(finalUniforms.noiseScale)
    const magnitudeUniform = uniform(finalUniforms.magnitude)
    const iterationsCount = finalUniforms.iterations

    // Create the material using TSL RaymarchingBox
    const material = new NodeMaterial()
    
    material.colorNode = RaymarchingBox(iterationsCount, ({ positionRay }) => {
      
      // Transform ray position to local space
      const localPos = vec3(positionRay).toVar()
      localPos.y.addAssign(0.5)  // Center the fire
      localPos.xz.mulAssign(2.0) // Scale XZ for fire shape

      // Sample the fire using our TSL fire node
      const fireColor = fireNode(
        // @ts-ignore
        localPos,
        noiseScaleUniform,
        magnitudeUniform,
        timeUniform,
        seedUniform,
        fireTexUniform
      ).toVar()

      // Apply color tint and alpha
      fireColor.rgb.mulAssign(colorUniform)
      fireColor.a.assign(fireColor.r)

      return fireColor

    })

    // Configure material properties
    material.transparent = true
    material.depthWrite = false
    material.depthTest = false

    return material
  }
} as const