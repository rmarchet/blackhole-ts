import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlackHole } from './BlackHole';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Camera setup component to handle initial camera position and orientation
function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 5, 15);
    
    // Apply a 25-degree sideways tilt on the Y axis
    const angle = 25 * (Math.PI / 180); // Convert degrees to radians
    
    // Create a rotated up vector (tilted sideways)
    const tiltedUp = new THREE.Vector3(
      Math.sin(angle),  // x component
      Math.cos(angle),  // y component
      0                 // z component
    );
    
    // Set the camera's up vector to the tilted vector
    camera.up.copy(tiltedUp);
    
    // Make sure the camera is looking at the center
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
}

export const Scene = () => {
  return (
    <Canvas
      className='canvas'
      camera={{
        position: [0, 5, 15],
        fov: 60,
        near: 0.1,
        far: 1000
      }}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      <CameraSetup />
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={50}
        rotateSpeed={0.65}
        zoomSpeed={0.5}
      />
      <BlackHole />
    </Canvas>
  );
} 