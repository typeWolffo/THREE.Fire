/**
 * @fileoverview TSL Vanilla Three.js entry point - zero React dependencies
 *
 * WebGPU-compatible version using Three.js Shading Language (TSL).
 * This entry point provides only the core Three.js classes without any React
 * dependencies. Use this for vanilla Three.js projects with WebGPU support.
 *
 * @example
 * ```ts
 * import { FireMesh, FireShader } from '@wolffo/three-fire/tsl/vanilla'
 *
 * const fire = new FireMesh({ fireTex: texture })
 * scene.add(fire)
 * fire.update(time)
 * ```
 */

// Export vanilla Three.js classes only
export { FireTSL as FireMesh, type FireTSLProps as FireMeshProps } from './FireTSL'
export {
  createFireUniforms,
  createFireFragmentNode,
  type FireTSLConfig,
  type FireTSLUniforms,
} from './FireShaderTSL'
