// Control groups default state
export const DEFAULT_EXPANDED_GROUPS = {
    bloom: true,
    diskTexture: true,
    effects: true,
    camera: true,
    performance: true
};

// Bloom controls
export const BLOOM_DEFAULTS = {
    enabled: true,
    intensity: 1.0,
    threshold: 0.5,
    radius: 1.0
};

// Glow controls
export const GLOW_DEFAULTS = {
    intensity: 0,  // 0 means disabled by default
    min: 0,
    max: 3,
    step: 0.1
};

// Disk controls
export const DISK_DEFAULTS = {
    intensity: 1.0,
    beaming: true,
    dopplerShift: false
};

// Background controls
export const BACKGROUND_DEFAULTS = {
    stars: true,
    milkyway: true
};

// Camera controls
export const CAMERA_DEFAULTS = {
    orbit: false
};

// Performance controls
export const PERFORMANCE_DEFAULTS = {
    enabled: false
};

// Slider ranges
export const SLIDER_RANGES = {
    bloomIntensity: { min: 0, max: 2, step: 0.1 },
    bloomThreshold: { min: 0, max: 1, step: 0.1 },
    bloomRadius: { min: 0, max: 2, step: 0.1 },
    diskIntensity: { min: 0.1, max: 2.0, step: 0.1 }
};

// Type definitions for type safety
export type ControlGroup = 'bloom' | 'diskTexture' | 'effects' | 'camera' | 'performance';

export interface ExpandedGroups {
    bloom: boolean;
    diskTexture: boolean;
    effects: boolean;
    camera: boolean;
    performance: boolean;
} 