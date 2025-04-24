import { useLocalStorageString } from './useLocalStorage';

// Define the available texture options
export const DISK_TEXTURE_OPTIONS = [
  { value: 'no_disk', label: 'No Disk' },
  { value: 'none', label: 'No Texture (Blackbody)' },
  { value: 'accretion_disk.png', label: 'Natural' },
  { value: 'accretion_disk00.png', label: 'Red stripes' },
  { value: 'accretion_disk01.png', label: 'Red-Purple stripes' },
  { value: 'accretion_disk02.png', label: 'Arrows' }
];

export function useDiskTexture() {
    // Use the generic localStorage hook for string values with page reload enabled
    const [selectedTexture, setSelectedTexture] = useLocalStorageString('diskTexture', 'accretion_disk.png', {
        reloadOnChange: true,
        reloadDelay: 100
    });
    
    // Helper function to check if we're using stripes texture
    const useStripes = selectedTexture === 'accretion_disk01.png';
    
    // Helper function to check if we're using no texture (blackbody)
    const useBlackbody = selectedTexture === 'none';
    
    // Helper function to check if we're hiding the disk completely
    const hideDisk = selectedTexture === 'no_disk';
    
    return {
        selectedTexture,
        setSelectedTexture,
        useStripes,
        useBlackbody,
        hideDisk,
        // For backward compatibility
        setUseStripes: (value: boolean) => {
            setSelectedTexture(value ? 'accretion_disk01.png' : 'accretion_disk.png');
        }
    };
} 