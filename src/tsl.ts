/**
 * @fileoverview TSL (Three.js Shading Language) entry point - node-based shaders only
 * 
 * This entry point provides only the TSL/node-based fire implementations.
 * Use this when you specifically want the modern node-based shader architecture.
 * 
 * @example
 * ```ts
 * import { NodeFireMesh, NodeFireShader } from '@wolffo/three-fire/tsl'
 * 
 * const fire = new NodeFireMesh({ fireTex: texture })
 * scene.add(fire)
 * fire.update(time)
 * ```
 */

// Export TSL/node-based classes only
export { NodeFire as NodeFireMesh, type NodeFireProps as NodeFireMeshProps } from './NodeFire'
export { NodeFireShader, type NodeFireShaderUniforms } from './NodeFireShader'