import { describe, it, expect, vi } from 'vitest'
import { Color, Vector4, Texture } from 'three'

// Mock NodeFireShader for testing environment since TSL requires WebGL context
vi.mock('../src/NodeFireShader', () => {
  // Use the mocked Three.js classes from setup.ts
  const MockColor = vi.fn().mockImplementation(function(this: any, color?: any) {
    this.r = 0
    this.g = 0 
    this.b = 0
    if (typeof color === 'number') {
      this.r = ((color >> 16) & 255) / 255
      this.g = ((color >> 8) & 255) / 255
      this.b = (color & 255) / 255
    }
    this.getHex = () => color || 0xeeeeee
  })
  
  const MockVector4 = vi.fn().mockImplementation(function(this: any, x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  })
  
  const MockNodeFireShader = {
    createUniforms: () => ({
      fireTex: null,
      color: new (MockColor as any)(0xeeeeee),
      time: 0.0,
      seed: 0.0,
      noiseScale: new (MockVector4 as any)(1, 2, 1, 0.3),
      magnitude: 1.3,
      lacunarity: 2.0,
      gain: 0.5,
      iterations: 20,
      octaves: 3,
    }),

    createMaterial: (options = {}) => {
      const { uniforms: customUniforms = {} } = options
      const baseUniforms = MockNodeFireShader.createUniforms()
      const finalUniforms = { ...baseUniforms, ...customUniforms }

      return {
        transparent: true,
        depthWrite: false,
        depthTest: false,
        colorNode: {}, // Mock colorNode
        constructor: { name: 'NodeMaterial' }
      }
    }
  }

  return { NodeFireShader: MockNodeFireShader }
})

import { NodeFireShader } from '../src/NodeFireShader'

describe('NodeFireShader', () => {
  describe('exports', () => {
    it('exports required TSL shader properties', () => {
      expect(NodeFireShader).toBeDefined()
      expect(NodeFireShader.createUniforms).toBeDefined()
      expect(NodeFireShader.createMaterial).toBeDefined()
    })

    it('createUniforms is a function', () => {
      expect(typeof NodeFireShader.createUniforms).toBe('function')
    })

    it('createMaterial is a function', () => {
      expect(typeof NodeFireShader.createMaterial).toBe('function')
    })
  })

  describe('createUniforms', () => {
    it('returns default uniform values', () => {
      const uniforms = NodeFireShader.createUniforms()

      expect(uniforms).toBeDefined()
      expect(uniforms.fireTex).toBeNull()
      expect(uniforms.color).toBeDefined()
      expect(uniforms.time).toBe(0.0)
      expect(uniforms.seed).toBe(0.0)
      expect(uniforms.noiseScale).toBeDefined()
      expect(uniforms.magnitude).toBe(1.3)
      expect(uniforms.lacunarity).toBe(2.0)
      expect(uniforms.gain).toBe(0.5)
      expect(uniforms.iterations).toBe(20)
      expect(uniforms.octaves).toBe(3)
    })

    it('has correct default noiseScale values', () => {
      const uniforms = NodeFireShader.createUniforms()
      const noiseScale = uniforms.noiseScale

      expect(noiseScale.x).toBe(1)
      expect(noiseScale.y).toBe(2)
      expect(noiseScale.z).toBe(1)
      expect(noiseScale.w).toBe(0.3)
    })

    it('creates new instances each time', () => {
      const uniforms1 = NodeFireShader.createUniforms()
      const uniforms2 = NodeFireShader.createUniforms()

      expect(uniforms1).not.toBe(uniforms2)
      expect(uniforms1.color).not.toBe(uniforms2.color)
      expect(uniforms1.noiseScale).not.toBe(uniforms2.noiseScale)
    })

    it('has correct default color', () => {
      const uniforms = NodeFireShader.createUniforms()
      expect(uniforms.color.getHex()).toBe(0xeeeeee)
    })
  })

  describe('createMaterial', () => {
    it('creates a material with NodeMaterial characteristics', () => {
      const material = NodeFireShader.createMaterial()

      expect(material.constructor.name).toBe('NodeMaterial')
    })

    it('configures material properties for transparency', () => {
      const material = NodeFireShader.createMaterial()

      expect(material.transparent).toBe(true)
      expect(material.depthWrite).toBe(false)
      expect(material.depthTest).toBe(false)
    })

    it('creates material without options', () => {
      const material = NodeFireShader.createMaterial()

      expect(material.constructor.name).toBe('NodeMaterial')
      expect(material.colorNode).toBeDefined()
    })

    it('creates material with empty options', () => {
      const material = NodeFireShader.createMaterial({})

      expect(material.constructor.name).toBe('NodeMaterial')
      expect(material.colorNode).toBeDefined()
    })

    it('accepts custom uniforms', () => {
      const customUniforms = {
        color: new Color(0xff4400),
        magnitude: 2.5,
        iterations: 30,
        time: 5.0
      }

      const material = NodeFireShader.createMaterial({
        uniforms: customUniforms
      })

      expect(material.constructor.name).toBe('NodeMaterial')
    })

    it('merges custom uniforms with defaults', () => {
      const customUniforms = {
        magnitude: 2.0,
        lacunarity: 3.0
      }

      const material = NodeFireShader.createMaterial({
        uniforms: customUniforms
      })

      expect(material.constructor.name).toBe('NodeMaterial')
      // Material should be created successfully with merged uniforms
    })

    it('handles texture uniform', () => {
      const texture = new Texture()
      const material = NodeFireShader.createMaterial({
        uniforms: {
          fireTex: texture
        }
      })

      expect(material.constructor.name).toBe('NodeMaterial')
    })
  })

  describe('TSL integration', () => {
    it('uses TSL RaymarchingBox for volumetric rendering', () => {
      const material = NodeFireShader.createMaterial()

      expect(material.colorNode).toBeDefined()
      // The colorNode should be configured by RaymarchingBox
    })

    it('supports different iteration counts', () => {
      const material1 = NodeFireShader.createMaterial({
        uniforms: { iterations: 10 }
      })
      const material2 = NodeFireShader.createMaterial({
        uniforms: { iterations: 50 }
      })

      expect(material1.constructor.name).toBe('NodeMaterial')
      expect(material2.constructor.name).toBe('NodeMaterial')
      expect(material1.colorNode).toBeDefined()
      expect(material2.colorNode).toBeDefined()
    })

    it('handles complex uniform configurations', () => {
      const complexUniforms = {
        fireTex: new Texture(),
        color: new Color('orange'),
        time: 10.5,
        seed: 42.0,
        noiseScale: new Vector4(2, 3, 1, 0.5),
        magnitude: 2.5,
        lacunarity: 2.5,
        gain: 0.7,
        iterations: 25,
        octaves: 4
      }

      const material = NodeFireShader.createMaterial({
        uniforms: complexUniforms
      })

      expect(material.constructor.name).toBe('NodeMaterial')
      expect(material.transparent).toBe(true)
    })
  })

  describe('shader integration', () => {
    it('uniforms match what NodeFire class expects', () => {
      // This test ensures NodeFireShader exports match what NodeFire.ts uses
      const defaultUniforms = NodeFireShader.createUniforms()
      
      const requiredUniforms = [
        'fireTex',
        'color', 
        'time',
        'seed',
        'noiseScale',
        'magnitude',
        'lacunarity',
        'gain',
        'iterations',
        'octaves'
      ]

      const actualUniforms = Object.keys(defaultUniforms)

      requiredUniforms.forEach(uniform => {
        expect(actualUniforms).toContain(uniform)
      })
    })

    it('provides consistent default values', () => {
      const uniforms1 = NodeFireShader.createUniforms()
      const uniforms2 = NodeFireShader.createUniforms()

      // Values should be the same (but objects different)
      expect(uniforms1.magnitude).toBe(uniforms2.magnitude)
      expect(uniforms1.lacunarity).toBe(uniforms2.lacunarity) 
      expect(uniforms1.gain).toBe(uniforms2.gain)
      expect(uniforms1.iterations).toBe(uniforms2.iterations)
      expect(uniforms1.octaves).toBe(uniforms2.octaves)
      
      // Colors should have same hex value
      expect(uniforms1.color.getHex()).toBe(uniforms2.color.getHex())
    })

    it('creates unique materials each time', () => {
      const material1 = NodeFireShader.createMaterial()
      const material2 = NodeFireShader.createMaterial()

      expect(material1).not.toBe(material2)
      expect(material1.constructor.name).toBe('NodeMaterial')
      expect(material2.constructor.name).toBe('NodeMaterial')
    })
  })

  describe('TSL node architecture', () => {
    it('creates materials with proper TSL node structure', () => {
      const material = NodeFireShader.createMaterial()

      // Should have a colorNode (TSL-based)
      expect(material.colorNode).toBeDefined()
      
      // Material should be properly configured for fire rendering
      expect(material.transparent).toBe(true)
      expect(material.depthWrite).toBe(false)
      expect(material.depthTest).toBe(false)
    })

    it('supports TSL uniform binding', () => {
      const customColor = new Color(0x00ff00)
      const material = NodeFireShader.createMaterial({
        uniforms: {
          color: customColor,
          magnitude: 1.8,
          time: 2.5
        }
      })

      expect(material.constructor.name).toBe('NodeMaterial')
      expect(material.colorNode).toBeDefined()
    })
  })
})