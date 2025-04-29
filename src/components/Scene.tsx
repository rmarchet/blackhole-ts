import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { BlackHole } from './BlackHole'
import {
  CAMERA_POSITION,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  TILTED_UP_VECTOR,
  ORBIT_CONTROLS_CONFIG
} from '../constants/scene'

// Camera setup component to handle initial camera position and orientation
const CameraSetup = () => {
  const { camera } = useThree()
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(...CAMERA_POSITION)
    
    // Set the camera's up vector to the tilted vector
    camera.up.copy(TILTED_UP_VECTOR)
    
    // Make sure the camera is looking at the center
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return null
}

export const Scene = () => {
  // Create a ref for the OrbitControls
  const controlsRef = useRef(null)
  
  return (
    <Canvas
      className='canvas'
      camera={{
        position: CAMERA_POSITION,
        fov: CAMERA_FOV,
        near: CAMERA_NEAR,
        far: CAMERA_FAR
      }}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      <CameraSetup />
      <OrbitControls 
        ref={controlsRef}
        {...ORBIT_CONTROLS_CONFIG} 
      />
      <BlackHole />
    </Canvas>
  )
} 
