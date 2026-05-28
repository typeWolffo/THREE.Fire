import type React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { FireComponent, useFire } from '../src/tsl/FireComponentTSL'
import { Texture } from 'three'

const MockCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="mock-canvas">{children}</div>
)

describe('FireComponentTSL', () => {
  let texture: Texture

  beforeEach(() => {
    vi.clearAllMocks()
    texture = new Texture()
  })

  it('renders with a Texture object', () => {
    const { container } = render(
      <MockCanvas>
        <FireComponent texture={texture} />
      </MockCanvas>,
    )
    expect(container).toBeTruthy()
  })

  it('renders with a URL string', () => {
    const { container } = render(
      <MockCanvas>
        <FireComponent texture="/fire.png" />
      </MockCanvas>,
    )
    expect(container).toBeTruthy()
  })

  // Regression guard: the old code called useLoader conditionally, so switching
  // the texture prop between a URL and a Texture object crashed React with
  // "Rendered fewer hooks than during the previous render".
  it('switches between URL and Texture object without throwing', () => {
    const { rerender } = render(
      <MockCanvas>
        <FireComponent texture="/fire.png" />
      </MockCanvas>,
    )
    expect(() =>
      rerender(
        <MockCanvas>
          <FireComponent texture={texture} />
        </MockCanvas>,
      ),
    ).not.toThrow()
    expect(() =>
      rerender(
        <MockCanvas>
          <FireComponent texture="/another.png" />
        </MockCanvas>,
      ),
    ).not.toThrow()
  })

  it('accepts all configuration props', () => {
    const { container } = render(
      <MockCanvas>
        <FireComponent
          texture={texture}
          color={0xff4400}
          magnitude={2.5}
          lacunarity={3.0}
          gain={0.8}
          iterations={30}
          octaves={4}
          noiseScale={[2, 3, 2, 0.5]}
          position={[1, 2, 3]}
          scale={[2, 3, 2]}
        />
      </MockCanvas>,
    )
    expect(container).toBeTruthy()
  })

  it('has the correct displayName', () => {
    expect(FireComponent.displayName).toBe('Fire')
  })

  it('renders children', () => {
    const { getByTestId } = render(
      <MockCanvas>
        <FireComponent texture={texture}>
          <div data-testid="fire-child">child</div>
        </FireComponent>
      </MockCanvas>,
    )
    expect(getByTestId('fire-child')).toBeTruthy()
  })
})

describe('useFire (TSL)', () => {
  it('returns ref, a fresh fire getter, and an update fn', () => {
    let result: ReturnType<typeof useFire>
    const TestComponent = () => {
      result = useFire()
      return (
        <MockCanvas>
          <FireComponent ref={result.ref} texture={new Texture()} />
        </MockCanvas>
      )
    }
    render(<TestComponent />)
    expect(result!.ref).toBeDefined()
    // getter reads fresh through the ref each access (never throws)
    expect(result!.fire).toBeDefined()
    expect(result!.update).toBeTypeOf('function')
  })

  it('update does not throw without a mounted fire', () => {
    let result: ReturnType<typeof useFire>
    const TestComponent = () => {
      result = useFire()
      return <div />
    }
    render(<TestComponent />)
    expect(() => result!.update()).not.toThrow()
    expect(() => result!.update(1.0)).not.toThrow()
  })
})
