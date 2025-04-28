import starUrl from '../assets/star_noise.png'
import milkywayUrl from '../assets/milkyway.jpg'
import diskNaturalUrl from '../assets/accretion_disk_natural.png'
import diskRedWhiteUrl from '../assets/accretion_disk_red_white.png'
import diskRedWhitePurpleUrl from '../assets/accretion_disk_red_white_purple.png'
import diskArrowsUrl from '../assets/accretion_disk_arrows.png'
import diskYellowUrl from '../assets/accretion_disk_yellow.png'
import diskBrightUrl from '../assets/accretion_disk_bright.png'
import diskBlueUrl from '../assets/accretion_disk_blue.png'
import diskGridUrl from '../assets/accretion_disk_grid.png'
import diskGridlinesUrl from '../assets/accretion_disk_gridlines.png'
import diskChaoticUrl from '../assets/accretion_disk_chaotic.png'
import diskThermalUrl from '../assets/accretion_disk_thermal.png'

export const IMAGES = {
  starUrl,
  milkywayUrl,
  diskNaturalUrl,
  diskRedWhiteUrl,
  diskRedWhitePurpleUrl,
  diskArrowsUrl,
  diskYellowUrl,
  diskBrightUrl,
  diskBlueUrl,
  diskGridUrl,
  diskGridlinesUrl,
  diskChaoticUrl,
  diskThermalUrl,
}

export const DISK_TEXTURES = {
  NO_DISK: { value: 'no_disk', label: 'No Disk' },
  NONE: { value: 'none', label: 'No Texture (Blackbody)' },
  NATURAL: { value: 'accretion_disk_natural.png', label: 'Natural' },
  RED_STRIPES: { value: 'accretion_disk_red_white.png', label: 'Red stripes' },
  RED_PURPLE_STRIPES: { value: 'accretion_disk_red_white_purple.png', label: 'Red-Purple stripes' },
  GRID: { value: 'accretion_disk_grid.png', label: 'Checkboard' },
  GRID_LINES: { value: 'accretion_disk_gridlines.png', label: 'Grid lines' },
  THERMAL: { value: 'accretion_disk_thermal.png', label: 'Thermal' },
  ARROWS: { value: 'accretion_disk_arrows.png', label: 'Arrows' },
  CHAOTIC: { value: 'accretion_disk_chaotic.png', label: 'Turbulence' },
  YELLOW: { value: 'accretion_disk_yellow.png', label: 'Yellow' },
  BLUE: { value: 'accretion_disk_blue.png', label: 'Blue' },
  BRIGHT: { value: 'accretion_disk_bright.png', label: 'Bright' },
}

// Map texture selection to URL
export const DISK_TEXTURE_MAP = {
  [DISK_TEXTURES.NATURAL.value]: diskNaturalUrl,
  [DISK_TEXTURES.RED_STRIPES.value]: diskRedWhiteUrl,
  [DISK_TEXTURES.RED_PURPLE_STRIPES.value]: diskRedWhitePurpleUrl,
  [DISK_TEXTURES.GRID.value]: diskGridUrl,
  [DISK_TEXTURES.GRID_LINES.value]: diskGridlinesUrl,
  [DISK_TEXTURES.ARROWS.value]: diskArrowsUrl,
  [DISK_TEXTURES.YELLOW.value]: diskYellowUrl,
  [DISK_TEXTURES.BLUE.value]: diskBlueUrl,
  [DISK_TEXTURES.BRIGHT.value]: diskBrightUrl,
  [DISK_TEXTURES.CHAOTIC.value]: diskChaoticUrl,
  [DISK_TEXTURES.THERMAL.value]: diskThermalUrl,
}

// Define the available texture options
export const DISK_TEXTURE_OPTIONS = Object.values(DISK_TEXTURES)
