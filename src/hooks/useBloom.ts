import { useLocalStorage } from './useLocalStorage'
import { RELOAD_CONTROLS_ON_CHANGE } from '../constants/controls'
import { DEFAULTS } from '../constants/blackHole'

export function useBloom() {
  // Use the generic localStorage hooks for all bloom settings
  const [enabled, setEnabled] = useLocalStorage<boolean>('bloomEnabled', DEFAULTS.BLOOM.ENABLED, 
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE })
  const [intensity, setIntensity] = useLocalStorage<number>('bloomIntensity', DEFAULTS.BLOOM.INTENSITY,
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE })
  const [threshold, setThreshold] = useLocalStorage<number>('bloomThreshold', DEFAULTS.BLOOM.THRESHOLD, 
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE })
  const [radius, setRadius] = useLocalStorage<number>('bloomRadius', DEFAULTS.BLOOM.RADIUS, 
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE })

  return {
    enabled,
    intensity,
    threshold,
    radius,
    setEnabled,
    setIntensity,
    setThreshold,
    setRadius
  }
} 
