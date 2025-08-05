/**
 * @fileoverview Modern TypeScript volumetric fire effect for Three.js and React Three Fiber
 *
 * This package provides both vanilla Three.js classes and React Three Fiber components
 * for creating realistic volumetric fire effects using ray marching shaders.
 *
 * ## Preferred Entry Points
 * 
 * For better tree-shaking and to avoid unnecessary dependencies, use specific entry points:
 * 
 * - `@wolffo/three-fire/vanilla` - Pure Three.js (no React deps)
 * - `@wolffo/three-fire/react` - React Three Fiber components only
 * 
 * @example Vanilla Three.js (Recommended)
 * ```ts
 * import { FireMesh } from '@wolffo/three-fire/vanilla'
 *
 * const fire = new FireMesh({ fireTex: texture })
 * scene.add(fire)
 * fire.update(time)
 * ```
 *
 * @example React Three Fiber (Recommended)
 * ```tsx
 * import { Fire } from '@wolffo/three-fire/react'
 *
 * <Canvas>
 *   <Fire texture="/fire.png" color="orange" />
 * </Canvas>
 * ```
 * 
 * @example Legacy Import (All exports - backward compatibility)
 * ```ts
 * import { FireMesh, Fire } from '@wolffo/three-fire'
 * ```
 */

// Vanilla Three.js exports
/** Fire mesh class for vanilla Three.js usage */
export { Fire as FireMesh, type FireProps as FireMeshProps } from './Fire'
/** Fire shader definition and uniforms */
export { FireShader, type FireShaderUniforms } from './FireShader'

// React Three Fiber exports
/** React component for fire effect */
export { FireComponent, useFire, type FireRef, type FireProps } from './FireComponent'

// Default export (React component)
/** Default Fire component for React Three Fiber */
export { FireComponent as Fire } from './FireComponent'
