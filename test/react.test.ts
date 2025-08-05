import { describe, it, expect } from 'vitest'

describe('React entry point', () => {
  it('should export React components and hooks only', async () => {
    // Import React entry point
    const reactModule = await import('../src/react')
    
    expect(reactModule.Fire).toBeDefined()
    expect(reactModule.useFire).toBeDefined()
    
    // Should not export vanilla-specific exports with different names
    expect((reactModule as any).FireMesh).toBeUndefined()
    expect((reactModule as any).FireShader).toBeUndefined()
  })

  it('should provide React-specific functionality', async () => {
    const reactModule = await import('../src/react')
    
    // Fire should be the React component (FireComponent)
    expect(reactModule.Fire).toBeDefined()
    expect(typeof reactModule.Fire).toBe('object') // React forwardRef returns object
    
    // useFire should be a hook function
    expect(reactModule.useFire).toBeDefined()
    expect(typeof reactModule.useFire).toBe('function')
  })
})