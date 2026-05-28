/**
 * @fileoverview React Three Fiber component for TSL Fire effect
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * Provides the same API as the GLSL FireComponent but with TSL backend.
 */

import type React from 'react'
import { useRef, useMemo, forwardRef } from 'react'
import { extend, useLoader } from '@react-three/fiber'
import { FireTSL, type FireTSLProps as FireTSLMeshProps } from './FireTSL'
import { Color, TextureLoader, type Texture } from 'three'
import { useFireBindings } from '../internal/useFireBindings'

declare module '@react-three/fiber' {
  interface ThreeElements {
    fireTSL: Omit<ThreeElements['mesh'], 'args'> & { args?: [FireTSLMeshProps] }
  }
}

let extended = false
function ensureExtended() {
  if (!extended) {
    extend({ FireTSL })
    extended = true
  }
}

const DEFAULT_NOISE_SCALE: [number, number, number, number] = [1, 2, 1, 0.3]

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

type LeafProps = {
  meshProps: Omit<FireTSLMeshProps, 'fireTex'>
  fireRef: React.Ref<FireTSL>
  forwarded: Record<string, unknown>
  children?: React.ReactNode
}

function FireFromUrl({
  url,
  meshProps,
  fireRef,
  forwarded,
  children,
}: LeafProps & { url: string }) {
  const texture = useLoader(TextureLoader, url)
  const args = useMemo<[FireTSLMeshProps]>(
    () => [{ ...meshProps, fireTex: texture }],
    [meshProps, texture],
  )
  return (
    <fireTSL ref={fireRef} args={args} {...forwarded}>
      {children}
    </fireTSL>
  )
}

function FireFromTexture({
  texture,
  meshProps,
  fireRef,
  forwarded,
  children,
}: LeafProps & { texture: Texture }) {
  const args = useMemo<[FireTSLMeshProps]>(
    () => [{ ...meshProps, fireTex: texture }],
    [meshProps, texture],
  )
  return (
    <fireTSL ref={fireRef} args={args} {...forwarded}>
      {children}
    </fireTSL>
  )
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
 *
 * @remarks
 * The underlying mesh disposes its geometry and material automatically when the
 * component unmounts (R3F calls `dispose()`). The texture you pass in is **not**
 * disposed — you own its lifecycle.
 */
export const FireComponent = forwardRef<FireRef, FireProps>(
  (
    {
      texture,
      color = 0xeeeeee,
      iterations = 20,
      octaves = 3,
      noiseScale = DEFAULT_NOISE_SCALE,
      magnitude = 1.3,
      lacunarity = 2.0,
      gain = 0.5,
      autoUpdate = true,
      onUpdate,
      children,
      ...props
    },
    ref,
  ) => {
    ensureExtended()
    const fireRef = useRef<FireTSL>(null)

    const meshProps = useMemo(
      () => ({
        color: color instanceof Color ? color : new Color(color),
        iterations,
        octaves,
        noiseScale,
        magnitude,
        lacunarity,
        gain,
      }),
      [color, iterations, octaves, noiseScale, magnitude, lacunarity, gain],
    )

    useFireBindings(ref, fireRef, autoUpdate, onUpdate)

    return typeof texture === 'string' ? (
      <FireFromUrl url={texture} meshProps={meshProps} fireRef={fireRef} forwarded={props}>
        {children}
      </FireFromUrl>
    ) : (
      <FireFromTexture texture={texture} meshProps={meshProps} fireRef={fireRef} forwarded={props}>
        {children}
      </FireFromTexture>
    )
  },
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
    /** Fire mesh instance (null until mounted) — read fresh on every access */
    get fire() {
      return ref.current?.fire ?? null
    },
    /** Update fire animation manually */
    update: (time?: number) => ref.current?.update(time),
  }
}
