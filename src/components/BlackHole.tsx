import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { ShaderMaterial, Mesh, BackSide, Vector3, Vector2, TextureLoader, NearestFilter, LinearFilter, ClampToEdgeWrapping, WebGLRenderer, Scene, Camera } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import vertexShader from '../shaders/vertexShader.glsl?raw';
import fragmentShader from '../shaders/fragmentShader.glsl?raw';
import starUrl from '../assets/star_noise.png';
import milkywayUrl from '../assets/milkyway.jpg';
import diskUrl from '../assets/accretion_disk.png';

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

        return {
            bgTexture: loadTexture(milkywayUrl, NearestFilter),
            starTexture: loadTexture(starUrl, LinearFilter),
            diskTexture: loadTexture(diskUrl, LinearFilter)
        };
    }, []);

    // Set initial camera position
    useEffect(() => {
        camera.position.set(0, 3, 10);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    // Define shader material with textures
    const shaderMaterial = useMemo(() => {
        const defines = `
            #define STEP 0.04
            #define NSTEPS 700
        `;

        return new ShaderMaterial({
            vertexShader,
            fragmentShader: defines + fragmentShader,
            uniforms: {
                time: { value: 0 },
                resolution: { value: new Vector2(gl.domElement.width, gl.domElement.height) },
                cam_pos: { value: new Vector3(0, 3, 10) },
                cam_dir: { value: new Vector3(0, 0, -1) },
                cam_up: { value: new Vector3(0, 1, 0) },
                cam_vel: { value: new Vector3(0, 0, 0) },
                fov: { value: 60.0 },
                accretion_disk: { value: true },
                use_disk_texture: { value: true },
                lorentz_transform: { value: true },
                doppler_shift: { value: true },
                beaming: { value: true },
                bg_texture: { value: textures.bgTexture },
                star_texture: { value: textures.starTexture },
                disk_texture: { value: textures.diskTexture }
            },
            transparent: true,
            depthWrite: false,
            side: BackSide
        });
    }, [gl, textures]);

    useFrame((state) => {
        if (materialRef.current) {
            const uniforms = materialRef.current.uniforms;
            uniforms.time.value = state.clock.elapsedTime * 0.2;
            uniforms.resolution.value.set(gl.domElement.width, gl.domElement.height);
            
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

    return (
        <>
            <mesh ref={meshRef}>
                <sphereGeometry args={[20, 128, 128]} />
                <shaderMaterial ref={materialRef} {...shaderMaterial} />
            </mesh>
            
            <effectComposer ref={composerRef} args={[gl]}>
                <renderPass 
                    attach="passes" 
                    args={[scene, camera]}
                />
                <unrealBloomPass 
                    attach="passes"
                    args={[new Vector2(128, 128), 0.8, 2.0, 0.0]}
                />
            </effectComposer>
        </>
    );
} 