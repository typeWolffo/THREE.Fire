import { describe, it, expect } from 'vitest'

describe('Legacy root entry point', () => {
  it('re-exports the vanilla mesh, shader and React surface', async () => {
    const m = await import('../src/index')
    expect(m.FireMesh).toBeDefined()
    expect(m.FireShader).toBeDefined()
    expect(m.Fire).toBeDefined()
    expect(m.FireComponent).toBeDefined()
    expect(m.useFire).toBeDefined()
  })

  it('aliases Fire to the React component', async () => {
    const m = await import('../src/index')
    expect(m.Fire).toBe(m.FireComponent)
  })
})
