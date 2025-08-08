import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import { extend, useFrame, ReactThreeFiber, useLoader } from '@react-three/fiber'
import { NodeFire as NodeFireMesh, NodeFireProps as NodeFireMeshProps } from './NodeFire'
import { Color, TextureLoader, Texture } from 'three'

/**
 * Helper hook for texture loading (alternative to @react-three/drei)
 */
const useTexture = (url: string): Texture => useLoader(TextureLoader, url)

// Extend R3F with our NodeFire class
extend({ NodeFire: NodeFireMesh })

declare module '@react-three/fiber' {
  interface ThreeElements {
    nodeFire: ReactThreeFiber.Object3DNode<NodeFireMesh, typeof NodeFireMesh>
  }
}

/**
 * Props for the NodeFire React component
 */
export interface NodeFireProps extends Omit<NodeFireMeshProps, 'fireTex'> {
  /** Fire texture URL or Three.js Texture object */
  texture: string | Texture
  /** Auto-update time from useFrame (default: true) */
  autoUpdate?: boolean
  /** Custom update function called each frame */
  onUpdate?: (fire: NodeFireMesh, time: number) => void
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
 * Ref interface for imperative NodeFire control
 */
export interface NodeFireRef {
  /** NodeFire mesh instance */
  fire: NodeFireMesh | null
  /** Update fire animation manually */
  update: (time?: number) => void
}

/**
 * React Three Fiber component for node-based volumetric fire effect
 *
 * Creates a procedural fire effect using node-based shaders that provide
 * better organization and potential performance benefits over traditional
 * GLSL string-based shaders.
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <NodeFire
 *     texture="/fire.png"
 *     color="orange"
 *     magnitude={1.5}
 *     scale={[2, 3, 2]}
 *     position={[0, 0, 0]}
 *   />
 * </Canvas>
 * ```
 */
export const NodeFireComponent = forwardRef<NodeFireRef, NodeFireProps>(
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
    const fireRef = useRef<NodeFireMesh>(null)

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
      <nodeFire ref={fireRef} args={[fireProps]} {...props}>
        {children}
      </nodeFire>
    )
  }
)

NodeFireComponent.displayName = 'NodeFire'

/**
 * Hook for easier access to NodeFire instance and controls
 *
 * Provides a ref and helper methods for controlling the node-based fire imperatively.
 *
 * @returns Object with ref, fire instance, and update method
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const fireRef = useNodeFire()
 *
 *   const handleClick = () => {
 *     if (fireRef.fire) {
 *       fireRef.fire.magnitude = 2.0
 *     }
 *   }
 *
 *   return (
 *     <NodeFireComponent ref={fireRef.ref} texture="/fire.png" />
 *   )
 * }
 * ```
 */
export const useNodeFire = () => {
  const ref = useRef<NodeFireRef>(null)
  return {
    /** Ref to pass to NodeFire component */
    ref,
    /** NodeFire mesh instance (null until mounted) */
    fire: ref.current?.fire || null,
    /** Update fire animation manually */
    update: (time?: number) => ref.current?.update(time),
  }
}