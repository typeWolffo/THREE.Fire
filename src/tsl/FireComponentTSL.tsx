/**
 * @fileoverview React Three Fiber component for TSL Fire effect
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * Provides the same API as the GLSL FireComponent but with TSL backend.
 */

import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { extend, useFrame, ReactThreeFiber, useLoader } from '@react-three/fiber'
import { FireTSL, FireTSLProps as FireTSLMeshProps } from './FireTSL'
import { Color, TextureLoader, Texture } from 'three'

extend({ FireTSL })

declare module '@react-three/fiber' {
  interface ThreeElements {
    fireTSL: ReactThreeFiber.Object3DNode<FireTSL, typeof FireTSL>
  }
}

/**
 * Props for the Fire TSL React component
 */
export interface FireProps extends Omit<FireTSLMeshProps, 'fireTex'> {
  /** Fire texture URL or Three.js Texture object */
  texture: string | Texture
  /** Auto-update time from useFrame (default: true) */
  autoUpdate?: boolean
  /** Custom update function called each frame */
  onUpdate?: (fire: FireTSL, time: number) => void
  /** Child components */
  children?: React.ReactNode
  /** Position in 3D space */
  position?: [number, number, number]
  /** Rotation in radians */
  rotation?: [number, number, number]
  /** Scale factor (uniform or per-axis) */
  scale?: [number, number, number] | number
}

export interface FireRef {
  fire: FireTSL | null
  update: (time?: number) => void
}

/**
 * React Three Fiber component for volumetric fire effect (TSL/WebGPU version)
 *
 * Creates a procedural fire effect using TSL (Three.js Shading Language)
 * for WebGPU compatibility. Uses Perlin noise instead of simplex noise.
 *
 * Note: This component requires WebGPURenderer or a compatible WebGL fallback.
 *
 * @example
 * ```tsx
 * import { Fire } from '@wolffo/three-fire/tsl/react'
 *
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
    const fireRef = useRef<FireTSL>(null)

    const isTextureUrl = typeof texture === 'string'
    const loadedTexture = isTextureUrl ? useLoader(TextureLoader, texture) : null
    const finalTexture = isTextureUrl ? loadedTexture! : texture

    const fireProps = useMemo(
      () => ({
        fireTex: finalTexture,
        color: color instanceof Color ? color : new Color(color),
        iterations,
        noiseScale,
        magnitude,
        lacunarity,
        gain,
      }),
      [finalTexture, color, iterations, noiseScale, magnitude, lacunarity, gain]
    )

    useFrame((state) => {
      if (fireRef.current && autoUpdate) {
        const time = state.clock.getElapsedTime()
        fireRef.current.update(time)
        onUpdate?.(fireRef.current, time)
      }
    })

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
      <fireTSL ref={fireRef} args={[fireProps]} {...props}>
        {children}
      </fireTSL>
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
    ref,
    fire: ref.current?.fire || null,
    update: (time?: number) => ref.current?.update(time),
  }
}
