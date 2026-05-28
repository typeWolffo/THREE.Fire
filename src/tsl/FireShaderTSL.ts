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
import {
  Color,
  Matrix4,
  Vector3,
  Vector4,
  type Texture,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'

// TSL nodes expose a dynamically-proxied fluent API (swizzles, operators,
// assignment) that three.js's published types don't model — three's own TSL
// types fall back to `unknown`/FIXME here. We confine that untyped surface to
// internal shader construction; the exported `FireTSLUniforms` below stays
// precisely typed for consumers.
// biome-ignore lint/suspicious/noExplicitAny: TSL's proxy node API isn't statically typeable
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
 * Precisely-typed, consumer-facing view of the fire uniforms.
 *
 * Each animated parameter is exposed as a `{ value }` box (a TSL uniform node),
 * matching how `FireTSL`'s getters and setters read and write them.
 */
export interface FireTSLUniforms {
  fireTex: Texture
  color: { value: Color }
  time: { value: number }
  seed: { value: number }
  invModelMatrix: { value: Matrix4 }
  scale: { value: Vector3 }
  noiseScale: { value: Vector4 }
  magnitude: { value: number }
  lacunarity: { value: number }
  gain: { value: number }
}

/**
 * Internal view of the same uniform objects as raw TSL nodes, used while
 * building the shader graph (where the fluent node API is required).
 */
type FireUniformNodes = { fireTex: Texture } & Record<
  Exclude<keyof FireTSLUniforms, 'fireTex'>,
  TSLNode
>

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

    Loop(octaves, () => {
      sum.addAssign(abs(mx_noise_float(pos.mul(freq))).mul(amp))
      freq.mulAssign(lacunarityUniform)
      amp.mulAssign(gainUniform)
    })

    return sum
  })

const localize = Fn(([worldPos, invMatrix]: [TSLNode, TSLNode]) => {
  return invMatrix.mul(vec4(worldPos, 1.0)).xyz
})

/**
 * Creates fire sampler function with uniforms captured in closure
 * This is necessary because TSL Fn parameters must be TSL nodes, not plain objects
 * Uses TSL's built-in `time` node for automatic animation
 *
 * @param octaves - Number of FBM turbulence octaves (baked into the node graph)
 */
const createSamplerFire = (uniforms: FireUniformNodes, octaves: number) => {
  const turbulence = createTurbulence(octaves)
  return Fn(([p, scaleVec]: [TSLNode, TSLNode]) => {
    const radius = sqrt(dot(p.xz, p.xz))
    const st = vec2(radius, p.y).toVar('st')

    const animP = vec3(p).toVar('animP')
    const timeOffset = uniforms.seed.add(time).mul(scaleVec.w)
    animP.y.subAssign(timeOffset)
    animP.assign(animP.mul(vec3(scaleVec.x, scaleVec.y, scaleVec.z)))

    const turbulenceValue = turbulence(animP, uniforms.lacunarity, uniforms.gain)
    st.y.addAssign(sqrt(st.y).mul(uniforms.magnitude).mul(turbulenceValue))

    const outOfBounds = st.x
      .lessThanEqual(0.0)
      .or(st.x.greaterThanEqual(1.0))
      .or(st.y.lessThanEqual(0.0))
      .or(st.y.greaterThanEqual(1.0))

    const texSample = texture(uniforms.fireTex, st)
    return select(outOfBounds, vec4(0.0), texSample)
  })
}

/**
 * Creates the main fire fragment node for ray marching
 *
 * @param uniforms - Fire shader uniforms
 * @param iterations - Number of ray marching iterations (default: 20)
 * @param octaves - Number of FBM turbulence octaves (default: 3)
 * @returns TSL node for the fragment shader
 */
export const createFireFragmentNode = (
  uniforms: FireTSLUniforms,
  iterations: number = 20,
  octaves: number = 3,
) => {
  // Inside shader construction we need the fluent node API, not the `{ value }`
  // view, so widen to the internal node type in this one place.
  const u = uniforms as unknown as FireUniformNodes
  const samplerFire = createSamplerFire(u, octaves)

  return Fn(() => {
    const rayPos = vec3(positionWorld).toVar('rayPos')
    const rayDir = normalize(rayPos.sub(cameraPosition)).toVar('rayDir')
    const rayLen = float(0.0288).mul(length(u.scale))

    const col = vec4(0.0).toVar('col')

    Loop(iterations, () => {
      rayPos.addAssign(rayDir.mul(rayLen))

      const lp = localize(rayPos, u.invModelMatrix).toVar('lp')
      lp.y.addAssign(0.5)
      lp.x.mulAssign(2.0)
      lp.z.mulAssign(2.0)

      col.addAssign(samplerFire(lp, u.noiseScale))
    })

    const colorVec = vec3(u.color)
    col.x.mulAssign(colorVec.x)
    col.y.mulAssign(colorVec.y)
    col.z.mulAssign(colorVec.z)
    col.w.assign(col.x)

    return col
  })()
}
