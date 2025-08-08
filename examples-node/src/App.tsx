import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Fire, useFire, NodeFire, useNodeFire } from '@wolffo/three-fire/react-tsl'

function NodeFireScene() {
  const [magnitude, setMagnitude] = useState(1.3)
  const [lacunarity, setLacunarity] = useState(2.0)
  const [gain, setGain] = useState(0.5)
  const [colorHue, setColorHue] = useState(0.1)
  const [iterations, setIterations] = useState(20)
  const [octaves, setOctaves] = useState(3)

  const fireRef = useFire()

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        background: 'rgba(0,0,0,0.8)',
        padding: 20,
        borderRadius: 8,
        fontSize: 14,
        zIndex: 100,
        fontFamily: 'Arial, sans-serif',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>🔥 Fire Controls</h3>
        <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,0,0.1)', borderRadius: '4px' }}>
          <strong>🔥 GLSL Fire Implementation</strong>
          <br />
          <small style={{ opacity: 0.8 }}>
            Currently using traditional GLSL shaders. TSL (Three.js Shading Language) NodeFire is implemented and ready - working on Vite development server compatibility for TSL imports.
          </small>
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

        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
        
        <div style={{ marginBottom: '10px' }}>
          <small style={{ opacity: 0.7 }}>Quality Settings (require reload):</small>
        </div>
        
        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Iterations: <strong>{iterations}</strong>
          <br />
          <input
            type="range"
            min="10"
            max="40"
            step="1"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        
        <label style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
          Octaves: <strong>{octaves}</strong>
          <br />
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={octaves}
            onChange={(e) => setOctaves(parseInt(e.target.value))}
            style={{ width: '100%', marginTop: 5 }}
          />
        </label>
        
        <div style={{ marginTop: 15, fontSize: 12, opacity: 0.8 }}>
          🖱️ Drag to rotate • 🖱️ Scroll to zoom
          <br />
          <span style={{ color: '#ffa500' }}>⚡ TSL implementation ready</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{ 
          background: 'linear-gradient(to bottom, #001122 0%, #000000 100%)',
          height: '100vh',
          width: '100vw'
        }}
      >
        <Fire
          ref={fireRef.ref}
          texture="/Fire.png"
          magnitude={magnitude}
          lacunarity={lacunarity}
          gain={gain}
          iterations={iterations}
          octaves={octaves}
          color={`hsl(${colorHue * 360}, 100%, 60%)`}
          scale={[2, 3, 2]}
          position={[0, 0, 0]}
          onUpdate={(fire, time) => {
            // Custom animation - slight breathing effect with node-based timing
            const breathe = 1 + Math.sin(time * 0.5) * 0.1
            fire.scale.setScalar(breathe)
            
            // Add slight rotation to showcase node-based features
            fire.rotation.y = time * 0.05
          }}
        />

        <OrbitControls
          target={[0, 1, 0]}
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
        />

        {/* Enhanced lighting for node-based visualization */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#ff4400" />
        <pointLight position={[-5, 3, -3]} intensity={0.3} color="#ff8800" />
      </Canvas>
    </>
  )
}

export default function App() {
  return <NodeFireScene />
}