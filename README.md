# Three fire

[![CI](https://github.com/username/threeFire/workflows/CI/badge.svg)](https://github.com/username/threeFire/actions)
[![npm version](https://badge.fury.io/js/@wolffo%2Fthree-fire.svg)](https://badge.fury.io/js/@wolffo%2Fthree-fire)

Modern TypeScript volumetric fire effect for Three.js and React Three Fiber.

![fire](https://raw.githubusercontent.com/mattatz/THREE.Fire/master/Captures/fire.gif)

## Features

- 🔥 Volumetric fire effect using ray marching
- 📦 TypeScript support with full type definitions
- ⚛️ React Three Fiber component
- 🎛️ Configurable parameters (iterations, octaves, noise scale, etc.)
- 🚀 Modern Three.js compatibility (r150+)
- 📱 Optimized for performance

## Installation

```bash
npm install @wolffo/three-fire
```

## Usage

### React Three Fiber (Recommended)

```tsx
import { Canvas } from '@react-three/fiber'
import { Fire } from '@wolffo/three-fire'

function App() {
  return (
    <Canvas>
      <Fire
        texture="/fire-texture.png"
        color={0xff4400}
        scale={[2, 3, 2]}
        position={[0, 0, 0]}
      />
    </Canvas>
  )
}
```

### With custom parameters

```tsx
import { Fire, useFire } from '@wolffo/three-fire'

function CustomFire() {
  const fireRef = useFire()

  return (
    <Fire
      ref={fireRef.ref}
      texture="/fire-texture.png"
      color={0xff6600}
      magnitude={1.5}
      lacunarity={2.5}
      gain={0.7}
      iterations={25}
      octaves={4}
      onUpdate={(fire, time) => {
        // Custom update logic
        fire.fireColor.setHSL((time * 0.1) % 1, 1, 0.5)
      }}
    />
  )
}
```

### Vanilla Three.js

```ts
import { FireMesh } from '@wolffo/three-fire'
import { Scene, TextureLoader } from 'three'

const scene = new Scene()
const textureLoader = new TextureLoader()

// Load fire texture
const fireTexture = textureLoader.load('/fire-texture.png')

// Create fire effect
const fire = new FireMesh({
  fireTex: fireTexture,
  color: 0xff4400,
  magnitude: 1.3,
  iterations: 20,
  octaves: 3
})

scene.add(fire)

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  fire.update(performance.now() / 1000)
  renderer.render(scene, camera)
}
animate()
```

## API Reference

### FireComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `texture` | `string \| Texture` | - | Fire texture URL or Three.js Texture object |
| `color` | `Color \| string \| number` | `0xeeeeee` | Fire color |
| `iterations` | `number` | `20` | Ray marching iterations (higher = better quality, lower performance) |
| `octaves` | `number` | `3` | Noise octaves for turbulence |
| `noiseScale` | `[number, number, number, number]` | `[1, 2, 1, 0.3]` | Noise scaling factors |
| `magnitude` | `number` | `1.3` | Fire shape intensity |
| `lacunarity` | `number` | `2.0` | Noise lacunarity |
| `gain` | `number` | `0.5` | Noise gain |
| `autoUpdate` | `boolean` | `true` | Auto-update time from useFrame |
| `onUpdate` | `(fire, time) => void` | - | Custom update callback |

### FireMesh Class

```ts
class FireMesh extends Mesh {
  constructor(props: FireMeshProps)

  // Methods
  update(time?: number): void

  // Properties
  time: number
  fireColor: Color
  magnitude: number
  lacunarity: number
  gain: number
}
```

## Fire Texture

You need to provide a fire texture similar to the one shown below:

![firetex](./src/Fire.png "Fire texture")

The texture should be a grayscale gradient that defines the fire's density distribution.

## Performance Tips

- Lower `iterations` for better performance (try 10-15 for mobile)
- Reduce `octaves` to 2 for simpler noise
- Use texture compression for the fire texture
- Consider using LOD (Level of Detail) for distant fires

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Type checking
npm run typecheck

# Run tests
npm test
```

## Publishing

This package uses automated GitHub Actions for publishing. See [PUBLISHING.md](./PUBLISHING.md) for detailed instructions.

Quick release commands:
```bash
npm run release:patch  # 1.0.0 → 1.0.1
npm run release:minor  # 1.0.0 → 1.1.0
npm run release:major  # 1.0.0 → 2.0.0
```

## Credits

Based on the original THREE.Fire by [mattatz](https://github.com/mattatz/THREE.Fire)

- Real-Time procedural volumetric fire - http://dl.acm.org/citation.cfm?id=1230131
- webgl-noise - https://github.com/ashima/webgl-noise
- Three.js - https://threejs.org/

## License

MIT
