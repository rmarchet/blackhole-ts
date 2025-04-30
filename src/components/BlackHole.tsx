import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ShaderMaterial, Mesh, BackSide, Vector3, Vector2, TextureLoader, 
  NearestFilter, LinearFilter, ClampToEdgeWrapping,
} from 'three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import vertexShader from '../shaders/vertexShader.glsl?raw'
import { fragmentShader } from '../shaders/fragmentShader/index'
import { IMAGES, DISK_TEXTURE_MAP, DISK_TEXTURES } from '../constants/textures'
import { useBloom } from '../hooks/useBloom'
import { useDiskTexture } from '../hooks/useDiskTexture'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { 
  BACKGROUND,
  CAMERA,
  QUALITY,
  DEFAULTS,
  UNIFORMS,
} from '../constants/blackHole'

export const BlackHole = () => {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { camera, gl, scene } = useThree()
  const { enabled, intensity, threshold, radius } = useBloom()
  const [glowIntensity] = useLocalStorage<number>('glowIntensity', DEFAULTS.GLOW.INTENSITY)
  const glowEnabled = glowIntensity > 0
  const { selectedTexture, useBlackbody, hideDisk } = useDiskTexture()
    
  // Use useLocalStorage for controls with defaults
  const [beamingEnabled] = useLocalStorage<boolean>('beamingEnabled', DEFAULTS.BEAMING.ENABLED)
  const [starsEnabled] = useLocalStorage<boolean>('starsEnabled', DEFAULTS.STARS.ENABLED)
  const [milkywayEnabled] = useLocalStorage<boolean>('milkywayEnabled', DEFAULTS.MILKYWAY.ENABLED)
  const [orbitEnabled] = useLocalStorage<boolean>('orbitEnabled', DEFAULTS.ORBIT.ENABLED)
  const [performanceMode] = useLocalStorage<boolean>('performanceMode', DEFAULTS.PERFORMANCE.ENABLED)
  const [diskIntensity] = useLocalStorage<number>('diskIntensity', DEFAULTS.DISK.INTENSITY)
  const [dopplerShiftEnabled] = useLocalStorage<boolean>('dopplerShiftEnabled', DEFAULTS.DISK.DOPPLER_SHIFT)
  const [blackHoleRotation] = useLocalStorage<number>('blackHoleRotation', DEFAULTS.BLACK_HOLE.ROTATION)
  const [jetEnabled] = useLocalStorage<boolean>('jetEnabled', DEFAULTS.BLACK_HOLE.RELATIVISTIC_JET)

  // Add localStorage hooks for disk geometry
  const [diskIn] = useLocalStorage<number>('diskIn', DEFAULTS.DISK.INNER_RADIUS)
  const [diskWidth] = useLocalStorage<number>('diskWidth', DEFAULTS.DISK.WIDTH)

  // Load textures
  const textures = useMemo(() => {
    const textureLoader = new TextureLoader()
    const loadTexture = (url: string, filter: typeof NearestFilter | typeof LinearFilter) => {
      const texture = textureLoader.load(url)
      texture.magFilter = filter
      texture.minFilter = filter
      texture.wrapS = ClampToEdgeWrapping
      texture.wrapT = ClampToEdgeWrapping
      return texture
    }

    const diskTextureUrl = DISK_TEXTURE_MAP[selectedTexture as keyof typeof DISK_TEXTURE_MAP] || IMAGES.diskNaturalUrl

    return {
      bgTexture: loadTexture(IMAGES.milkywayUrl, NearestFilter),
      starTexture: loadTexture(IMAGES.starUrl, LinearFilter),
      diskTexture: loadTexture(diskTextureUrl, LinearFilter)
    }
  }, [selectedTexture])

  // Set initial camera position
  useEffect(() => {
    camera.position.set(CAMERA.INITIAL.X, CAMERA.INITIAL.Y, CAMERA.INITIAL.Z)
    camera.lookAt(0, 0, 0)

    // Add zoom limits to the camera
    // @ts-expect-error ignore typecheck on camera
    camera.addEventListener('change', () => {
      const distance = camera.position.length()
      if (distance > CAMERA.DISTANCE.MAX) {
        const scale = CAMERA.DISTANCE.MAX / distance
        camera.position.multiplyScalar(scale)
      } else if (distance < CAMERA.DISTANCE.MIN) {
        const scale = CAMERA.DISTANCE.MIN / distance
        camera.position.multiplyScalar(scale)
      }
    })
  }, [camera])

  // Determine quality settings based on performance mode
  const qualitySettings = useMemo(() => {
    return performanceMode ? QUALITY.LOW : QUALITY.HIGH
  }, [performanceMode])

  const uniforms = {
    time: { value: 0 },
    fov: { value: DEFAULTS.FOV },
    accretion_disk: { value: !hideDisk },
    use_disk_texture: { value: !useBlackbody },
    lorentz_transform: { value: true },
    doppler_shift: { value: dopplerShiftEnabled },
    beaming: { value: beamingEnabled },
    bg_intensity: { value: milkywayEnabled ? BACKGROUND.DEFAULT_INTENSITY : BACKGROUND.MIN_INTENSITY },
    show_stars: { value: starsEnabled },
    show_milkyway: { value: milkywayEnabled },
    disk_intensity: { value: diskIntensity },
    bloom_intensity: { value: intensity },
    bloom_threshold: { value: threshold },
    bloom_radius: { value: radius },
    glow_intensity: { value: glowEnabled ? glowIntensity : 0.0 },
    black_hole_rotation: { value: blackHoleRotation },
    jet_enabled: { value: jetEnabled },
    orbit_enabled: { value: orbitEnabled },
    // Add disk geometry uniforms
    DISK_IN: { value: diskIn },
    DISK_WIDTH: { value: diskWidth },
    thermal_colormap_mode: { value: selectedTexture === DISK_TEXTURES.THERMAL.value },
  }

  // Define shader material with textures
  const shaderMaterial = () => {
    const defines = `
        #define STEP ${qualitySettings.stepSize}
        #define NSTEPS ${qualitySettings.steps}
      `

    return new ShaderMaterial({
      vertexShader,
      fragmentShader: defines + fragmentShader,
      uniforms: {
        resolution: { value: new Vector2(gl.domElement.width, gl.domElement.height) },
        cam_pos: { value: new Vector3(0, 3, 10) },
        cam_dir: { value: new Vector3(0, 0, -1) },
        cam_up: { value: new Vector3(0, 1, 0) },
        cam_vel: { value: new Vector3(0, 0, 0) },
        bg_texture: { value: textures.bgTexture },
        star_texture: { value: textures.starTexture },
        disk_texture: { value: textures.diskTexture },
        ...uniforms,
      },
      transparent: false,
      depthWrite: true,
      side: BackSide
    })
  }

  // Update the disk texture when useStripes changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.disk_texture.value = textures.diskTexture
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [textures.diskTexture])

  // Update the accretion_disk uniform when hideDisk changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.accretion_disk.value = !hideDisk
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [hideDisk])

  // Update bloom parameters when they change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.bloom_intensity.value = intensity
      materialRef.current.uniforms.bloom_threshold.value = threshold
      materialRef.current.uniforms.bloom_radius.value = radius
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [intensity, threshold, radius])

  // Update beaming uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.beaming.value = beamingEnabled
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [beamingEnabled])

  // Update stars uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.show_stars.value = starsEnabled
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [starsEnabled])

  // Update milkyway uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.bg_intensity.value = milkywayEnabled ? BACKGROUND.DEFAULT_INTENSITY : BACKGROUND.MIN_INTENSITY
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [milkywayEnabled])

  // Update disk intensity when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.disk_intensity.value = diskIntensity
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [diskIntensity])

  // Update doppler shift uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.doppler_shift.value = dopplerShiftEnabled
      // Force a re-render
      materialRef.current.needsUpdate = true
    }
  }, [dopplerShiftEnabled])

  // Update glow parameters when they change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.glow_intensity.value = glowEnabled ? glowIntensity : 0.0
      materialRef.current.needsUpdate = true
    }
  }, [glowEnabled, glowIntensity])

  // Update black hole rotation when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.black_hole_rotation.value = blackHoleRotation
      materialRef.current.needsUpdate = true
    }
  }, [blackHoleRotation])

  // Update jet enabled uniform when it changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.jet_enabled.value = jetEnabled
      materialRef.current.needsUpdate = true
    }
  }, [jetEnabled])

  // Update disk geometry uniforms when values change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.DISK_IN.value = diskIn
      materialRef.current.uniforms.DISK_WIDTH.value = diskWidth
      materialRef.current.needsUpdate = true
    }
  }, [diskIn, diskWidth])

  // Update shader when performance mode changes
  useEffect(() => {
    if (materialRef.current) {
      // Recreate the shader material with new quality settings
      const newMaterial = shaderMaterial()
      materialRef.current.fragmentShader = newMaterial.fragmentShader
      materialRef.current.uniforms = newMaterial.uniforms
      materialRef.current.needsUpdate = true
    }
  }, [performanceMode])

  // Update thermal_colormap_mode when selectedTexture changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.thermal_colormap_mode.value = selectedTexture === DISK_TEXTURES.THERMAL.value
      materialRef.current.needsUpdate = true
    }
  }, [selectedTexture])

  useFrame((state) => {
    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms
      uniforms.time.value = state.clock.elapsedTime * UNIFORMS.TIME
        
      // Update resolution if changed
      const width = gl.domElement.width
      const height = gl.domElement.height
      if (uniforms.resolution.value.x !== width || uniforms.resolution.value.y !== height) {
        uniforms.resolution.value.set(width, height)
      }
        
      // Update camera position for orbit
      if (orbitEnabled) {
        const time = state.clock.elapsedTime * CAMERA.ORBIT.SPEED
        const x = Math.sin(time) * CAMERA.ORBIT.RADIUS
        const z = Math.cos(time) * CAMERA.ORBIT.RADIUS
        camera.position.set(x, 1, z)
        camera.lookAt(0, 0, 0)
      }

      // Enforce camera distance limits
      // Only apply distance limits when not in orbit mode
      if (!orbitEnabled) {
        const distance = camera.position.length()
        if (distance > CAMERA.DISTANCE.MAX) {
          const scale = CAMERA.DISTANCE.MAX / distance
          camera.position.multiplyScalar(scale)
        } else if (distance < CAMERA.DISTANCE.MIN) {
          const scale = CAMERA.DISTANCE.MIN / distance
          camera.position.multiplyScalar(scale)
        }
      }
        
      // Update camera uniforms
      uniforms.cam_pos.value.copy(camera.position)
      uniforms.cam_dir.value.copy(camera.getWorldDirection(new Vector3()))
      uniforms.cam_up.value.copy(camera.up)
    }
  })

  // Add a bright point light to enhance the bloom effect
  useEffect(() => {
    const pointLight = new THREE.PointLight(0xffffff, 2, 100)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)
      
    return () => {
      scene.remove(pointLight)
    }
  }, [scene])

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[20, qualitySettings.segments, qualitySettings.segments]} />
        <shaderMaterial ref={materialRef} {...shaderMaterial()} />
      </mesh>
        
      <EffectComposer>
        <Bloom 
          intensity={enabled ? intensity : 0}
          luminanceThreshold={threshold}
          luminanceSmoothing={0.99}
          radius={radius}
          mipmapBlur={true}
          kernelSize={1}
        />
      </EffectComposer>
    </>
  )
} 
