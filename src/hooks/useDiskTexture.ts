import { useLocalStorage } from './useLocalStorage'
import { DISK_TEXTURES } from '../constants/textures'
import { DISK_DEFAULTS, RELOAD_CONTROLS_ON_CHANGE } from '../constants/controls'

export function useDiskTexture() {
  // Use the generic localStorage hook for string values with page reload enabled
  const [selectedTexture, setSelectedTexture] = useLocalStorage<string>(
    'diskTexture', 
    DISK_DEFAULTS.diskTexture, 
    {
      reloadOnChange: RELOAD_CONTROLS_ON_CHANGE,
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
