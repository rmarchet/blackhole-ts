import { useLocalStorageBoolean, useLocalStorageNumber } from './useLocalStorage'

export function useBloom() {
  // Use the generic localStorage hooks for all bloom settings
  const [enabled, setEnabled] = useLocalStorageBoolean('bloomEnabled', true)
  const [intensity, setIntensity] = useLocalStorageNumber('bloomIntensity', 1.5)
  const [threshold, setThreshold] = useLocalStorageNumber('bloomThreshold', 0.3)
  const [radius, setRadius] = useLocalStorageNumber('bloomRadius', 0.8)

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
