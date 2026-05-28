import { describe, it, expect } from 'vitest'

describe('TSL entry points', () => {
  it('tsl/vanilla exposes the mesh + shader factories without React', async () => {
    const m = await import('../src/tsl/vanilla')
    expect(m.FireMesh).toBeDefined()
    expect(m.createFireUniforms).toBeDefined()
    expect(m.createFireFragmentNode).toBeDefined()
    expect((m as Record<string, unknown>).Fire).toBeUndefined()
    expect((m as Record<string, unknown>).useFire).toBeUndefined()
  })

  it('tsl/react exposes the component + hook', async () => {
    const m = await import('../src/tsl/react')
    expect(m.Fire).toBeDefined()
    expect(m.useFire).toBeDefined()
  })

  it('tsl index re-exports both vanilla and react surfaces', async () => {
    const m = await import('../src/tsl/index')
    expect(m.FireMesh).toBeDefined()
    expect(m.Fire).toBeDefined()
    expect(m.useFire).toBeDefined()
    expect(m.createFireUniforms).toBeDefined()
    expect(m.createFireFragmentNode).toBeDefined()
  })
})
