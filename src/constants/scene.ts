import * as THREE from 'three'

// Camera constants
export const CAMERA_POSITION = [0, 5, 15] as const
export const CAMERA_FOV = 60
export const CAMERA_NEAR = 0.1
export const CAMERA_FAR = 1000

// Camera tilt angle in degrees
export const CAMERA_TILT_ANGLE = 25

// Convert tilt angle to radians
export const CAMERA_TILT_RADIANS = CAMERA_TILT_ANGLE * (Math.PI / 180)

// Create a rotated up vector (tilted sideways)
export const TILTED_UP_VECTOR = new THREE.Vector3(
  Math.sin(CAMERA_TILT_RADIANS),  // x component
  Math.cos(CAMERA_TILT_RADIANS),  // y component
  0                               // z component
)

// Orbit controls constants
export const ORBIT_CONTROLS_CONFIG = {
  enablePan: true,
  minDistance: 4,
  maxDistance: 30,
  rotateSpeed: 0.65,
  zoomSpeed: 0.5,
} as const
