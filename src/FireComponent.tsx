import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { extend, useFrame, ReactThreeFiber, useLoader } from '@react-three/fiber'
import { Fire as FireMesh, FireProps as FireMeshProps } from './Fire'
import { Color, TextureLoader, Texture } from 'three'

/**
 * Helper hook for texture loading (alternative to @react-three/drei)
 */
const useTexture = (url: string): Texture => useLoader(TextureLoader, url)

// Extend R3F with our Fire class
extend({ Fire: FireMesh })

declare module '@react-three/fiber' {
  interface ThreeElements {
    fire: ReactThreeFiber.Object3DNode<FireMesh, typeof FireMesh>
  }
}

/**
 * Props for the Fire React component
 */
export interface FireProps extends Omit<FireMeshProps, 'fireTex'> {
  /** Fire texture URL or Three.js Texture object */
  texture: string | Texture
  /** Auto-update time from useFrame (default: true) */
  autoUpdate?: boolean
  /** Custom update function called each frame */
  onUpdate?: (fire: FireMesh, time: number) => void
  /** Child components */
  children?: React.ReactNode
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Scale factor (uniform or per-axis) */
  scale?: [number, number, number] | number
}

/**
 * Ref interface for imperative fire control
 */
export interface FireRef {
  /** Fire mesh instance */
  fire: FireMesh | null
  /** Update fire animation manually */
  update: (time?: number) => void
}

/**
 * React Three Fiber component for volumetric fire effect
 *
 * Creates a procedural fire effect that can be easily integrated into R3F scenes.
 * The component automatically handles texture loading, animation updates, and
 * provides props for all fire parameters.
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <Fire
 *     texture="/fire.png"
 *     color="orange"
 *     magnitude={1.5}
 *     scale={[2, 3, 2]}
 *     position={[0, 0, 0]}
 *   />
 * </Canvas>
 * ```
 *
 * @example With custom animation
 * ```tsx
 * <Fire
 *   texture="/fire.png"
 *   onUpdate={(fire, time) => {
 *     fire.fireColor.setHSL((time * 0.1) % 1, 1, 0.5)
 *   }}
 * />
 * ```
 */
export const FireComponent = forwardRef<FireRef, FireProps>(
  (
    {
      texture,
      color = 0xeeeeee,
      iterations = 20,
      octaves = 3,
      noiseScale = [1, 2, 1, 0.3],
      magnitude = 1.3,
      lacunarity = 2.0,
      gain = 0.5,
      autoUpdate = true,
      onUpdate,
      children,
      ...props
    },
    ref
  ) => {
    const fireRef = useRef<FireMesh>(null)

    // Load texture if string is provided
    const loadedTexture = useTexture(typeof texture === 'string' ? texture : '')
    const finalTexture = typeof texture === 'string' ? loadedTexture : texture

    // Memoize fire props to prevent unnecessary recreations
    const fireProps = useMemo(
      () => ({
        fireTex: finalTexture,
        color: color instanceof Color ? color : new Color(color),
        iterations,
        octaves,
        noiseScale,
        magnitude,
        lacunarity,
        gain,
      }),
      [finalTexture, color, iterations, octaves, noiseScale, magnitude, lacunarity, gain]
    )

    // Auto-update with useFrame
    useFrame((state) => {
      if (fireRef.current && autoUpdate) {
        const time = state.clock.getElapsedTime()
        fireRef.current.update(time)
        onUpdate?.(fireRef.current, time)
      }
    })

    // Expose imperative handle
    useImperativeHandle(
      ref,
      () => ({
        get fire() {
          return fireRef.current
        },
        update: (time?: number) => {
          if (fireRef.current) {
            fireRef.current.update(time)
          }
        },
      }),
      []
    )

    return (
      <fire ref={fireRef} args={[fireProps]} {...props}>
        {children}
      </fire>
    )
  }
)

FireComponent.displayName = 'Fire'

/**
 * Hook for easier access to fire instance and controls
 *
 * Provides a ref and helper methods for controlling fire imperatively.
 *
 * @returns Object with ref, fire instance, and update method
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const fireRef = useFire()
 *
 *   const handleClick = () => {
 *     if (fireRef.fire) {
 *       fireRef.fire.magnitude = 2.0
 *     }
 *   }
 *
 *   return (
 *     <Fire ref={fireRef.ref} texture="/fire.png" />
 *   )
 * }
 * ```
 */
export const useFire = () => {
  const ref = useRef<FireRef>(null)
  return {
    /** Ref to pass to Fire component */
    ref,
    /** Fire mesh instance (null until mounted) */
    fire: ref.current?.fire || null,
    /** Update fire animation manually */
    update: (time?: number) => ref.current?.update(time),
  }
}
