import starUrl from '../assets/star_noise.png';
import milkywayUrl from '../assets/milkyway.jpg';
import diskUrl from '../assets/accretion_disk.png';
import diskUrl00 from '../assets/accretion_disk00.png';
import diskUrl01 from '../assets/accretion_disk01.png';
import diskUrl02 from '../assets/accretion_disk02.png';
import diskUrl03 from '../assets/accretion_disk03.png';
import diskUrl04 from '../assets/accretion_disk04.png';

export const IMAGES = {
  starUrl,
  milkywayUrl,
  diskUrl,
  diskUrl00,
  diskUrl01,
  diskUrl02,
  diskUrl03,
  diskUrl04,
}

export const DISK_TEXTURES = {
  NO_DISK: { value: 'no_disk', label: 'No Disk' },
  NONE: { value: 'none', label: 'No Texture (Blackbody)' },
  NATURAL: { value: 'accretion_disk.png', label: 'Natural' },
  RED_STRIPES: { value: 'accretion_disk00.png', label: 'Red stripes' },
  RED_PURPLE_STRIPES: { value: 'accretion_disk01.png', label: 'Red-Purple stripes' },
  ARROWS: { value: 'accretion_disk02.png', label: 'Arrows' },
  YELLOW: { value: 'accretion_disk03.png', label: 'Yellow' },
  BLUE: { value: 'accretion_disk04.png', label: 'Blue' },
}

// Define the available texture options
export const DISK_TEXTURE_OPTIONS = Object.values(DISK_TEXTURES)
