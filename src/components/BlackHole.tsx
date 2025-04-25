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
import diskUrl03 from '../assets/accretion_disk03.png';
import diskUrl04 from '../assets/accretion_disk04.png';
import { useBloom } from '../hooks/useBloom';
import { useDiskTexture } from '../hooks/useDiskTexture';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BACKGROUND, CAMERA, QUALITY, DISK_TEXTURES, DEFAULTS } from '../constants/blackHole';

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

export function BlackHole() {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    const composerRef = useRef<EffectComposer>(null);
    const { camera, gl, scene } = useThree();
    const { intensity, threshold, radius } = useBloom();

    const [glowIntensity] = useLocalStorage<number>('glowIntensity', DEFAULTS.GLOW.INTENSITY);
    const glowEnabled = glowIntensity > 0;
    const { selectedTexture, useBlackbody, hideDisk } = useDiskTexture();
    
    // Use useLocalStorage for controls with defaults
    const [beamingEnabled] = useLocalStorage<boolean>('beamingEnabled', DEFAULTS.BEAMING.ENABLED);
    const [bloomEnabled] = useLocalStorage<boolean>('bloomEnabled', DEFAULTS.BLOOM.ENABLED);
    const [starsEnabled] = useLocalStorage<boolean>('starsEnabled', DEFAULTS.STARS.ENABLED);
    const [milkywayEnabled] = useLocalStorage<boolean>('milkywayEnabled', DEFAULTS.MILKYWAY.ENABLED);
    const [orbitEnabled] = useLocalStorage<boolean>('orbitEnabled', DEFAULTS.ORBIT.ENABLED);
    const [performanceMode] = useLocalStorage<boolean>('performanceMode', DEFAULTS.PERFORMANCE.ENABLED);
    const [diskIntensity] = useLocalStorage<number>('diskIntensity', DEFAULTS.DISK.INTENSITY);
    const [dopplerShiftEnabled] = useLocalStorage<boolean>('dopplerShiftEnabled', DEFAULTS.DISK.DOPPLER_SHIFT);

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

      // Map texture selection to URL
      const diskTextureMap = {
        [DISK_TEXTURES.DEFAULT]: diskUrl,
        [DISK_TEXTURES.DISK_00]: diskUrl00,
        [DISK_TEXTURES.DISK_01]: diskUrl01,
        [DISK_TEXTURES.DISK_02]: diskUrl02,
        [DISK_TEXTURES.DISK_03]: diskUrl03,
        [DISK_TEXTURES.DISK_04]: diskUrl04,
      };

      const diskTextureUrl = diskTextureMap[selectedTexture as keyof typeof diskTextureMap] || diskUrl;

      return {
        bgTexture: loadTexture(milkywayUrl, NearestFilter),
        starTexture: loadTexture(starUrl, LinearFilter),
        diskTexture: loadTexture(diskTextureUrl, LinearFilter)
      };
    }, [selectedTexture]);

    // Set initial camera position
    useEffect(() => {
      camera.position.set(CAMERA.INITIAL.X, CAMERA.INITIAL.Y, CAMERA.INITIAL.Z);
      camera.lookAt(0, 0, 0);

      // Add zoom limits to the camera
      camera.addEventListener('change', () => {
        const distance = camera.position.length();
        if (distance > CAMERA.DISTANCE.MAX) {
          const scale = CAMERA.DISTANCE.MAX / distance;
          camera.position.multiplyScalar(scale);
        } else if (distance < CAMERA.DISTANCE.MIN) {
          const scale = CAMERA.DISTANCE.MIN / distance;
          camera.position.multiplyScalar(scale);
        }
      });
    }, [camera]);

    // Determine quality settings based on performance mode
    const qualitySettings = useMemo(() => {
      return performanceMode ? QUALITY.LOW : QUALITY.HIGH;
    }, [performanceMode]);

    const uniforms = {
      time: { value: 0 },
      fov: { value: 60.0 },
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
      glow_intensity: { value: glowEnabled ? glowIntensity : 0.0 }
    };

    // Define shader material with textures
    const shaderMaterial = () => {
      const defines = `
        #define STEP ${qualitySettings.stepSize}
        #define NSTEPS ${qualitySettings.steps}
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
        materialRef.current.uniforms.bg_intensity.value = milkywayEnabled ? BACKGROUND.DEFAULT_INTENSITY : BACKGROUND.MIN_INTENSITY;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [milkywayEnabled]);

    // Update disk intensity when it changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.disk_intensity.value = diskIntensity;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [diskIntensity]);

    // Update doppler shift uniform when it changes
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.doppler_shift.value = dopplerShiftEnabled;
        // Force a re-render
        materialRef.current.needsUpdate = true;
      }
    }, [dopplerShiftEnabled]);

    // Update glow parameters when they change
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.glow_intensity.value = glowEnabled ? glowIntensity : 0.0;
        materialRef.current.needsUpdate = true;
      }
    }, [glowEnabled, glowIntensity]);

    // Update shader when performance mode changes
    useEffect(() => {
      if (materialRef.current) {
        // Recreate the shader material with new quality settings
        const newMaterial = shaderMaterial();
        materialRef.current.fragmentShader = newMaterial.fragmentShader;
        materialRef.current.uniforms = newMaterial.uniforms;
        materialRef.current.needsUpdate = true;
      }
    }, [performanceMode]);

    useFrame((state) => {
      if (materialRef.current) {
        const uniforms = materialRef.current.uniforms;
        uniforms.time.value = state.clock.elapsedTime * 0.2;
        
        // Update resolution if changed
        const width = gl.domElement.width;
        const height = gl.domElement.height;
        if (uniforms.resolution.value.x !== width || uniforms.resolution.value.y !== height) {
          uniforms.resolution.value.set(width, height);
        }
        
        // Update camera position for orbit
        if (orbitEnabled) {
          const time = state.clock.elapsedTime * CAMERA.ORBIT.SPEED;
          const x = Math.sin(time) * CAMERA.ORBIT.RADIUS;
          const z = Math.cos(time) * CAMERA.ORBIT.RADIUS;
          camera.position.set(x, 1, z);
          camera.lookAt(0, 0, 0);
        }

        // Enforce camera distance limits
        const distance = camera.position.length();
        if (distance > CAMERA.DISTANCE.MAX) {
          const scale = CAMERA.DISTANCE.MAX / distance;
          camera.position.multiplyScalar(scale);
        } else if (distance < CAMERA.DISTANCE.MIN) {
          const scale = CAMERA.DISTANCE.MIN / distance;
          camera.position.multiplyScalar(scale);
        }
        
        // Update camera uniforms
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
          <sphereGeometry args={[20, qualitySettings.segments, qualitySettings.segments]} />
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