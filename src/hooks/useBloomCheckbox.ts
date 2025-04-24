import { useLocalStorageBoolean } from './useLocalStorage';

export const useBloomCheckbox = () => {
    // Use the generic localStorage hook for boolean values with page reload enabled
    const [enabled, setEnabled] = useLocalStorageBoolean('bloomEnabled', true, {
        reloadOnChange: true,
        reloadDelay: 100
    });

    return { enabled, setEnabled };
}; 