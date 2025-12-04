/**
 * @fileoverview TSL React Three Fiber entry point - includes React dependencies
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * This entry point provides React Three Fiber components and hooks.
 * Use this when building React applications with Three.js and WebGPU.
 *
 * Note: Requires WebGPURenderer setup in your R3F Canvas for full WebGPU support.
 *
 * @example
 * ```tsx
 * import { Fire, useFire } from '@wolffo/three-fire/tsl/react'
 *
 * function App() {
 *   return (
 *     <Canvas>
 *       <Fire texture="/fire.png" color="orange" />
 *     </Canvas>
 *   )
 * }
 * ```
 */

// Export React Three Fiber components and hooks only
export { FireComponent as Fire, useFire, type FireRef, type FireProps } from './FireComponentTSL'
