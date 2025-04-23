import { useApp } from '../context/AppContext';

export function useBloom() {
    const { bloom, setBloomEnabled, setBloomIntensity, setBloomThreshold, setBloomRadius } = useApp();

    return {
        enabled: bloom.enabled,
        intensity: bloom.intensity,
        threshold: bloom.threshold,
        radius: bloom.radius,
        setEnabled: setBloomEnabled,
        setIntensity: setBloomIntensity,
        setThreshold: setBloomThreshold,
        setRadius: setBloomRadius
    };
} 