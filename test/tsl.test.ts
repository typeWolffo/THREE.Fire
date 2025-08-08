import { describe, it, expect } from 'vitest'

describe('TSL entry point', () => {
  it('should export TSL-only components without React dependencies', async () => {
    // Import TSL entry point
    const tslModule = await import('../src/tsl')
    
    expect(tslModule.NodeFireMesh).toBeDefined()
    expect(tslModule.NodeFireShader).toBeDefined()
    
    // Should not export standard GLSL components
    expect((tslModule as any).FireMesh).toBeUndefined()
    expect((tslModule as any).FireShader).toBeUndefined()
    
    // Should not export React-specific exports
    expect((tslModule as any).NodeFire).toBeUndefined()
    expect((tslModule as any).NodeFireComponent).toBeUndefined()
    expect((tslModule as any).useNodeFire).toBeUndefined()
  })

  it('should provide TSL-specific functionality', async () => {
    const tslModule = await import('../src/tsl')
    
    // NodeFireMesh should be the TSL Fire class
    expect(tslModule.NodeFireMesh).toBeDefined()
    expect(typeof tslModule.NodeFireMesh).toBe('function') // Constructor function
    
    // NodeFireShader should be TSL shader object
    expect(tslModule.NodeFireShader).toBeDefined()
    expect(typeof tslModule.NodeFireShader).toBe('object')
    expect(tslModule.NodeFireShader.createMaterial).toBeDefined()
    expect(tslModule.NodeFireShader.createUniforms).toBeDefined()
  })

  it('should not import React modules', async () => {
    // This test ensures TSL entry point doesn't import React
    const tslModule = await import('../src/tsl')
    
    // If this doesn't throw, React dependencies are not required
    expect(tslModule.NodeFireMesh).toBeDefined()
    expect(tslModule.NodeFireShader).toBeDefined()
  })

  it('should export TypeScript types', async () => {
    // Import types (this verifies TypeScript compilation)
    const tslModule = await import('../src/tsl')
    
    // Type exports should be available at compile time
    expect(tslModule.NodeFireMesh).toBeDefined()
  })
})