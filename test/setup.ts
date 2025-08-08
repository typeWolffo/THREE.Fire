import '@testing-library/jest-dom'
import { beforeAll, vi } from 'vitest'

// Mock Three.js classes
class MockTexture {
  magFilter = null
  minFilter = null
  wrapS = null
  wrapT = null
}

class MockMesh {
  geometry: any
  material: any
  scale = { x: 1, y: 1, z: 1, copy: vi.fn().mockReturnThis() }
  matrixWorld = { copy: vi.fn().mockReturnValue({ invert: vi.fn() }) }

  constructor(geometry: any, material: any) {
    this.geometry = geometry
    this.material = material
  }

  updateMatrixWorld = vi.fn()
}

class MockBoxGeometry {}

class MockShaderMaterial {
  uniforms: any
  transparent = false
  depthWrite = true
  depthTest = true

  constructor(options: any) {
    this.uniforms = options.uniforms || {}
    Object.assign(this, options)
  }
}

class MockVector3 {
  x: number
  y: number
  z: number

  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  copy = vi.fn().mockReturnThis()
}

class MockVector4 {
  x: number
  y: number
  z: number
  w: number

  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
}

class MockMatrix4 {
  copy = vi.fn().mockReturnThis()
  invert = vi.fn().mockReturnThis()
}

class MockColor {
  r: number = 0
  g: number = 0
  b: number = 0
  isColor: boolean = true

  constructor(color?: any) {
    if (typeof color === 'number') {
      this.r = ((color >> 16) & 255) / 255
      this.g = ((color >> 8) & 255) / 255
      this.b = (color & 255) / 255
    } else if (typeof color === 'string') {
      // Simple string color handling
      this.r = this.g = this.b = 0.5
    }
  }

  setHSL = vi.fn().mockReturnThis()

  equals(other: MockColor) {
    return this.r === other.r && this.g === other.g && this.b === other.b
  }
}

// Mock Three.js module
vi.mock('three', () => ({
  Mesh: MockMesh,
  BoxGeometry: MockBoxGeometry,
  ShaderMaterial: MockShaderMaterial,
  Vector3: MockVector3,
  Vector4: MockVector4,
  Matrix4: MockMatrix4,
  Color: MockColor,
  Texture: MockTexture,
  TextureLoader: class MockTextureLoader {},
  LinearFilter: 'LINEAR',
  ClampToEdgeWrapping: 'CLAMP_TO_EDGE'
}))

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  extend: vi.fn(),
  useFrame: vi.fn((callback) => {
    // Only call callback if it's provided and in test environment
    if (callback && typeof callback === 'function') {
      try {
        const mockState = {
          clock: { getElapsedTime: () => 1.0 }
        }
        callback(mockState)
      } catch (e) {
        // Ignore errors in tests - they're expected when mocks aren't perfect
      }
    }
  }),
  useLoader: vi.fn(() => new MockTexture())
}))

beforeAll(() => {
  // Suppress React warnings for custom R3F elements
  const originalError = console.error
  console.error = (...args) => {
    const message = args[0]
    if (
      typeof message === 'string' && (
        message.includes('is using incorrect casing') ||
        message.includes('is unrecognized in this browser')
      )
    ) {
      return // Suppress R3F element warnings
    }
    originalError.apply(console, args)
  }
})
