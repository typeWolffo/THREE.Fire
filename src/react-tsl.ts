/**
 * @fileoverview React Three Fiber + TSL entry point - includes both standard and node-based components
 * 
 * This entry point provides both standard GLSL and TSL/node-based fire components
 * for React Three Fiber applications.
 * 
 * @example React usage with both standard and TSL components
 * ```typescript
 * import { Fire, NodeFire } from '@wolffo/three-fire/react-tsl'
 * 
 * // Standard GLSL fire component
 * <Fire texture="/fire.png" color="orange" />
 * 
 * // Modern TSL fire component  
 * <NodeFire texture="/fire.png" color="blue" />
 * ```
 */

// Export standard React Three Fiber components
export { FireComponent as Fire, useFire, type FireRef, type FireProps } from './FireComponent'

// Export TSL/node-based React Three Fiber components
export { 
  NodeFireComponent as NodeFire, 
  useNodeFire, 
  type NodeFireRef, 
  type NodeFireProps as NodeFireComponentProps 
} from './NodeFireComponent'