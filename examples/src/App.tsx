import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { Fire as FireGLSL, useFire as useFireGLSL } from '@wolffo/three-fire'
import { Fire as FireTSL, useFire as useFireTSL } from '@wolffo/three-fire/tsl/react'
import { FireSceneTSLVanilla } from './AppTSLVanilla'
import { WebGPURenderer } from 'three/webgpu'

type ShaderType = 'glsl' | 'tsl-vanilla' | 'tsl-r3f'

interface FireSceneProps {
  magnitude: number
  lacunarity: number
  gain: number
  colorHue: number
}

function FireSceneGLSL({ magnitude, lacunarity, gain, colorHue }: FireSceneProps) {
  const fireRef = useFireGLSL()

  return (
    <FireGLSL
      ref={fireRef.ref}
      texture="/Fire.png"
      magnitude={magnitude}
      lacunarity={lacunarity}
      gain={gain}
      color={`hsl(${colorHue * 360}, 100%, 60%)`}
      scale={[2, 3, 2]}
      position={[0, 0, 0]}
      onUpdate={(fire, time) => {
        const breathe = 1 + Math.sin(time * 0.5) * 0.1
        fire.scale.setScalar(breathe)
      }}
    />
  )
}

function FireSceneTSLR3F({ magnitude, lacunarity, gain, colorHue }: FireSceneProps) {
  const fireRef = useFireTSL()

  return (
    <FireTSL
      ref={fireRef.ref}
      texture="/Fire.png?mode=r3f"
      magnitude={magnitude}
      lacunarity={lacunarity}
      gain={gain}
      color={`hsl(${colorHue * 360}, 100%, 60%)`}
      scale={[2, 3, 2]}
      position={[0, 0, 0]}
      onUpdate={(fire, time) => {
        const breathe = 1 + Math.sin(time * 0.5) * 0.1
        fire.scale.setScalar(breathe)
      }}
    />
  )
}

function FireScene() {
  const [shaderType, setShaderType] = useState<ShaderType>('glsl')
  const [magnitude, setMagnitude] = useState(1.3)
  const [lacunarity, setLacunarity] = useState(2.0)
  const [gain, setGain] = useState(0.5)
  const [colorHue, setColorHue] = useState(0.1)

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 8,
        fontSize: 14,
        zIndex: 100,
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🔥 Fire Controls</h3>

        <div style={{ marginBottom: 15, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <strong>Shader:</strong>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShaderType('glsl')}
              style={{
                padding: '8px 12px',
                background: shaderType === 'glsl' ? '#ff4400' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                cursor: 'pointer',
                fontWeight: shaderType === 'glsl' ? 'bold' : 'normal',
                fontSize: 12
              }}
            >
              GLSL
            </button>
            <button
              onClick={() => setShaderType('tsl-vanilla')}
              style={{
                padding: '8px 12px',
                background: shaderType === 'tsl-vanilla' ? '#4488ff' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 4,
                color: 'white',
                cursor: 'pointer',
                fontWeight: shaderType === 'tsl-vanilla' ? 'bold' : 'normal',
                fontSize: 12
              }}
            >
              TSL Vanilla
            </button>
            <button
              onClick={() => setShaderType('tsl-r3f')}
              style={{
                padding: '8px 12px',
                background: shaderType === 'tsl-r3f' ? '#44ff88' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: 4,
                color: shaderType === 'tsl-r3f' ? 'black' : 'white',
                cursor: 'pointer',
                fontWeight: shaderType === 'tsl-r3f' ? 'bold' : 'normal',
                fontSize: 12
              }}
            >
              TSL R3F
            </button>
          </div>
          <div style={{ marginTop: 5, fontSize: 11, opacity: 0.7 }}>
            {shaderType === 'glsl' && 'WebGL + GLSL shader'}
            {shaderType === 'tsl-vanilla' && 'WebGPU + TSL (vanilla Three.js)'}
            {shaderType === 'tsl-r3f' && 'WebGPU + TSL (React Three Fiber)'}
          </div>
        </div>

        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Magnitude: <strong>{magnitude.toFixed(1)}</strong>
          <br />
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={magnitude}
            onChange={(e) => setMagnitude(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Lacunarity: <strong>{lacunarity.toFixed(1)}</strong>
          <br />
          <input
            type="range"
            min="1"
            max="4"
            step="0.1"
            value={lacunarity}
            onChange={(e) => setLacunarity(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Gain: <strong>{gain.toFixed(1)}</strong>
          <br />
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={gain}
            onChange={(e) => setGain(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Color Hue: <strong>{Math.round(colorHue * 360)}°</strong>
          <br />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={colorHue}
            onChange={(e) => setColorHue(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        <div style={{ marginTop: 15, fontSize: 12, opacity: 0.8 }}>
          🖱️ Drag to rotate • 🖱️ Scroll to zoom
        </div>
      </div>

      {shaderType === 'glsl' && (
        <Canvas
          key="glsl"
          camera={{ position: [0, 2, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #000428 0%, #000000 100%)' }}
        >
          <Suspense fallback={null}>
            <FireSceneGLSL
              magnitude={magnitude}
              lacunarity={lacunarity}
              gain={gain}
              colorHue={colorHue}
            />
          </Suspense>

          <OrbitControls
            target={[0, 1, 0]}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
          />

          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff4400" />
          <Stats />
        </Canvas>
      )}

      {shaderType === 'tsl-vanilla' && (
        <FireSceneTSLVanilla
          magnitude={magnitude}
          lacunarity={lacunarity}
          gain={gain}
          colorHue={colorHue}
        />
      )}

      {shaderType === 'tsl-r3f' && (
        <Canvas
          key="tsl-r3f"
          camera={{ position: [0, 2, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #000428 0%, #000000 100%)' }}
          gl={(canvas) => {
            const renderer = new WebGPURenderer({ canvas: canvas as HTMLCanvasElement, antialias: true })
            renderer.init()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return renderer
          }}
        >
          <Suspense fallback={null}>
            <FireSceneTSLR3F
              magnitude={magnitude}
              lacunarity={lacunarity}
              gain={gain}
              colorHue={colorHue}
            />
          </Suspense>

          <OrbitControls
            target={[0, 1, 0]}
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
          />

          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff4400" />
          <Stats />
        </Canvas>
      )}
    </>
  )
}

export default function App() {
  return <FireScene />
}
