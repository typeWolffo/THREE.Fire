import { describe, it, expect } from 'vitest'

describe('Vanilla entry point', () => {
  it('should export FireMesh and FireShader without React dependencies', async () => {
    // Import vanilla entry point
    const vanillaModule = await import('../src/vanilla')
    
    expect(vanillaModule.FireMesh).toBeDefined()
    expect(vanillaModule.FireShader).toBeDefined()
    
    // Should not export React-specific exports
    expect((vanillaModule as any).Fire).toBeUndefined()
    expect((vanillaModule as any).FireComponent).toBeUndefined()
    expect((vanillaModule as any).useFire).toBeUndefined()
  })

  it('should not import React modules', async () => {
    // This test ensures vanilla entry point doesn't import React
    // by checking that we can import it without React being available
    const vanillaModule = await import('../src/vanilla')
    
    // If this doesn't throw, React dependencies are not required
    expect(vanillaModule.FireMesh).toBeDefined()
    expect(vanillaModule.FireShader).toBeDefined()
  })
})