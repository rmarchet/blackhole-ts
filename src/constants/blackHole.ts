// Background settings
export const BACKGROUND = {
  DEFAULT_INTENSITY: 0.3,
  MIN_INTENSITY: 0.005,
} as const

// Black hole settings
export const BLACK_HOLE = {
  ROTATION: {
    MIN: -0.998,
    MAX: 0.998,  // Maximum spin parameter (a*) for a Kerr black hole
    DEFAULT: 0.9,
  }
} as const

// Camera settings
export const CAMERA = {
  ORBIT: {
    RADIUS: 9.5,
    SPEED: 0.2,
  },
  DISTANCE: {
    MIN: 5,
    MAX: 15,  // Maximum distance to keep black hole visible
  },
  INITIAL: {
    X: 0,
    Y: 1,
    Z: 10,
  }
} as const

export const UNIFORMS = {
  TIME: 0.20, // Animations multiplier (both orbit and accretion disk)
}

// Performance quality settings
export const QUALITY = {
  HIGH: {
    steps: 350,
    segments: 64,
    stepSize: 0.08,
  },
  LOW: {
    steps: 140,
    segments: 18,
    stepSize: 0.12,
  }
} as const

// Type definition for quality settings
export type QualitySettings = typeof QUALITY.HIGH | typeof QUALITY.LOW

// Default values for various features
export const DEFAULTS = {
  BLOOM: {
    ENABLED: true,
    INTENSITY: 1.5,
    THRESHOLD: 0.3,
    RADIUS: 0.8,
  },
  BEAMING: {
    ENABLED: true,
  },
  STARS: {
    ENABLED: true,
  },
  MILKYWAY: {
    ENABLED: true,
  },
  ORBIT: {
    ENABLED: false,
  },
  PERFORMANCE: {
    ENABLED: true,
  },
  DISK: {
    INTENSITY: 1.0,
    DOPPLER_SHIFT: true,
    INNER_RADIUS: 2.45,
    WIDTH: 4.0,
    DOPPLER_INTENSITY: 1.0,
    BEAMING_INTENSITY: 1.0,
  },
  GLOW: {
    INTENSITY: 0.0,
  },
  BLACK_HOLE: {
    ROTATION: BLACK_HOLE.ROTATION.DEFAULT,
    RELATIVISTIC_JET: false,
  },
  FOV: 60.0,
} as const
