/**
 * @fileoverview TSL (Three.js Shading Language) implementation of volumetric fire shader
 *
 * Uses WebGPU-compatible node-based shaders with Perlin noise (mx_noise_float).
 * This is the TSL equivalent of the GLSL FireShader.
 */

import {
  Fn,
  Loop,
  vec2,
  vec3,
  vec4,
  float,
  int,
  uniform,
  texture,
  normalize,
  abs,
  sqrt,
  dot,
  length,
  cameraPosition,
  positionWorld,
  mx_noise_float,
  select,
  time,
} from 'three/tsl'
import { Color, Matrix4, Vector3, Vector4, Texture, LinearFilter, ClampToEdgeWrapping } from 'three'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TSLNode = any

/**
 * Configuration for fire uniforms
 */
export interface FireTSLConfig {
  fireTex: Texture
  color?: Color | number
  noiseScale?: [number, number, number, number]
  magnitude?: number
  lacunarity?: number
  gain?: number
}

/**
 * Uniforms interface for the TSL fire shader
 * Using TSLNode type for flexibility with Three.js TSL type system
 */
export interface FireTSLUniforms {
  fireTex: Texture
  color: TSLNode
  time: TSLNode & { value: number }
  seed: TSLNode & { value: number }
  invModelMatrix: TSLNode & { value: Matrix4 }
  scale: TSLNode & { value: Vector3 }
  noiseScale: TSLNode
  magnitude: TSLNode & { value: number }
  lacunarity: TSLNode
  gain: TSLNode & { value: number }
}

export const createFireUniforms = (config: FireTSLConfig): FireTSLUniforms => {
  const colorValue =
    config.color instanceof Color ? config.color : new Color(config.color ?? 0xeeeeee)

  config.fireTex.magFilter = LinearFilter
  config.fireTex.minFilter = LinearFilter
  config.fireTex.wrapS = ClampToEdgeWrapping
  config.fireTex.wrapT = ClampToEdgeWrapping

  return {
    fireTex: config.fireTex,
    color: uniform(colorValue),
    time: uniform(0),
    seed: uniform(Math.random() * 19.19),
    invModelMatrix: uniform(new Matrix4()),
    scale: uniform(new Vector3(1, 1, 1)),
    noiseScale: uniform(new Vector4(...(config.noiseScale ?? [1, 2, 1, 0.3]))),
    magnitude: uniform(config.magnitude ?? 1.3),
    lacunarity: uniform(config.lacunarity ?? 2.0),
    gain: uniform(config.gain ?? 0.5),
  }
}

/**
 * Turbulence function using Fractional Brownian Motion (FBM)
 * Uses mx_noise_float (Perlin noise) instead of simplex noise
 */
const createTurbulence = (octaves: number) =>
  Fn(([p, lacunarityUniform, gainUniform]: [TSLNode, TSLNode, TSLNode]) => {
    const sum = float(0).toVar('turbSum')
    const freq = float(1).toVar('turbFreq')
    const amp = float(1).toVar('turbAmp')
    const pos = vec3(p).toVar('turbPos')

    Loop(int(octaves), () => {
      sum.addAssign(abs(mx_noise_float(pos.mul(freq))).mul(amp))
      freq.mulAssign(lacunarityUniform)
      amp.mulAssign(gainUniform)
    })

    return sum
  })

const turbulence3 = createTurbulence(3)

const localize = Fn(([worldPos, invMatrix]: [TSLNode, TSLNode]) => {
  return invMatrix.mul(vec4(worldPos, 1.0)).xyz
})

/**
 * Creates fire sampler function with uniforms captured in closure
 * This is necessary because TSL Fn parameters must be TSL nodes, not plain objects
 * Uses TSL's built-in `time` node for automatic animation
 */
const createSamplerFire = (uniforms: FireTSLUniforms) =>
  Fn(([p, scaleVec]: [TSLNode, TSLNode]) => {
    const radius = sqrt(dot(p.xz, p.xz))
    const st = vec2(radius, p.y).toVar('st')

    const animP = vec3(p).toVar('animP')
    const timeOffset = uniforms.seed.add(time).mul(scaleVec.w)
    animP.y.subAssign(timeOffset)
    animP.assign(animP.mul(vec3(scaleVec.x, scaleVec.y, scaleVec.z)))

    const turbulenceValue = turbulence3(animP, uniforms.lacunarity, uniforms.gain)
    st.y.addAssign(sqrt(st.y).mul(uniforms.magnitude).mul(turbulenceValue))

    const outOfBounds = st.x
      .lessThanEqual(0.0)
      .or(st.x.greaterThanEqual(1.0))
      .or(st.y.lessThanEqual(0.0))
      .or(st.y.greaterThanEqual(1.0))

    const texSample = texture(uniforms.fireTex, st)
    return select(outOfBounds, vec4(0.0), texSample)
  })

/**
 * Creates the main fire fragment node for ray marching
 *
 * @param uniforms - Fire shader uniforms
 * @param iterations - Number of ray marching iterations (default: 20)
 * @returns TSL node for the fragment shader
 */
export const createFireFragmentNode = (uniforms: FireTSLUniforms, iterations: number = 20) => {
  const samplerFire = createSamplerFire(uniforms)

  return Fn(() => {
    const rayPos = vec3(positionWorld).toVar('rayPos')
    const rayDir = normalize(rayPos.sub(cameraPosition)).toVar('rayDir')
    const rayLen = float(0.0288).mul(length(uniforms.scale))

    const col = vec4(0.0).toVar('col')

    Loop(int(iterations), () => {
      rayPos.addAssign(rayDir.mul(rayLen))

      const lp = localize(rayPos, uniforms.invModelMatrix).toVar('lp')
      lp.y.addAssign(0.5)
      lp.x.mulAssign(2.0)
      lp.z.mulAssign(2.0)

      col.addAssign(samplerFire(lp, uniforms.noiseScale))
    })

    const colorVec = vec3(uniforms.color)
    col.x.mulAssign(colorVec.x)
    col.y.mulAssign(colorVec.y)
    col.z.mulAssign(colorVec.z)
    col.w.assign(col.x)

    return col
  })()
}
