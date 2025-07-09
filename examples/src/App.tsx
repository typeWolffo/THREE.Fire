// @ts-expect-error - React is not used in this file
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Fire, useFire } from '@wolffo/three-fire'

function FireScene() {
  const [magnitude, setMagnitude] = useState(1.3)
  const [lacunarity, setLacunarity] = useState(2.0)
  const [gain, setGain] = useState(0.5)
  const [colorHue, setColorHue] = useState(0.1)

  const fireRef = useFire()

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

      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #000428 0%, #000000 100%)' }}
      >
        <Fire
          ref={fireRef.ref}
          texture="./Fire.png"
          magnitude={magnitude}
          lacunarity={lacunarity}
          gain={gain}
          color={`hsl(${colorHue * 360}, 100%, 60%)`}
          scale={[2, 3, 2]}
          position={[0, 0, 0]}
          onUpdate={(fire, time) => {
            // Custom animation - slight breathing effect
            const breathe = 1 + Math.sin(time * 0.5) * 0.1
            fire.scale.setScalar(breathe)
          }}
        />

        <OrbitControls
          target={[0, 1, 0]}
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />

        {/* Add some ambient lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff4400" />
      </Canvas>
    </>
  )
}

export default function App() {
  return <FireScene />
}
