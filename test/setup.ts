import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { Texture } from 'three'

/**
 *
 * Three's classes (Mesh, ShaderMaterial, BoxGeometry, Color, Vector*, Matrix4,
 * and the WebGPU node materials) all construct fine under happy-dom without a
 * WebGL/WebGPU context — only `renderer.render()` needs a GPU, which we never
 * call. So tests exercise real uniform wiring, matrix math and texture config
 * instead of mock shapes.
 *
 * React Three Fiber genuinely needs a Canvas + renderer, so we stub the handful
 * of hooks the components use.
 */
vi.mock('@react-three/fiber', () => {
  const registered: Record<string, unknown> = {}
  return {
    extend: (entries: Record<string, unknown>) => {
      Object.assign(registered, entries)
    },
    /** Test-only handle to inspect what was registered via extend() */
    __registered: registered,
    useFrame: vi.fn((callback?: (state: unknown) => void) => {
      if (typeof callback === 'function') {
        try {
          callback({ clock: { getElapsedTime: () => 1.0 } })
        } catch {
          // fireRef.current is null under the mock canvas — expected in unit tests
        }
      }
    }),
    useLoader: vi.fn(() => new Texture()),
    // `ReactThreeFiber` is a types-only namespace; provide a runtime placeholder
    // so the named import resolves.
    ReactThreeFiber: {},
  }
})
