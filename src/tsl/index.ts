/**
 * @fileoverview TSL (Three.js Shading Language) volumetric fire effect
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * This package provides both vanilla Three.js classes and React Three Fiber components
 * for creating realistic volumetric fire effects using TSL ray marching shaders.
 *
 * Key differences from the GLSL version:
 * - Uses Perlin noise (mx_noise_float) instead of simplex noise
 * - WebGPU compatible with WebGL fallback
 * - Requires Three.js >= 0.168.0
 *
 * ## Preferred Entry Points
 *
 * For better tree-shaking and to avoid unnecessary dependencies, use specific entry points:
 *
 * - `@wolffo/three-fire/tsl/vanilla` - Pure Three.js (no React deps)
 * - `@wolffo/three-fire/tsl/react` - React Three Fiber components only
 *
 * @example Vanilla Three.js (Recommended)
 * ```ts
 * import { FireMesh } from '@wolffo/three-fire/tsl/vanilla'
 *
 * const fire = new FireMesh({ fireTex: texture })
 * scene.add(fire)
 * fire.update(time)
 * ```
 *
 * @example React Three Fiber (Recommended)
 * ```tsx
 * import { Fire } from '@wolffo/three-fire/tsl/react'
 *
 * <Canvas>
 *   <Fire texture="/fire.png" color="orange" />
 * </Canvas>
 * ```
 *
 * @example Legacy Import (All exports - backward compatibility)
 * ```ts
 * import { FireMesh, Fire } from '@wolffo/three-fire/tsl'
 * ```
 */

// Vanilla Three.js exports
/** Fire mesh class for vanilla Three.js usage (TSL version) */
export { FireTSL as FireMesh, type FireTSLProps as FireMeshProps } from './FireTSL'
/** Fire shader definition and uniforms (TSL version) */
export {
  createFireUniforms,
  createFireFragmentNode,
  type FireTSLConfig,
  type FireTSLUniforms,
} from './FireShaderTSL'

// React Three Fiber exports
/** React component for fire effect (TSL version) */
export { FireComponent, useFire, type FireRef, type FireProps } from './FireComponentTSL'

// Default export (React component)
/** Default Fire component for React Three Fiber (TSL version) */
export { FireComponent as Fire } from './FireComponentTSL'
