// Background settings
export const BACKGROUND = {
  DEFAULT_INTENSITY: 0.38,
  MIN_INTENSITY: 0.005
} as const;

// Camera settings
export const CAMERA = {
  ORBIT: {
    RADIUS: 15,
    SPEED: 0.2
  },
  DISTANCE: {
    MIN: 5,
    MAX: 15  // Maximum distance to keep black hole visible
  },
  INITIAL: {
    X: 0,
    Y: 1,
    Z: 10
  }
} as const;

export const UNIFORMS = {
  TIME: 0.25,
}

// Performance quality settings
export const QUALITY = {
  HIGH: {
    steps: 350,
    segments: 64,
    stepSize: 0.08
  },
  LOW: {
    steps: 150,
    segments: 32,
    stepSize: 0.12
  }
} as const;

// Type definition for quality settings
export type QualitySettings = typeof QUALITY.HIGH | typeof QUALITY.LOW;

// Disk texture mapping
export const DISK_TEXTURES = {
  DEFAULT: 'accretion_disk.png',
  DISK_00: 'accretion_disk00.png',
  DISK_01: 'accretion_disk01.png',
  DISK_02: 'accretion_disk02.png',
  DISK_03: 'accretion_disk03.png',
  DISK_04: 'accretion_disk04.png'
} as const;

// Default values for various features
export const DEFAULTS = {
  BLOOM: {
    ENABLED: true
  },
  BEAMING: {
    ENABLED: true
  },
  STARS: {
    ENABLED: true
  },
  MILKYWAY: {
    ENABLED: true
  },
  ORBIT: {
    ENABLED: false
  },
  PERFORMANCE: {
    ENABLED: false
  },
  DISK: {
    INTENSITY: 1.0,
    DOPPLER_SHIFT: false
  },
  GLOW: {
    INTENSITY: 1.0
  }
} as const;
