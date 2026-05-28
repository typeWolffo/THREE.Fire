import { describe, it, expect, beforeEach } from 'vitest'
import { FireTSL } from '../src/tsl/FireTSL'
import {
  Color,
  Texture,
  type Matrix4,
  type Vector3,
  type Vector4,
  LinearFilter,
  ClampToEdgeWrapping,
} from 'three'

// White-box access to the private uniform bag for deep assertions
type WithUniforms = {
  uniforms: {
    time: { value: number }
    seed: { value: number }
    color: { value: Color }
    invModelMatrix: { value: Matrix4 }
    scale: { value: Vector3 }
    noiseScale: { value: Vector4 }
    magnitude: { value: number }
    lacunarity: { value: number }
    gain: { value: number }
  }
}
const peek = (fire: FireTSL) => fire as unknown as WithUniforms

describe('FireTSL class', () => {
  let texture: Texture

  beforeEach(() => {
    texture = new Texture()
  })

  describe('constructor', () => {
    it('creates a FireTSL instance with a node material', () => {
      const fire = new FireTSL({ fireTex: texture })
      expect(fire).toBeInstanceOf(FireTSL)
      expect(fire.material).toBeDefined()
      expect(fire.material.fragmentNode).toBeDefined()
    })

    it('applies default values', () => {
      const fire = new FireTSL({ fireTex: texture })
      expect(fire.magnitude).toBe(1.3)
      expect(fire.lacunarity).toBe(2.0)
      expect(fire.gain).toBe(0.5)
      expect(fire.fireColor).toBeInstanceOf(Color)
    })

    it('applies custom values', () => {
      const fire = new FireTSL({
        fireTex: texture,
        color: 0xff4400,
        magnitude: 2.5,
        lacunarity: 3.0,
        gain: 0.8,
        iterations: 30,
        octaves: 4,
        noiseScale: [2, 3, 2, 0.5],
      })
      expect(fire.magnitude).toBe(2.5)
      expect(fire.lacunarity).toBe(3.0)
      expect(fire.gain).toBe(0.8)
      expect(peek(fire).uniforms.noiseScale.value).toMatchObject({ x: 2, y: 3, z: 2, w: 0.5 })
    })

    it('configures material for transparent volume rendering', () => {
      const fire = new FireTSL({ fireTex: texture })
      expect(fire.material.transparent).toBe(true)
      expect(fire.material.depthWrite).toBe(false)
      expect(fire.material.depthTest).toBe(false)
    })

    it('configures texture filters and wrapping', () => {
      new FireTSL({ fireTex: texture })
      expect(texture.magFilter).toBe(LinearFilter)
      expect(texture.minFilter).toBe(LinearFilter)
      expect(texture.wrapS).toBe(ClampToEdgeWrapping)
      expect(texture.wrapT).toBe(ClampToEdgeWrapping)
    })

    it('generates a distinct random seed per instance', () => {
      const a = peek(new FireTSL({ fireTex: texture })).uniforms.seed.value
      const b = peek(new FireTSL({ fireTex: new Texture() })).uniforms.seed.value
      expect(a).toBeTypeOf('number')
      expect(b).toBeTypeOf('number')
      expect(a).not.toBe(b)
    })
  })

  describe('update', () => {
    it('updates time when provided', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.update(5.5)
      expect(fire.time).toBe(5.5)
      expect(peek(fire).uniforms.time.value).toBe(5.5)
    })

    it('keeps time unchanged when called without an argument', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.time = 2.0
      fire.update()
      expect(fire.time).toBe(2.0)
    })

    it('writes the inverse world matrix into the uniform', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.position.set(5, 0, 0)
      fire.update(1.0)
      // world translation is +5 on X, so the inverse model matrix is -5 on X
      expect(peek(fire).uniforms.invModelMatrix.value.elements[12]).toBeCloseTo(-5)
    })
  })

  describe('property accessors', () => {
    it('gets and sets time', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.time = 3.14
      expect(fire.time).toBe(3.14)
      expect(peek(fire).uniforms.time.value).toBe(3.14)
    })

    it('sets fireColor from hex, string and Color', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.fireColor = 0xff0000
      expect(peek(fire).uniforms.color.value.r).toBe(1)
      fire.fireColor = 'red'
      expect(peek(fire).uniforms.color.value).toBeInstanceOf(Color)
      const c = new Color(0.5, 0.8, 0.2)
      fire.fireColor = c
      expect(peek(fire).uniforms.color.value).toBe(c)
    })

    it('gets and sets magnitude, lacunarity, gain', () => {
      const fire = new FireTSL({ fireTex: texture })
      fire.magnitude = 2.2
      fire.lacunarity = 3.3
      fire.gain = 0.66
      expect(fire.magnitude).toBe(2.2)
      expect(fire.lacunarity).toBe(3.3)
      expect(fire.gain).toBe(0.66)
    })
  })

  describe('dispose', () => {
    it('disposes geometry and material', () => {
      const fire = new FireTSL({ fireTex: texture })
      const geom = fire.geometry
      const mat = fire.material
      let geomDisposed = false
      let matDisposed = false
      geom.addEventListener('dispose', () => {
        geomDisposed = true
      })
      mat.addEventListener('dispose', () => {
        matDisposed = true
      })
      fire.dispose()
      expect(geomDisposed).toBe(true)
      expect(matDisposed).toBe(true)
    })
  })
})
