import { useState, useEffect } from 'react';

export function useBloomCheckbox() {
    // Initialize state from localStorage or default to true
    const [enabled, setEnabledState] = useState(() => {
        const savedValue = localStorage.getItem('bloomEnabled');
        return savedValue !== null ? savedValue === 'true' : true;
    });
    
    // Update localStorage when state changes
    useEffect(() => {
        localStorage.setItem('bloomEnabled', enabled.toString());
    }, [enabled]);
    
    // Wrapper function to update state and reload the page
    const setEnabled = (value: boolean) => {
        setEnabledState(value);
        localStorage.setItem('bloomEnabled', value.toString());
        // Reload the page after a short delay to ensure localStorage is updated
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return {
        enabled,
        setEnabled
    };
} 