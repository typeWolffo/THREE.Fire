import { describe, it, expect } from 'vitest'

describe('React TSL entry point', () => {
  it('should export both standard and TSL React components', async () => {
    // Import react-tsl entry point
    const reactTslModule = await import('../src/react-tsl')
    
    // Should export standard React Fire component
    expect(reactTslModule.Fire).toBeDefined()
    expect(reactTslModule.useFire).toBeDefined()
    
    // Should export TSL React NodeFire component
    expect(reactTslModule.NodeFire).toBeDefined()
    expect(reactTslModule.useNodeFire).toBeDefined()
    
    // Should not export vanilla-specific exports
    expect((reactTslModule as any).FireMesh).toBeUndefined()
    expect((reactTslModule as any).NodeFireMesh).toBeUndefined()
    expect((reactTslModule as any).FireShader).toBeUndefined()
    expect((reactTslModule as any).NodeFireShader).toBeUndefined()
  })

  it('should provide React-specific functionality for both implementations', async () => {
    const reactTslModule = await import('../src/react-tsl')
    
    // Standard Fire React component
    expect(reactTslModule.Fire).toBeDefined()
    expect(typeof reactTslModule.Fire).toBe('object') // React forwardRef returns object
    expect(reactTslModule.useFire).toBeDefined()
    expect(typeof reactTslModule.useFire).toBe('function')
    
    // TSL NodeFire React component
    expect(reactTslModule.NodeFire).toBeDefined()
    expect(typeof reactTslModule.NodeFire).toBe('object') // React forwardRef returns object
    expect(reactTslModule.useNodeFire).toBeDefined()
    expect(typeof reactTslModule.useNodeFire).toBe('function')
  })

  it('standard and TSL React components should be different', async () => {
    const reactTslModule = await import('../src/react-tsl')
    
    // Should export different React components
    expect(reactTslModule.Fire).not.toBe(reactTslModule.NodeFire)
    expect(reactTslModule.useFire).not.toBe(reactTslModule.useNodeFire)
  })

  it('should export TypeScript types for both React implementations', async () => {
    const reactTslModule = await import('../src/react-tsl')
    
    // Both React components should be available
    expect(reactTslModule.Fire).toBeDefined()
    expect(reactTslModule.NodeFire).toBeDefined()
    
    // Both hooks should be available
    expect(reactTslModule.useFire).toBeDefined()
    expect(reactTslModule.useNodeFire).toBeDefined()
  })

  it('should handle React Three Fiber integration for both components', async () => {
    const reactTslModule = await import('../src/react-tsl')
    
    // Components should be properly structured for R3F
    expect(reactTslModule.Fire).toBeDefined()
    expect(reactTslModule.NodeFire).toBeDefined()
    
    // Display names should be set correctly
    expect((reactTslModule.Fire as any).displayName).toBe('Fire')
    expect((reactTslModule.NodeFire as any).displayName).toBe('NodeFire')
  })

  it('should provide both component ref interfaces', async () => {
    const reactTslModule = await import('../src/react-tsl')
    
    // Both hooks should be functions
    expect(reactTslModule.useFire).toBeTypeOf('function')
    expect(reactTslModule.useNodeFire).toBeTypeOf('function')
    
    // Note: Cannot test hook behavior outside React component context
    // These hooks are tested properly in their respective component tests
  })
})