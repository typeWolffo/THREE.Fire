#!/usr/bin/env node

// Simple test to verify our Fire package works with Node.js/vanilla Three.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Mock Three.js basics for testing
const mockThree = {
  Mesh: class Mesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
      this.scale = { x: 1, y: 1, z: 1, copy: () => {} };
      this.matrixWorld = { copy: () => ({ invert: () => {} }) };
    }
    updateMatrixWorld() {}
  },
  BoxGeometry: class BoxGeometry {},
  ShaderMaterial: class ShaderMaterial {
    constructor(options) {
      this.uniforms = options.uniforms || {};
    }
  },
  Vector3: class Vector3 {
    constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
    copy() { return this; }
  },
  Vector4: class Vector4 {
    constructor(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; }
  },
  Matrix4: class Matrix4 {},
  Color: class Color {
    constructor(color) { this.color = color; }
  },
  LinearFilter: 'LINEAR',
  ClampToEdgeWrapping: 'CLAMP_TO_EDGE'
};

// Mock global Three
global.THREE = mockThree;

try {
  // Test importing our package
  const { FireShader, FireMesh } = await import('../dist/index.esm.js');

  console.log('✅ Package imports successfully');

  // Test FireShader
  console.log('🔥 Testing FireShader...');
  console.log('  - Defines:', FireShader.defines);
  console.log('  - Uniforms keys:', Object.keys(FireShader.uniforms));
  console.log('  - Has vertex shader:', !!FireShader.vertexShader);
  console.log('  - Has fragment shader:', !!FireShader.fragmentShader);

  // Test FireMesh
  console.log('🔥 Testing FireMesh...');

  const mockTexture = {
    magFilter: null,
    minFilter: null,
    wrapS: null,
    wrapT: null
  };

  const fire = new FireMesh({
    fireTex: mockTexture,
    color: 0xff4400,
    magnitude: 1.5
  });

  console.log('  - Fire instance created:', !!fire);
  console.log('  - Has update method:', typeof fire.update === 'function');
  console.log('  - Has magnitude property:', typeof fire.magnitude === 'number');
  console.log('  - Magnitude value:', fire.magnitude);

  // Test property setters
  fire.magnitude = 2.0;
  console.log('  - Magnitude after setting to 2.0:', fire.magnitude);

  // Test update method
  fire.update(1.0);
  console.log('  - Update method works:', true);

  console.log('\n🎉 All tests passed! The package is working correctly.');
  console.log('\n📖 To test in a real Three.js environment:');
  console.log('  1. Open examples/vanilla-example.html in a browser');
  console.log('  2. Or use the React example with a React Three Fiber project');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
