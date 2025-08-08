/**
 * @fileoverview Vanilla Three.js entry point - zero React dependencies
 * 
 * This entry point provides only the core Three.js classes without any React
 * dependencies. Use this for vanilla Three.js projects to avoid bundling React.
 * 
 * @example
 * ```ts
 * import { FireMesh, FireShader } from '@wolffo/three-fire/vanilla'
 * 
 * const fire = new FireMesh({ fireTex: texture })
 * scene.add(fire)
 * fire.update(time)
 * ```
 */

// Export vanilla Three.js classes only (standard GLSL shaders)
export { Fire as FireMesh, type FireProps as FireMeshProps } from './Fire'
export { FireShader, type FireShaderUniforms } from './FireShader'