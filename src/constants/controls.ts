import { DEFAULTS } from './blackHole'

// Control groups default state
export const DEFAULT_EXPANDED_GROUPS = {
  performance: false,
  bloom: true,
  effects: true,
  disk: true,
  textures: true,
  camera: false,
}

// Bloom controls
export const BLOOM_DEFAULTS = {
  enabled: DEFAULTS.BLOOM.ENABLED,
  intensity: 1.0,
  threshold: 0.5,
  radius: 1.0,
}

// Glow controls
export const GLOW_DEFAULTS = {
  intensity: DEFAULTS.GLOW.INTENSITY,  // 0 means disabled by default
  min: 0,
  max: 3,
  step: 0.1,
}

// Disk controls
export const DISK_DEFAULTS = {
  intensity: DEFAULTS.DISK.INTENSITY,
  beaming: DEFAULTS.BEAMING.ENABLED,
  dopplerShift: DEFAULTS.DISK.DOPPLER_SHIFT,
}

// Background controls
export const BACKGROUND_DEFAULTS = {
  stars: DEFAULTS.STARS.ENABLED,
  milkyway: DEFAULTS.MILKYWAY.ENABLED,
}

// Camera controls
export const CAMERA_DEFAULTS = {
  orbit: false,
}

// Performance controls
export const PERFORMANCE_DEFAULTS = {
  enabled: true,
}

// Slider ranges
export const SLIDER_RANGES = {
  bloomIntensity: { min: 0, max: 2, step: 0.1, default: 1.0 },
  bloomThreshold: { min: 0, max: 1, step: 0.1, default: 0.5 },
  bloomRadius: { min: 0, max: 1, step: 0.1, default: 0.9 },
  diskIntensity: { min: 0.1, max: 2.0, step: 0.1, default: DEFAULTS.DISK.INTENSITY },
  diskInnerRadius: { min: 2.0, max: 3.5, step: 0.1, default: DEFAULTS.DISK.INNER_RADIUS },
  diskWidth: { min: 2.0, max: 6.5, step: 0.1, default: DEFAULTS.DISK.WIDTH },
} as const

// Type definitions for collapsible sections
export type ExpandedGroups = typeof DEFAULT_EXPANDED_GROUPS

export type ControlGroup = keyof ExpandedGroups
