/**
 * Vanilla Three.js TSL Fire Example (without R3F)
 * Uses WebGPURenderer directly for proper TSL support
 */
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { FireMesh as FireTSL } from '@wolffo/three-fire/tsl/vanilla'

interface Props {
  magnitude: number
  lacunarity: number
  gain: number
  colorHue: number
}

export function FireSceneTSLVanilla({ magnitude, lacunarity, gain, colorHue }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const sceneRef = useRef<{
    fire: FireTSL | null
    renderer: WebGPURenderer | null
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    controls: OrbitControls | null
    stats: Stats | null
    animationId: number | null
    initialized: boolean
    disposed: boolean
  }>({
    fire: null,
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    stats: null,
    animationId: null,
    initialized: false,
    disposed: false,
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const init = async () => {
      try {
        sceneRef.current.disposed = false
        const scene = new THREE.Scene()
        sceneRef.current.scene = scene

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
        camera.position.set(0, 2, 5)
        sceneRef.current.camera = camera

        const renderer = new WebGPURenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        container.appendChild(renderer.domElement)
        sceneRef.current.renderer = renderer

        await renderer.init()

        const stats = new Stats()
        stats.dom.style.position = 'absolute'
        stats.dom.style.top = '0px'
        stats.dom.style.right = '0px'
        stats.dom.style.left = 'auto'
        container.appendChild(stats.dom)
        sceneRef.current.stats = stats

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 1, 0)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.minDistance = 2
        controls.maxDistance = 10
        sceneRef.current.controls = controls

        const textureLoader = new THREE.TextureLoader()
        const fireTex = await textureLoader.loadAsync('/Fire.png?mode=vanilla')

        const fire = new FireTSL({
          fireTex,
          color: new THREE.Color().setHSL(colorHue, 1, 0.6),
          magnitude,
          lacunarity,
          gain,
        })
        fire.scale.set(2, 3, 2)
        scene.add(fire)
        sceneRef.current.fire = fire

        const ambient = new THREE.AmbientLight(0xffffff, 0.2)
        scene.add(ambient)
        const point = new THREE.PointLight(0xff4400, 0.5)
        point.position.set(5, 5, 5)
        scene.add(point)

        const clock = new THREE.Clock()
        const animate = () => {
          if (sceneRef.current.disposed) return

          sceneRef.current.animationId = requestAnimationFrame(animate)

          const time = clock.getElapsedTime()

          if (sceneRef.current.fire) {
            sceneRef.current.fire.update(time)
            const breathe = 1 + Math.sin(time * 0.5) * 0.1
            sceneRef.current.fire.scale.set(2 * breathe, 3 * breathe, 2 * breathe)
          }

          controls.update()
          renderer.render(scene, camera)
          stats.update()
        }

        animate()
        sceneRef.current.initialized = true
        setStatus('ready')
      } catch (err) {
        console.error('WebGPU init error:', err)
        setErrorMsg(err instanceof Error ? err.message : String(err))
        setStatus('error')
      }
    }

    init()

    const handleResize = () => {
      if (!sceneRef.current.camera || !sceneRef.current.renderer) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      sceneRef.current.camera.aspect = w / h
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      sceneRef.current.disposed = true

      if (!sceneRef.current.initialized) return

      const { animationId, renderer, controls, stats } = sceneRef.current

      if (animationId) {
        cancelAnimationFrame(animationId)
        sceneRef.current.animationId = null
      }
      if (controls) {
        controls.dispose()
        sceneRef.current.controls = null
      }
      if (stats) {
        if (stats.dom && stats.dom.parentNode === container) {
          container.removeChild(stats.dom)
        }
        sceneRef.current.stats = null
      }
      if (renderer) {
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
        renderer.dispose()
        sceneRef.current.renderer = null
      }
      sceneRef.current.initialized = false
    }
  }, [])

  useEffect(() => {
    if (sceneRef.current.fire) {
      sceneRef.current.fire.magnitude = magnitude
      sceneRef.current.fire.lacunarity = lacunarity
      sceneRef.current.fire.gain = gain
      sceneRef.current.fire.fireColor = new THREE.Color().setHSL(colorHue, 1, 0.6)
    }
  }, [magnitude, lacunarity, gain, colorHue])

  if (status === 'error') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #000428 0%, #000000 100%)',
        color: 'white',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ color: '#ff4444' }}>WebGPU Error</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{errorMsg}</div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #000428 0%, #000000 100%)',
      }}
    >
      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
        }}>
          Initializing WebGPU...
        </div>
      )}
    </div>
  )
}
