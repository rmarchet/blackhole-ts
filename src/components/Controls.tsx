import React, { useState } from 'react';
import { useBloom } from '../hooks/useBloom';
import { useDiskTexture, DISK_TEXTURE_OPTIONS } from '../hooks/useDiskTexture';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './Controls.css';

export function Controls() {
    const {
        intensity,
        threshold,
        radius,
        setIntensity,
        setThreshold,
        setRadius
    } = useBloom();

    // Use useLocalStorage directly instead of useBloomCheckbox
    const [bloomEnabled, setBloomEnabled] = useLocalStorage<boolean>(
      'bloomEnabled', true, { reloadOnChange: true }
    );

    const {
        selectedTexture,
        setSelectedTexture
    } = useDiskTexture();

    // Use useLocalStorage directly instead of the useBeaming hook
    const [beamingEnabled, setBeamingEnabled] = useLocalStorage<boolean>(
      'beamingEnabled', true, { reloadOnChange: true }
    );

    // Add stars background toggle
    const [starsEnabled, setStarsEnabled] = useLocalStorage<boolean>(
      'starsEnabled', true, { reloadOnChange: true }
    );

    // Add Milky Way background toggle
    const [milkywayEnabled, setMilkywayEnabled] = useLocalStorage<boolean>(
      'milkywayEnabled', true, { reloadOnChange: true }
    );

    // Add orbit toggle
    const [orbitEnabled, setOrbitEnabled] = useLocalStorage<boolean>(
      'orbitEnabled', false, { reloadOnChange: true }
    );

    // State to track which control groups are expanded
    const [expandedGroups, setExpandedGroups] = useState({
        bloom: true,
        diskTexture: true,
        effects: true,
        camera: true
    });

    // Toggle the expanded state of a control group
    const toggleGroup = (groupName: 'bloom' | 'diskTexture' | 'effects' | 'camera') => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    // Handle texture selection
    const handleTextureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        setSelectedTexture(e.target.value);
    };

    return (
        <div className="controls-container">
            <h3 
                className="controls-title" 
                onClick={() => toggleGroup('bloom')}
                style={{ cursor: 'pointer' }}
            >
                Bloom Controls {expandedGroups.bloom ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.bloom && (
                <>
                    <div className="control-group">
                        <label className="checkbox-label">
                            <span>Bloom</span>
                            <input
                                type="checkbox"
                                checked={bloomEnabled}
                                onChange={(e) => setBloomEnabled(e.target.checked)}
                            />
                        </label>
                    </div>

                    {bloomEnabled && (
                        <>
                            <div className="control-group">
                                <label className="slider-label">
                                    <span>Intensity:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={intensity}
                                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                                        className="slider-input"
                                    />
                                    <span>{intensity.toFixed(2)}</span>
                                </label>
                            </div>

                            <div className="control-group">
                                <label className="slider-label">
                                    <span>Threshold:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={threshold}
                                        onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                        className="slider-input"
                                    />
                                    <span>{threshold.toFixed(2)}</span>
                                </label>
                            </div>

                            <div className="control-group">
                                <label className="slider-label">
                                    <span>Radius:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={radius}
                                        onChange={(e) => setRadius(parseFloat(e.target.value))}
                                        className="slider-input"
                                    />
                                    <span>{radius.toFixed(2)}</span>
                                </label>
                            </div>
                        </>
                    )}
                </>
            )}

            <h3 
                className="controls-title" 
                onClick={() => toggleGroup('effects')}
                style={{ cursor: 'pointer' }}
            >
                Effects Controls {expandedGroups.effects ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.effects && (
                <div className="control-group">
                    <label className="checkbox-label">
                        <span>Beaming</span>
                        <input
                            type="checkbox"
                            checked={beamingEnabled}
                            onChange={(e) => setBeamingEnabled(e.target.checked)}
                        />
                    </label>
                </div>
            )}

            <h3 
                className="controls-title" 
                onClick={() => toggleGroup('diskTexture')}
                style={{ cursor: 'pointer' }}
            >
                Textures Controls {expandedGroups.diskTexture ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.diskTexture && (
                <>
                    <div className="control-group">
                        <label className="select-label">
                            <span>Disk:</span>
                            <select 
                                value={selectedTexture}
                                onChange={handleTextureChange}
                                className="select-input"
                            >
                                {DISK_TEXTURE_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="control-group">
                        <label className="checkbox-label">
                            <span>Stars</span>
                            <input
                                type="checkbox"
                                checked={starsEnabled}
                                onChange={(e) => setStarsEnabled(e.target.checked)}
                            />
                        </label>
                    </div>
                    <div className="control-group">
                        <label className="checkbox-label">
                            <span>Milky Way</span>
                            <input
                                type="checkbox"
                                checked={milkywayEnabled}
                                onChange={(e) => setMilkywayEnabled(e.target.checked)}
                            />
                        </label>
                    </div>
                </>
            )}

            <h3 
                className="controls-title" 
                onClick={() => toggleGroup('camera')}
                style={{ cursor: 'pointer' }}
            >
                Camera Controls {expandedGroups.camera ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.camera && (
                <div className="control-group">
                    <label className="checkbox-label">
                        <span>Orbit Camera</span>
                        <input
                            type="checkbox"
                            checked={orbitEnabled}
                            onChange={(e) => setOrbitEnabled(e.target.checked)}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}
