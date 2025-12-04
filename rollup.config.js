import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = ['three', 'three/tsl', 'three/webgpu', 'react', 'react/jsx-runtime', '@react-three/fiber'];

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

  // Vanilla entry point (Three.js only)
  createBuildConfig('src/vanilla.ts', 'vanilla'),

  // React entry point (React Three Fiber only)
  createBuildConfig('src/react.ts', 'react'),

  // TSL entry points (WebGPU compatible)
  createBuildConfig('src/tsl/index.ts', 'tsl/index'),
  createBuildConfig('src/tsl/vanilla.ts', 'tsl/vanilla'),
  createBuildConfig('src/tsl/react.ts', 'tsl/react'),

  // Type definitions for all entry points
  createDtsConfig('index', 'index'),
  createDtsConfig('vanilla', 'vanilla'),
  createDtsConfig('react', 'react'),
  createDtsConfig('tsl/index', 'tsl/index'),
  createDtsConfig('tsl/vanilla', 'tsl/vanilla'),
  createDtsConfig('tsl/react', 'tsl/react'),
];
