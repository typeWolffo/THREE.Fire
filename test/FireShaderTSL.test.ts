import { describe, it, expect } from 'vitest'
import { createFireUniforms, createFireFragmentNode } from '../src/tsl/FireShaderTSL'
import { Color, Texture, Matrix4, Vector3, Vector4, LinearFilter, ClampToEdgeWrapping } from 'three'

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('FireShaderTSL', () => {
  describe('createFireUniforms', () => {
    it('builds uniforms with the expected value types', () => {
      const tex = new Texture()
      const u = createFireUniforms({ fireTex: tex }) as any
      expect(u.fireTex).toBe(tex)
      expect(u.color.value).toBeInstanceOf(Color)
      expect(u.time.value).toBe(0)
      expect(u.seed.value).toBeTypeOf('number')
      expect(u.invModelMatrix.value).toBeInstanceOf(Matrix4)
      expect(u.scale.value).toBeInstanceOf(Vector3)
      expect(u.noiseScale.value).toBeInstanceOf(Vector4)
      expect(u.magnitude.value).toBe(1.3)
      expect(u.lacunarity.value).toBe(2.0)
      expect(u.gain.value).toBe(0.5)
    })

    it('honors a custom config', () => {
      const u = createFireUniforms({
        fireTex: new Texture(),
        color: 0xff4400,
        magnitude: 2,
        lacunarity: 3,
        gain: 0.7,
        noiseScale: [4, 5, 6, 7],
      }) as any
      expect(u.magnitude.value).toBe(2)
      expect(u.lacunarity.value).toBe(3)
      expect(u.gain.value).toBe(0.7)
      expect(u.noiseScale.value).toMatchObject({ x: 4, y: 5, z: 6, w: 7 })
    })

    it('defaults color to 0xeeeeee', () => {
      const u = createFireUniforms({ fireTex: new Texture() }) as any
      expect(u.color.value.getHex()).toBe(new Color(0xeeeeee).getHex())
    })

    it('configures the texture sampler state', () => {
      const tex = new Texture()
      createFireUniforms({ fireTex: tex })
      expect(tex.magFilter).toBe(LinearFilter)
      expect(tex.minFilter).toBe(LinearFilter)
      expect(tex.wrapS).toBe(ClampToEdgeWrapping)
      expect(tex.wrapT).toBe(ClampToEdgeWrapping)
    })
  })

  describe('createFireFragmentNode', () => {
    it('returns a TSL node with default iterations/octaves', () => {
      const u = createFireUniforms({ fireTex: new Texture() })
      const node = createFireFragmentNode(u)
      expect(node).toBeDefined()
      expect(typeof node).toBe('object')
    })

    it('accepts custom iterations and octaves without throwing', () => {
      const u = createFireUniforms({ fireTex: new Texture() })
      expect(() => createFireFragmentNode(u, 30, 5)).not.toThrow()
      expect(() => createFireFragmentNode(u, 10, 1)).not.toThrow()
    })
  })
})
