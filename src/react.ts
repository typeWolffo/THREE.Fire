/**
 * @fileoverview React Three Fiber entry point - includes React dependencies
 * 
 * This entry point provides React Three Fiber components and hooks.
 * Use this when building React applications with Three.js.
 * 
 * @example
 * ```tsx
 * import { Fire, useFire } from '@wolffo/three-fire/react'
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

// Export React Three Fiber components and hooks only (standard GLSL shaders)
export { FireComponent as Fire, useFire, type FireRef, type FireProps } from './FireComponent'