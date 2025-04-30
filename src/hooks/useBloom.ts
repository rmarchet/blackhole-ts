import { useLocalStorage } from './useLocalStorage'

export function useBloom() {
  // Use the generic localStorage hooks for all bloom settings
  const [enabled, setEnabled] = useLocalStorage<boolean>('bloomEnabled', true, { reloadOnChange: true })
  const [intensity, setIntensity] = useLocalStorage<number>('bloomIntensity', 1.5, { reloadOnChange: true })
  const [threshold, setThreshold] = useLocalStorage<number>('bloomThreshold', 0.3, { reloadOnChange: true })
  const [radius, setRadius] = useLocalStorage<number>('bloomRadius', 0.8, { reloadOnChange: true })

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
