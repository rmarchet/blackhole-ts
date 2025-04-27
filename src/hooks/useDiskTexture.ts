import { useLocalStorageString } from './useLocalStorage'
import { DISK_TEXTURES } from '../constants/textures'

export function useDiskTexture() {
  // Use the generic localStorage hook for string values with page reload enabled
  const [selectedTexture, setSelectedTexture] = useLocalStorageString(
    'diskTexture', 
    DISK_TEXTURES.NATURAL.value, 
    {
      reloadOnChange: true,
      reloadDelay: 100,
    })
  
  // Helper function to check if we're using stripes texture
  const useStripes = selectedTexture === DISK_TEXTURES.RED_PURPLE_STRIPES.value
  
  // Helper function to check if we're using no texture (blackbody)
  const useBlackbody = selectedTexture === DISK_TEXTURES.NONE.value
  
  // Helper function to check if we're hiding the disk completely
  const hideDisk = selectedTexture === DISK_TEXTURES.NO_DISK.value
  
  return {
    selectedTexture,
    setSelectedTexture,
    useStripes,
    useBlackbody,
    hideDisk,
  }
} 
