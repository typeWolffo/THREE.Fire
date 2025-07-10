import { describe, it, expect } from 'vitest'
import { FireShader } from '../src/FireShader'

describe('FireShader', () => {
  describe('exports', () => {
    it('exports required shader properties', () => {
      expect(FireShader).toBeDefined()
      expect(FireShader.defines).toBeDefined()
      expect(FireShader.uniforms).toBeDefined()
      expect(FireShader.vertexShader).toBeDefined()
      expect(FireShader.fragmentShader).toBeDefined()
    })

    it('has correct defines structure', () => {
      expect(FireShader.defines).toEqual({
        ITERATIONS: '20',
        OCTAVES: '3'
      })
    })

    it('has all required uniforms', () => {
      const uniforms = FireShader.uniforms

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

    it('has uniform values with correct types', () => {
      const uniforms = FireShader.uniforms

      expect(uniforms.fireTex.value).toBeNull()
      expect(uniforms.color.value).toBeDefined()
      expect(uniforms.time.value).toBe(0.0)
      expect(uniforms.seed.value).toBe(0.0)
      expect(uniforms.invModelMatrix.value).toBeDefined()
      expect(uniforms.scale.value).toBeDefined()
      expect(uniforms.noiseScale.value).toBeDefined()
      expect(uniforms.magnitude.value).toBe(1.3)
      expect(uniforms.lacunarity.value).toBe(2.0)
      expect(uniforms.gain.value).toBe(0.5)
    })
  })

  describe('vertex shader', () => {
    it('is a non-empty string', () => {
      expect(typeof FireShader.vertexShader).toBe('string')
      expect(FireShader.vertexShader.length).toBeGreaterThan(0)
    })

            it('contains required GLSL elements', () => {
      const vs = FireShader.vertexShader

      // Basic vertex shader structure
      expect(vs).toMatch(/varying|out/)
      expect(vs).toContain('void main()')
      expect(vs).toContain('gl_Position')
      expect(vs).toContain('position') // Three.js built-in attribute
    })
  })

  describe('fragment shader', () => {
    it('is a non-empty string', () => {
      expect(typeof FireShader.fragmentShader).toBe('string')
      expect(FireShader.fragmentShader.length).toBeGreaterThan(0)
    })

    it('contains required GLSL elements', () => {
      const fs = FireShader.fragmentShader

      // Basic fragment shader structure
      expect(fs).toContain('uniform')
      expect(fs).toContain('varying')
      expect(fs).toContain('void main()')
      expect(fs).toContain('gl_FragColor')
    })

    it('contains fire-specific uniforms', () => {
      const fs = FireShader.fragmentShader

      expect(fs).toContain('fireTex')
      expect(fs).toContain('time')
      expect(fs).toContain('magnitude')
      expect(fs).toContain('noiseScale')
    })

    it('contains defines for iterations and octaves', () => {
      const fs = FireShader.fragmentShader

      expect(fs).toContain('ITERATIONS')
      expect(fs).toContain('OCTAVES')
    })

    it('contains noise and ray marching logic', () => {
      const fs = FireShader.fragmentShader

      // Should contain some indication of noise generation
      expect(fs).toMatch(/noise|fbm|simplex|perlin/i)

      // Should contain ray marching loop indicators
      expect(fs).toMatch(/for|while|step|march/i)
    })
  })

  describe('shader integration', () => {
    it('uniforms match what Fire class expects', () => {
      // This test ensures FireShader exports match what Fire.ts uses
      const requiredUniforms = [
        'fireTex',
        'color',
        'time',
        'seed',
        'invModelMatrix',
        'scale',
        'noiseScale',
        'magnitude',
        'lacunarity',
        'gain'
      ]

      const actualUniforms = Object.keys(FireShader.uniforms)

      requiredUniforms.forEach(uniform => {
        expect(actualUniforms).toContain(uniform)
      })
    })

    it('defines can be overridden by Fire class', () => {
      // Fire class should be able to override defines for ITERATIONS and OCTAVES
      const defaultDefines = FireShader.defines

      expect(defaultDefines.ITERATIONS).toBe('20')
      expect(defaultDefines.OCTAVES).toBe('3')

      // These should be strings (shader preprocessor values)
      expect(typeof defaultDefines.ITERATIONS).toBe('string')
      expect(typeof defaultDefines.OCTAVES).toBe('string')
    })
  })
})
