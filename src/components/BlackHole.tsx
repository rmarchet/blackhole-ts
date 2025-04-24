import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { ShaderMaterial, Mesh, BackSide, Vector3, Vector2, TextureLoader, NearestFilter, LinearFilter, ClampToEdgeWrapping, WebGLRenderer, Scene, Camera } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import vertexShader from '../shaders/vertexShader.glsl?raw';
import { fragmentShader } from '../shaders/fragmentShader/index';
import starUrl from '../assets/star_noise.png';
import milkywayUrl from '../assets/milkyway.jpg';
import diskUrl from '../assets/accretion_disk.png';
import diskUrl00 from '../assets/accretion_disk00.png';
import diskUrl01 from '../assets/accretion_disk01.png';
import diskUrl02 from '../assets/accretion_disk02.png';
import { useBloom } from '../hooks/useBloom';
import { useDiskTexture } from '../hooks/useDiskTexture';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_BG_INTENSITY = 0.38;

// Extend R3F with post-processing components
extend({ EffectComposer, RenderPass, UnrealBloomPass });

// Augment R3F types
declare module '@react-three/fiber' {
  interface ThreeElements {
    effectComposer: React.JSX.IntrinsicElements['mesh'] & {
      args: [WebGLRenderer];
    };
    renderPass: React.JSX.IntrinsicElements['mesh'] & {
      args: [Scene, Camera];
      attach?: string;
    };
    unrealBloomPass: React.JSX.IntrinsicElements['mesh'] & {
      args: [Vector2 | [number, number], number, number, number];
      attach?: string;
    };
  }
}

export const BlackHole = () => {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    const composerRef = useRef<EffectComposer>(null);
    const { camera, gl, scene } = useThree();
    const { intensity, threshold, radius } = useBloom();
    const { selectedTexture, useBlackbody, hideDisk } = useDiskTexture();
    
    // Use useLocalStorage directly for beaming, bloom, stars, and milkyway
    const [beamingEnabled] = useLocalStorage<boolean>('beamingEnabled', true);
    const [bloomEnabled] = useLocalStorage<boolean>('bloomEnabled', true);
    const [starsEnabled] = useLocalStorage<boolean>('starsEnabled', true);
    const [milkywayEnabled] = useLocalStorage<boolean>('milkywayEnabled', true);

    // Load textures
    const textures = useMemo(() => {
      const textureLoader = new TextureLoader();
      const loadTexture = (url: string, filter: typeof NearestFilter | typeof LinearFilter) => {
        const texture = textureLoader.load(url);
        texture.magFilter = filter;
        texture.minFilter = filter;
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;
        return texture;
      };

      // Map the selected texture to the actual texture object
      let diskTextureUrl = diskUrl; // Default
      if (selectedTexture === 'accretion_disk00.png') {
        diskTextureUrl = diskUrl00;
      } else if (selectedTexture === 'accretion_disk01.png') {
        diskTextureUrl = diskUrl01;
      } else if (selectedTexture === 'accretion_disk02.png') {
        diskTextureUrl = diskUrl02;
      }

      return {
        bgTexture: loadTexture(milkywayUrl, NearestFilter),
        starTexture: loadTexture(starUrl, LinearFilter),
        diskTexture: loadTexture(diskTextureUrl, LinearFilter)
      };
    }, [selectedTexture]);

    // Set initial camera position
    useEffect(() => {
      camera.position.set(0, 1, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    const uniforms = {
      time: { value: 0 },
      fov: { value: 60.0 },
      accretion_disk: { value: !hideDisk },
      use_disk_texture: { value: !useBlackbody },
      lorentz_transform: { value: true },
      doppler_shift: { value: true },
      beaming: { value: beamingEnabled },
      bg_intensity: { value: milkywayEnabled ? DEFAULT_BG_INTENSITY : 0.005 },
      show_stars: { value: starsEnabled },
      show_milkyway: { value: milkywayEnabled },
      // Add bloom parameters as uniforms
      bloom_intensity: { value: intensity },
      bloom_threshold: { value: threshold },
      bloom_radius: { value: radius },
    }

    // Define shader material with textures
    const shaderMaterial = () => {
      const defines = `
        #define STEP 0.08
        #define NSTEPS 350
        // Remove hard-coded bloom parameters from here
      `;

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
        transparent: true,
        depthWrite: false,
        side: BackSide
      });
    }

    // Update the disk texture when useStripes changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.disk_texture.value = textures.diskTexture;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [textures.diskTexture]);

    // Update the accretion_disk uniform when hideDisk changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.accretion_disk.value = !hideDisk;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [hideDisk]);

    // Update bloom parameters when they change
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.bloom_intensity.value = intensity;
        materialRef.current.uniforms.bloom_threshold.value = threshold;
        materialRef.current.uniforms.bloom_radius.value = radius;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [intensity, threshold, radius]);

    // Update beaming uniform when it changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.beaming.value = beamingEnabled;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [beamingEnabled]);

    // Update stars uniform when it changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.show_stars.value = starsEnabled;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [starsEnabled]);

    // Update milkyway uniform when it changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.bg_intensity.value = milkywayEnabled ? DEFAULT_BG_INTENSITY : 0.005;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [milkywayEnabled]);

    useFrame((state) => {
      if (materialRef.current) {
        const uniforms = materialRef.current.uniforms;
        uniforms.time.value = state.clock.elapsedTime * 0.2;
        
        // Only update resolution if it has changed
        const width = gl.domElement.width;
        const height = gl.domElement.height;
        if (uniforms.resolution.value.x !== width || uniforms.resolution.value.y !== height) {
          uniforms.resolution.value.set(width, height);
        }
        
        // Update camera uniforms with fixed values
        uniforms.cam_pos.value.copy(camera.position);
        uniforms.cam_dir.value.copy(camera.getWorldDirection(new Vector3()));
        uniforms.cam_up.value.copy(camera.up);
      }

      // Update composer
      if (composerRef.current) {
        composerRef.current.render();
      }
    });

    // Add a bright point light to enhance the bloom effect
    useEffect(() => {
      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);
      
      return () => {
        scene.remove(pointLight);
      };
    }, [scene]);

    return (
      <>
        <mesh ref={meshRef}>
          <sphereGeometry args={[20, 64, 64]} />
          <shaderMaterial ref={materialRef} {...shaderMaterial()} />
        </mesh>
        
        <effectComposer ref={composerRef} args={[gl]}>
          <renderPass 
            attach="passes" 
            args={[scene, camera]}
          />
          <unrealBloomPass 
            attach="passes"
            args={[new Vector2(gl.domElement.width, gl.domElement.height), intensity, radius, threshold]}
            enabled={bloomEnabled}
          />
        </effectComposer>
      </>
    );
} 