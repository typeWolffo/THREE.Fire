/**
 * @fileoverview Vanilla Three.js + TSL entry point - includes both standard and node-based shaders
 * 
 * This entry point provides both standard GLSL and TSL/node-based fire implementations
 * for vanilla Three.js projects. Zero React dependencies.
 * 
 * @example
 * ```ts
 * import { FireMesh, NodeFireMesh } from '@wolffo/three-fire/vanilla-tsl'
 * 
 * // Standard GLSL fire
 * const standardFire = new FireMesh({ fireTex: texture })
 * 
 * // Modern TSL fire
 * const tslFire = new NodeFireMesh({ fireTex: texture })
 * ```
 */

// Export standard vanilla Three.js classes
export { Fire as FireMesh, type FireProps as FireMeshProps } from './Fire'
export { FireShader, type FireShaderUniforms } from './FireShader'

// Export TSL/node-based classes
export { NodeFire as NodeFireMesh, type NodeFireProps as NodeFireMeshProps } from './NodeFire'
export { NodeFireShader, type NodeFireShaderUniforms } from './NodeFireShader'