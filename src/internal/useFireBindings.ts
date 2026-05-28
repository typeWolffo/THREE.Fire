import { useImperativeHandle } from 'react'
import type { Ref, RefObject } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Imperative handle exposed by the Fire React components.
 */
export interface FireHandle<TFire> {
  /** The underlying fire mesh instance (null until mounted) */
  fire: TFire | null
  /** Update the fire animation manually */
  update: (time?: number) => void
}

/**
 * Shared per-frame update + imperative handle wiring for the GLSL and TSL Fire
 * components. Keeps the two components in lockstep so fixes land once.
 *
 * @param ref - Forwarded ref to expose the imperative handle on
 * @param fireRef - Internal ref attached to the underlying mesh
 * @param autoUpdate - Whether to advance the animation each frame
 * @param onUpdate - Optional per-frame callback
 */
export function useFireBindings<TFire extends { update: (time?: number) => void }>(
  ref: Ref<FireHandle<TFire>>,
  fireRef: RefObject<TFire | null>,
  autoUpdate: boolean,
  onUpdate?: (fire: TFire, time: number) => void,
): void {
  useFrame((state) => {
    if (fireRef.current && autoUpdate) {
      const time = state.clock.getElapsedTime()
      fireRef.current.update(time)
      onUpdate?.(fireRef.current, time)
    }
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: fireRef is a stable ref; its .current must not be a dependency
  useImperativeHandle(
    ref,
    () => ({
      get fire() {
        return fireRef.current
      },
      update: (time?: number) => {
        fireRef.current?.update(time)
      },
    }),
    [],
  )
}
