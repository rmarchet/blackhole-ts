import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlackHole } from './BlackHole';

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
      <OrbitControls 
        enablePan={false}
        minDistance={5}
        maxDistance={50}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
      <BlackHole />
    </Canvas>
  );
} 