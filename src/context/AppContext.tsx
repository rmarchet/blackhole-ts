import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BloomState {
    enabled: boolean;
    intensity: number;
    threshold: number;
    radius: number;
}

interface DiskTextureState {
    useStripes: boolean;
}

interface AppContextType {
    bloom: BloomState;
    setBloomEnabled: (enabled: boolean) => void;
    setBloomIntensity: (intensity: number) => void;
    setBloomThreshold: (threshold: number) => void;
    setBloomRadius: (radius: number) => void;
    diskTexture: DiskTextureState;
    setDiskTextureStripes: (useStripes: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [bloom, setBloom] = useState<BloomState>({
        enabled: true,
        intensity: 1.5,
        threshold: 0.3,
        radius: 0.8
    });

    const [diskTexture, setDiskTexture] = useState<DiskTextureState>({
        useStripes: false
    });

    const setBloomEnabled = (enabled: boolean) => {
        setBloom(prev => ({ ...prev, enabled }));
    };

    const setBloomIntensity = (intensity: number) => {
        setBloom(prev => ({ ...prev, intensity }));
    };

    const setBloomThreshold = (threshold: number) => {
        setBloom(prev => ({ ...prev, threshold }));
    };

    const setBloomRadius = (radius: number) => {
        setBloom(prev => ({ ...prev, radius }));
    };

    const setDiskTextureStripes = (useStripes: boolean) => {
        setDiskTexture(prev => ({ ...prev, useStripes }));
    };

    const value = {
        bloom,
        setBloomEnabled,
        setBloomIntensity,
        setBloomThreshold,
        setBloomRadius,
        diskTexture,
        setDiskTextureStripes
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
} 