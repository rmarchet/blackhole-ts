import { useState, useEffect } from 'react';

export function useDiskTexture() {
    // Initialize state from localStorage or default to false
    const [useStripes, setUseStripesState] = useState(() => {
        const savedValue = localStorage.getItem('useStripes');
        return savedValue !== null ? savedValue === 'true' : false;
    });
    
    // Update localStorage when state changes
    useEffect(() => {
        localStorage.setItem('useStripes', useStripes.toString());
    }, [useStripes]);
    
    // Wrapper function to update state and reload the page
    const setUseStripes = (value: boolean) => {
        setUseStripesState(value);
        localStorage.setItem('useStripes', value.toString());
        // Reload the page after a short delay to ensure localStorage is updated
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return {
        useStripes,
        setUseStripes
    };
} 