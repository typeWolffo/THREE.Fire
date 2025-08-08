import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = [
  'three', 
  'react', 
  'react/jsx-runtime',
  '@react-three/fiber',
  'three/tsl',
  'three/src/materials/nodes/NodeMaterial.js',
  'three/examples/jsm/tsl/utils/Raymarching.js'
];

// Helper function to create build config for an entry point
const createBuildConfig = (input, outputName) => ({
  input,
  external,
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/${outputName}.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
    }),
  ],
});

// Helper function to create type definition config
const createDtsConfig = (input, outputName) => ({
  input: `dist/types/${input}.d.ts`,
  output: {
    file: `dist/${outputName}.d.ts`,
    format: 'esm',
  },
  external,
  plugins: [dts()],
});

export default [
  // Main entry point (legacy - includes everything)
  createBuildConfig('src/index.ts', 'index'),
  
  // Standard shader entry points (no TSL dependencies)
  createBuildConfig('src/vanilla.ts', 'vanilla'),
  createBuildConfig('src/react.ts', 'react'),
  
  // TSL-specific entry points
  createBuildConfig('src/tsl.ts', 'tsl'),
  createBuildConfig('src/vanilla-tsl.ts', 'vanilla-tsl'),
  createBuildConfig('src/react-tsl.ts', 'react-tsl'),
  
  // Type definitions for all entry points
  createDtsConfig('index', 'index'),
  createDtsConfig('vanilla', 'vanilla'),
  createDtsConfig('react', 'react'),
  createDtsConfig('tsl', 'tsl'),
  createDtsConfig('vanilla-tsl', 'vanilla-tsl'),
  createDtsConfig('react-tsl', 'react-tsl'),
];
