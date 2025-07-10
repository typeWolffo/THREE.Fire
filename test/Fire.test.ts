import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Fire } from '../src/Fire'
import { Color, Texture } from 'three'

describe('Fire class', () => {
  let mockTexture: Texture

  beforeEach(() => {
    vi.clearAllMocks()
    mockTexture = new Texture()
  })

  describe('constructor', () => {
    it('creates Fire instance with required texture', () => {
      const fire = new Fire({ fireTex: mockTexture })

      expect(fire).toBeInstanceOf(Fire)
      expect(fire.material.uniforms.fireTex.value).toBe(mockTexture)
    })

    it('applies default values correctly', () => {
      const fire = new Fire({ fireTex: mockTexture })

      expect(fire.material.uniforms.magnitude.value).toBe(1.3)
      expect(fire.material.uniforms.lacunarity.value).toBe(2.0)
      expect(fire.material.uniforms.gain.value).toBe(0.5)
      expect(fire.material.uniforms.color.value).toBeInstanceOf(Color)
      expect(fire.material.uniforms.noiseScale.value).toEqual(expect.objectContaining({
        x: 1, y: 2, z: 1, w: 0.3
      }))
    })

    it('applies custom values correctly', () => {
      const fire = new Fire({
        fireTex: mockTexture,
        color: 0xff4400,
        magnitude: 2.5,
        lacunarity: 3.0,
        gain: 0.8,
        iterations: 30,
        octaves: 5,
        noiseScale: [2, 3, 2, 0.5]
      })

      expect(fire.material.uniforms.magnitude.value).toBe(2.5)
      expect(fire.material.uniforms.lacunarity.value).toBe(3.0)
      expect(fire.material.uniforms.gain.value).toBe(0.8)
      expect(fire.material.uniforms.color.value).toBeInstanceOf(Color)
      expect(fire.material.uniforms.noiseScale.value).toEqual(expect.objectContaining({
        x: 2, y: 3, z: 2, w: 0.5
      }))
      expect(fire.material.defines?.ITERATIONS).toBe('30')
      expect(fire.material.defines?.OCTAVES).toBe('5')
    })

    it('accepts Color objects', () => {
      const customColor = new Color('orange')
      const fire = new Fire({
        fireTex: mockTexture,
        color: customColor
      })

      expect(fire.material.uniforms.color.value).toBe(customColor)
    })

    it('configures material properties for transparency', () => {
      const fire = new Fire({ fireTex: mockTexture })

      expect(fire.material.transparent).toBe(true)
      expect(fire.material.depthWrite).toBe(false)
      expect(fire.material.depthTest).toBe(false)
    })

    it('configures texture filters and wrapping', () => {
      const fire = new Fire({ fireTex: mockTexture })

      expect(mockTexture.magFilter).toBe('LINEAR')
      expect(mockTexture.minFilter).toBe('LINEAR')
      expect(mockTexture.wrapS).toBe('CLAMP_TO_EDGE')
      expect(mockTexture.wrapT).toBe('CLAMP_TO_EDGE')
    })

    it('generates random seed', () => {
      const fire1 = new Fire({ fireTex: mockTexture })
      const fire2 = new Fire({ fireTex: mockTexture })

      expect(fire1.material.uniforms.seed.value).toBeTypeOf('number')
      expect(fire2.material.uniforms.seed.value).toBeTypeOf('number')
      // Seeds should be different (statistically very likely)
      expect(fire1.material.uniforms.seed.value).not.toBe(fire2.material.uniforms.seed.value)
    })
  })

  describe('update method', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('updates time when provided', () => {
      fire.update(5.5)

      expect(fire.time).toBe(5.5)
      expect(fire.material.uniforms.time.value).toBe(5.5)
    })

    it('updates matrix uniforms', () => {
      const updateMatrixWorldSpy = vi.spyOn(fire, 'updateMatrixWorld')
      const matrixCopySpy = vi.spyOn(fire.material.uniforms.invModelMatrix.value, 'copy')
      const scaleCopySpy = vi.spyOn(fire.material.uniforms.scale.value, 'copy')

      fire.update(1.0)

      expect(updateMatrixWorldSpy).toHaveBeenCalled()
      expect(matrixCopySpy).toHaveBeenCalledWith(fire.matrixWorld)
      expect(scaleCopySpy).toHaveBeenCalledWith(fire.scale)
    })

    it('works without time parameter', () => {
      fire.time = 2.0
      fire.update()

      expect(fire.time).toBe(2.0) // Should remain unchanged
      expect(fire.material.uniforms.time.value).toBe(2.0)
    })
  })

  describe('time property', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('gets and sets time correctly', () => {
      fire.time = 3.14

      expect(fire.time).toBe(3.14)
      expect(fire.material.uniforms.time.value).toBe(3.14)
    })
  })

  describe('fireColor property', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('gets current color', () => {
      const color = fire.fireColor
      expect(color).toBeInstanceOf(Color)
    })

    it('sets color from hex number', () => {
      fire.fireColor = 0xff0000
      expect(fire.material.uniforms.color.value).toBeInstanceOf(Color)
      expect(fire.material.uniforms.color.value.r).toBe(1)
      expect(fire.material.uniforms.color.value.g).toBe(0)
      expect(fire.material.uniforms.color.value.b).toBe(0)
    })

    it('sets color from string', () => {
      fire.fireColor = 'red'
      expect(fire.material.uniforms.color.value).toBeInstanceOf(Color)
    })

    it('sets color from Color object', () => {
      const customColor = new Color(0.5, 0.8, 0.2)
      fire.fireColor = customColor
      expect(fire.material.uniforms.color.value).toBe(customColor)
    })
  })

  describe('magnitude property', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('gets and sets magnitude', () => {
      fire.magnitude = 2.5
      expect(fire.magnitude).toBe(2.5)
      expect(fire.material.uniforms.magnitude.value).toBe(2.5)
    })
  })

  describe('lacunarity property', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('gets and sets lacunarity', () => {
      fire.lacunarity = 3.5
      expect(fire.lacunarity).toBe(3.5)
      expect(fire.material.uniforms.lacunarity.value).toBe(3.5)
    })
  })

  describe('gain property', () => {
    let fire: Fire

    beforeEach(() => {
      fire = new Fire({ fireTex: mockTexture })
    })

    it('gets and sets gain', () => {
      fire.gain = 0.75
      expect(fire.gain).toBe(0.75)
      expect(fire.material.uniforms.gain.value).toBe(0.75)
    })
  })

  describe('shader uniforms', () => {
    it('initializes all required uniforms', () => {
      const fire = new Fire({ fireTex: mockTexture })
      const uniforms = fire.material.uniforms

      expect(uniforms.fireTex).toBeDefined()
      expect(uniforms.color).toBeDefined()
      expect(uniforms.time).toBeDefined()
      expect(uniforms.seed).toBeDefined()
      expect(uniforms.invModelMatrix).toBeDefined()
      expect(uniforms.scale).toBeDefined()
      expect(uniforms.noiseScale).toBeDefined()
      expect(uniforms.magnitude).toBeDefined()
      expect(uniforms.lacunarity).toBeDefined()
      expect(uniforms.gain).toBeDefined()
    })

    it('has correct uniform types', () => {
      const fire = new Fire({ fireTex: mockTexture })
      const uniforms = fire.material.uniforms

      expect(uniforms.fireTex.value).toBe(mockTexture)
      expect(uniforms.color.value).toBeInstanceOf(Color)
      expect(uniforms.time.value).toBeTypeOf('number')
      expect(uniforms.seed.value).toBeTypeOf('number')
      expect(uniforms.invModelMatrix.value).toBeDefined()
      expect(uniforms.scale.value).toBeDefined()
      expect(uniforms.noiseScale.value).toBeDefined()
      expect(uniforms.magnitude.value).toBeTypeOf('number')
      expect(uniforms.lacunarity.value).toBeTypeOf('number')
      expect(uniforms.gain.value).toBeTypeOf('number')
    })
  })
})
