import { describe, it, expect } from 'vitest'

describe('Main index entry point (with TSL)', () => {
  it('should export all components including TSL implementations', async () => {
    // Import main entry point
    const indexModule = await import('../src/index')
    
    // Should export standard GLSL components
    expect(indexModule.FireMesh).toBeDefined()
    expect(indexModule.FireShader).toBeDefined()
    expect(indexModule.Fire).toBeDefined()
    expect(indexModule.useFire).toBeDefined()
    
    // Should export TSL components (NodeFire as NodeFireMesh, NodeFireComponent as NodeFire)
    expect(indexModule.NodeFireMesh).toBeDefined()
    expect(indexModule.NodeFire).toBeDefined()
    
    // Should export TypeScript types
    expect(typeof indexModule.FireMesh).toBe('function')
    expect(typeof indexModule.Fire).toBe('object') // React forwardRef
  })

  it('should follow naming convention: NodeFire as NodeFireMesh, NodeFireComponent as NodeFire', async () => {
    const indexModule = await import('../src/index')
    
    // Verify export naming follows pattern like Fire -> FireMesh
    expect(indexModule.NodeFireMesh).toBeDefined() // The class
    expect(indexModule.NodeFire).toBeDefined() // The React component
    
    // Should be different objects
    expect(indexModule.NodeFireMesh).not.toBe(indexModule.NodeFire)
  })

  it('should provide full feature set for backward compatibility', async () => {
    const indexModule = await import('../src/index')
    
    // Standard Fire functionality
    expect(indexModule.FireMesh).toBeDefined()
    expect(indexModule.Fire).toBeDefined()
    expect(indexModule.useFire).toBeDefined()
    
    // TSL NodeFire functionality  
    expect(indexModule.NodeFireMesh).toBeDefined()
    expect(indexModule.NodeFire).toBeDefined()
    
    // All should be properly exported
    expect(typeof indexModule.FireMesh).toBe('function')
    expect(typeof indexModule.Fire).toBe('object')
    expect(typeof indexModule.useFire).toBe('function')
    expect(typeof indexModule.NodeFireMesh).toBe('function')
    expect(typeof indexModule.NodeFire).toBe('object')
  })

  it('should maintain backward compatibility with legacy imports', async () => {
    const indexModule = await import('../src/index')
    
    // Legacy patterns should still work
    expect(indexModule.FireMesh).toBeDefined()
    expect(indexModule.Fire).toBeDefined()
    
    // New TSL patterns should be available
    expect(indexModule.NodeFireMesh).toBeDefined()
    expect(indexModule.NodeFire).toBeDefined()
  })

  it('should export TypeScript types correctly', async () => {
    // This test verifies that TypeScript compilation includes all types
    const indexModule = await import('../src/index')
    
    // All major exports should be available
    expect(indexModule.FireMesh).toBeDefined()
    expect(indexModule.Fire).toBeDefined()
    expect(indexModule.NodeFireMesh).toBeDefined() 
    expect(indexModule.NodeFire).toBeDefined()
  })
})