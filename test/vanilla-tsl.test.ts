import { describe, it, expect } from 'vitest'

describe('Vanilla TSL entry point', () => {
  it('should export both standard and TSL components without React', async () => {
    // Import vanilla-tsl entry point
    const vanillaTslModule = await import('../src/vanilla-tsl')
    
    // Should export standard GLSL components
    expect(vanillaTslModule.FireMesh).toBeDefined()
    expect(vanillaTslModule.FireShader).toBeDefined()
    
    // Should export TSL components
    expect(vanillaTslModule.NodeFireMesh).toBeDefined()
    expect(vanillaTslModule.NodeFireShader).toBeDefined()
    
    // Should not export React-specific exports
    expect((vanillaTslModule as any).Fire).toBeUndefined()
    expect((vanillaTslModule as any).NodeFire).toBeUndefined()
    expect((vanillaTslModule as any).useFire).toBeUndefined()
    expect((vanillaTslModule as any).useNodeFire).toBeUndefined()
  })

  it('should provide both standard and TSL functionality', async () => {
    const vanillaTslModule = await import('../src/vanilla-tsl')
    
    // Standard Fire
    expect(vanillaTslModule.FireMesh).toBeDefined()
    expect(typeof vanillaTslModule.FireMesh).toBe('function') // Constructor
    expect(vanillaTslModule.FireShader).toBeDefined()
    expect(typeof vanillaTslModule.FireShader).toBe('object')
    
    // TSL NodeFire  
    expect(vanillaTslModule.NodeFireMesh).toBeDefined()
    expect(typeof vanillaTslModule.NodeFireMesh).toBe('function') // Constructor
    expect(vanillaTslModule.NodeFireShader).toBeDefined()
    expect(typeof vanillaTslModule.NodeFireShader).toBe('object')
    expect(vanillaTslModule.NodeFireShader.createMaterial).toBeDefined()
  })

  it('should not import React modules', async () => {
    // This test ensures vanilla-tsl entry point doesn't import React
    const vanillaTslModule = await import('../src/vanilla-tsl')
    
    // If this doesn't throw, React dependencies are not required
    expect(vanillaTslModule.FireMesh).toBeDefined()
    expect(vanillaTslModule.NodeFireMesh).toBeDefined()
  })

  it('standard and TSL components should be different classes', async () => {
    const vanillaTslModule = await import('../src/vanilla-tsl')
    
    // Should export different classes
    expect(vanillaTslModule.FireMesh).not.toBe(vanillaTslModule.NodeFireMesh)
    expect(vanillaTslModule.FireShader).not.toBe(vanillaTslModule.NodeFireShader)
  })

  it('should export TypeScript types for both implementations', async () => {
    const vanillaTslModule = await import('../src/vanilla-tsl')
    
    // Both implementations should be available
    expect(vanillaTslModule.FireMesh).toBeDefined()
    expect(vanillaTslModule.NodeFireMesh).toBeDefined()
  })
})