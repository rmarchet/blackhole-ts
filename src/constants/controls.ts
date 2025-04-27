// Control groups default state
export const DEFAULT_EXPANDED_GROUPS = {
  bloom: false,
  diskTexture: true,
  effects: true,
  camera: false,
  performance: false
}

// Bloom controls
export const BLOOM_DEFAULTS = {
  enabled: false,
  intensity: 1.0,
  threshold: 0.5,
  radius: 1.0
}

// Glow controls
export const GLOW_DEFAULTS = {
  intensity: 0.6,  // 0 means disabled by default
  min: 0,
  max: 3,
  step: 0.1
}

// Disk controls
export const DISK_DEFAULTS = {
  intensity: 0.7,
  beaming: true,
  dopplerShift: true
}

// Background controls
export const BACKGROUND_DEFAULTS = {
  stars: true,
  milkyway: true,
}

// Camera controls
export const CAMERA_DEFAULTS = {
  orbit: false
}

// Performance controls
export const PERFORMANCE_DEFAULTS = {
  enabled: true
}

// Slider ranges
export const SLIDER_RANGES = {
  bloomIntensity: { min: 0, max: 2, step: 0.1, default: 1.0 },
  bloomThreshold: { min: 0, max: 1, step: 0.1, default: 0.5 },
  bloomRadius: { min: 0, max: 2, step: 0.1, default: 1.0 },
  diskIntensity: { min: 0.1, max: 2.0, step: 0.1, default: 1.0 }
} as const

// Type definitions for type safety
export type ControlGroup = 'bloom' | 'diskTexture' | 'effects' | 'camera' | 'performance';

export interface ExpandedGroups {
  bloom: boolean;
  diskTexture: boolean;
  effects: boolean;
  camera: boolean;
  performance: boolean;
}
