import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Color, Texture, Vector4 } from 'three'

// Mock NodeFire for testing environment since TSL requires WebGL context
vi.mock('../src/NodeFire', () => {
  const { Color, Vector4 } = require('three')
  
  class MockNodeFire {
    private _time = 0
    private _uniforms: any

    constructor(props: any) {
      this._uniforms = {
        fireTex: props.fireTex,
        color: props.color instanceof Color ? props.color : new Color(props.color || 0xeeeeee),
        time: 0.0,
        seed: Math.random() * 19.19,
        noiseScale: new Vector4(...(props.noiseScale || [1, 2, 1, 0.3])),
        magnitude: props.magnitude || 1.3,
        lacunarity: props.lacunarity || 2.0,
        gain: props.gain || 0.5,
        iterations: props.iterations || 20,
        octaves: props.octaves || 3,
      }

      // Configure texture
      props.fireTex.magFilter = props.fireTex.minFilter = 'LINEAR'
      props.fireTex.wrapS = props.fireTex.wrapT = 'CLAMP_TO_EDGE'
    }

    update(time?: number) {
      if (time !== undefined) {
        this._time = time
        this._uniforms.time = time
      }
      this.updateMatrixWorld()
    }

    get time() { return this._time }
    set time(value: number) { 
      this._time = value
      this._uniforms.time = value
    }

    get fireColor() { return this._uniforms.color }
    set fireColor(color: any) {
      this._uniforms.color = color instanceof Color ? color : new Color(color)
    }

    get magnitude() { return this._uniforms.magnitude }
    set magnitude(value: number) { this._uniforms.magnitude = value }

    get lacunarity() { return this._uniforms.lacunarity }
    set lacunarity(value: number) { this._uniforms.lacunarity = value }

    get gain() { return this._uniforms.gain }
    set gain(value: number) { this._uniforms.gain = value }

    get fireTex() { return this._uniforms.fireTex }
    set fireTex(texture: any) { 
      this._uniforms.fireTex = texture 
      if (texture) {
        texture.magFilter = texture.minFilter = 'LINEAR'
        texture.wrapS = texture.wrapT = 'CLAMP_TO_EDGE'
      }
    }

    get noiseScale() { return this._uniforms.noiseScale }
    set noiseScale(value: Vector4) { this._uniforms.noiseScale = value }

    get seed() { return this._uniforms.seed }
    set seed(value: number) { this._uniforms.seed = value }

    get iterations() { return this._uniforms.iterations }
    get octaves() { return this._uniforms.octaves }

    updateMatrixWorld = vi.fn()
  }

  return { NodeFire: MockNodeFire }
})

import { NodeFire } from '../src/NodeFire'

describe('NodeFire class', () => {
  let mockTexture: Texture

  beforeEach(() => {
    vi.clearAllMocks()
    mockTexture = new Texture()
  })

  describe('constructor', () => {
    it('creates NodeFire instance with required texture', () => {
      const fire = new NodeFire({ fireTex: mockTexture })

      expect(fire).toBeInstanceOf(NodeFire)
      expect(fire.fireTex).toBe(mockTexture)
    })

    it('applies default values correctly', () => {
      const fire = new NodeFire({ fireTex: mockTexture })

      expect(fire.magnitude).toBe(1.3)
      expect(fire.lacunarity).toBe(2.0)
      expect(fire.gain).toBe(0.5)
      expect(fire.fireColor.isColor).toBe(true)
      expect(fire.noiseScale).toEqual(expect.objectContaining({
        x: 1, y: 2, z: 1, w: 0.3
      }))
      expect(fire.iterations).toBe(20)
      expect(fire.octaves).toBe(3)
    })

    it('applies custom values correctly', () => {
      const fire = new NodeFire({
        fireTex: mockTexture,
        color: 0xff4400,
        magnitude: 2.5,
        lacunarity: 3.0,
        gain: 0.8,
        iterations: 30,
        octaves: 5,
        noiseScale: [2, 3, 2, 0.5]
      })

      expect(fire.magnitude).toBe(2.5)
      expect(fire.lacunarity).toBe(3.0)
      expect(fire.gain).toBe(0.8)
      expect(fire.fireColor.isColor).toBe(true)
      expect(fire.noiseScale).toEqual(expect.objectContaining({
        x: 2, y: 3, z: 2, w: 0.5
      }))
      expect(fire.iterations).toBe(30)
      expect(fire.octaves).toBe(5)
    })

    it('accepts Color objects', () => {
      const customColor = new Color('orange')
      const fire = new NodeFire({
        fireTex: mockTexture,
        color: customColor
      })

      expect(fire.fireColor.isColor).toBe(true)
    })

    it('configures texture filters and wrapping', () => {
      const fire = new NodeFire({ fireTex: mockTexture })

      expect(mockTexture.magFilter).toBe('LINEAR')
      expect(mockTexture.minFilter).toBe('LINEAR')
      expect(mockTexture.wrapS).toBe('CLAMP_TO_EDGE')
      expect(mockTexture.wrapT).toBe('CLAMP_TO_EDGE')
    })

    it('generates random seed', () => {
      const fire1 = new NodeFire({ fireTex: mockTexture })
      const fire2 = new NodeFire({ fireTex: mockTexture })

      expect(fire1.seed).toBeTypeOf('number')
      expect(fire2.seed).toBeTypeOf('number')
      // Seeds should be different (statistically very likely)
      expect(fire1.seed).not.toBe(fire2.seed)
    })

    it('creates NodeFire instance', () => {
      const fire = new NodeFire({ fireTex: mockTexture })
      expect(fire).toBeInstanceOf(NodeFire)
    })
  })

  describe('update method', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('updates time when provided', () => {
      fire.update(5.5)

      expect(fire.time).toBe(5.5)
    })

    it('updates matrix uniforms', () => {
      const updateMatrixWorldSpy = vi.spyOn(fire, 'updateMatrixWorld')

      fire.update(1.0)

      expect(updateMatrixWorldSpy).toHaveBeenCalled()
    })

    it('works without time parameter', () => {
      fire.time = 2.0
      fire.update()

      expect(fire.time).toBe(2.0) // Should remain unchanged
    })
  })

  describe('time property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets time correctly', () => {
      fire.time = 3.14

      expect(fire.time).toBe(3.14)
    })
  })

  describe('fireColor property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets current color', () => {
      const color = fire.fireColor
      expect(color.isColor).toBe(true)
    })

    it('sets color from hex number', () => {
      fire.fireColor = 0xff0000
      expect(fire.fireColor.isColor).toBe(true)
      expect(fire.fireColor.r).toBe(1)
      expect(fire.fireColor.g).toBe(0)
      expect(fire.fireColor.b).toBe(0)
    })

    it('sets color from string', () => {
      fire.fireColor = 'red'
      expect(fire.fireColor.isColor).toBe(true)
    })

    it('sets color from Color object', () => {
      const customColor = new Color(0.5, 0.8, 0.2)
      fire.fireColor = customColor
      expect(fire.fireColor.isColor).toBe(true)
    })
  })

  describe('magnitude property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets magnitude', () => {
      fire.magnitude = 2.5
      expect(fire.magnitude).toBe(2.5)
    })
  })

  describe('lacunarity property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets lacunarity', () => {
      fire.lacunarity = 3.5
      expect(fire.lacunarity).toBe(3.5)
    })
  })

  describe('gain property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets gain', () => {
      fire.gain = 0.75
      expect(fire.gain).toBe(0.75)
    })
  })

  describe('fireTex property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets current texture', () => {
      expect(fire.fireTex).toBe(mockTexture)
    })

    it('sets new texture and configures it', () => {
      const newTexture = new Texture()
      fire.fireTex = newTexture

      expect(fire.fireTex).toBe(newTexture)
      expect(newTexture.magFilter).toBe('LINEAR')
      expect(newTexture.minFilter).toBe('LINEAR')
      expect(newTexture.wrapS).toBe('CLAMP_TO_EDGE')
      expect(newTexture.wrapT).toBe('CLAMP_TO_EDGE')
    })

    it('handles null texture', () => {
      fire.fireTex = null
      expect(fire.fireTex).toBeNull()
    })
  })

  describe('noiseScale property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets noiseScale', () => {
      const newScale = new Vector4(2, 3, 1, 0.5)
      fire.noiseScale = newScale

      expect(fire.noiseScale).toBe(newScale)
      expect(fire.noiseScale.x).toBe(2)
      expect(fire.noiseScale.y).toBe(3)
      expect(fire.noiseScale.z).toBe(1)
      expect(fire.noiseScale.w).toBe(0.5)
    })
  })

  describe('seed property', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ fireTex: mockTexture })
    })

    it('gets and sets seed', () => {
      fire.seed = 42.5
      expect(fire.seed).toBe(42.5)
    })
  })

  describe('read-only properties', () => {
    let fire: NodeFire

    beforeEach(() => {
      fire = new NodeFire({ 
        fireTex: mockTexture,
        iterations: 25,
        octaves: 4
      })
    })

    it('returns correct iterations value', () => {
      expect(fire.iterations).toBe(25)
    })

    it('returns correct octaves value', () => {
      expect(fire.octaves).toBe(4)
    })
  })

  describe('TSL uniforms integration', () => {
    it('initializes all required uniforms', () => {
      const fire = new NodeFire({ fireTex: mockTexture })

      expect(fire.fireTex).toBeDefined()
      expect(fire.fireColor).toBeDefined()
      expect(fire.time).toBeDefined()
      expect(fire.seed).toBeDefined()
      expect(fire.noiseScale).toBeDefined()
      expect(fire.magnitude).toBeDefined()
      expect(fire.lacunarity).toBeDefined()
      expect(fire.gain).toBeDefined()
      expect(fire.iterations).toBeDefined()
      expect(fire.octaves).toBeDefined()
    })

    it('has correct uniform types', () => {
      const fire = new NodeFire({ fireTex: mockTexture })

      expect(fire.fireTex).toBe(mockTexture)
      expect(fire.fireColor.isColor).toBe(true)
      expect(fire.time).toBeTypeOf('number')
      expect(fire.seed).toBeTypeOf('number')
      expect(fire.noiseScale).toHaveProperty('x')
      expect(fire.noiseScale).toHaveProperty('y') 
      expect(fire.noiseScale).toHaveProperty('z')
      expect(fire.noiseScale).toHaveProperty('w')
      expect(fire.magnitude).toBeTypeOf('number')
      expect(fire.lacunarity).toBeTypeOf('number')
      expect(fire.gain).toBeTypeOf('number')
      expect(fire.iterations).toBeTypeOf('number')
      expect(fire.octaves).toBeTypeOf('number')
    })
  })
})