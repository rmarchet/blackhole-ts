import React, { useState } from 'react';
import { useBloom } from '../hooks/useBloom';
import { useDiskTexture, DISK_TEXTURE_OPTIONS } from '../hooks/useDiskTexture';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    DEFAULT_EXPANDED_GROUPS,
    BLOOM_DEFAULTS,
    GLOW_DEFAULTS,
    DISK_DEFAULTS,
    BACKGROUND_DEFAULTS,
    CAMERA_DEFAULTS,
    PERFORMANCE_DEFAULTS,
    SLIDER_RANGES,
    type ControlGroup,
    type ExpandedGroups
} from '../constants/controls';
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

    const [glowIntensity, setGlowIntensity] = useLocalStorage<number>(
        'glowIntensity', GLOW_DEFAULTS.intensity, { reloadOnChange: true }
    );

    const glowEnabled = glowIntensity > 0;

    const [bloomEnabled, setBloomEnabled] = useLocalStorage<boolean>(
        'bloomEnabled', BLOOM_DEFAULTS.enabled, { reloadOnChange: true }
    );

    const {
        selectedTexture,
        setSelectedTexture
    } = useDiskTexture();

    const [beamingEnabled, setBeamingEnabled] = useLocalStorage<boolean>(
        'beamingEnabled', DISK_DEFAULTS.beaming, { reloadOnChange: true }
    );

    const [starsEnabled, setStarsEnabled] = useLocalStorage<boolean>(
        'starsEnabled', BACKGROUND_DEFAULTS.stars, { reloadOnChange: true }
    );

    const [milkywayEnabled, setMilkywayEnabled] = useLocalStorage<boolean>(
        'milkywayEnabled', BACKGROUND_DEFAULTS.milkyway, { reloadOnChange: true }
    );

    const [orbitEnabled, setOrbitEnabled] = useLocalStorage<boolean>(
        'orbitEnabled', CAMERA_DEFAULTS.orbit, { reloadOnChange: true }
    );

    const [performanceMode, setPerformanceMode] = useLocalStorage<boolean>(
        'performanceMode', PERFORMANCE_DEFAULTS.enabled, { reloadOnChange: true }
    );

    const [diskIntensity, setDiskIntensity] = useLocalStorage<number>(
        'diskIntensity', DISK_DEFAULTS.intensity, { reloadOnChange: true }
    );

    const [dopplerShiftEnabled, setDopplerShiftEnabled] = useLocalStorage<boolean>(
        'dopplerShiftEnabled', DISK_DEFAULTS.dopplerShift, { reloadOnChange: true }
    );

    const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>(DEFAULT_EXPANDED_GROUPS);

    const toggleGroup = (groupName: ControlGroup) => {
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
                onClick={() => toggleGroup('performance')}
                style={{ cursor: 'pointer' }}
            >
                Performance Controls {expandedGroups.performance ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.performance && (
                <div className="control-group">
                    <label className="checkbox-label">
                        <span>Performance Mode</span>
                        <input
                            type="checkbox"
                            checked={performanceMode}
                            onChange={(e) => setPerformanceMode(e.target.checked)}
                        />
                    </label>
                    <div className="control-description">
                        Reduces quality to improve performance
                    </div>
                </div>
            )}

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
                                        min={SLIDER_RANGES.bloomIntensity.min}
                                        max={SLIDER_RANGES.bloomIntensity.max}
                                        step={SLIDER_RANGES.bloomIntensity.step}
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
                                        min={SLIDER_RANGES.bloomThreshold.min}
                                        max={SLIDER_RANGES.bloomThreshold.max}
                                        step={SLIDER_RANGES.bloomThreshold.step}
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
                                        min={SLIDER_RANGES.bloomRadius.min}
                                        max={SLIDER_RANGES.bloomRadius.max}
                                        step={SLIDER_RANGES.bloomRadius.step}
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
                <>

                    <div className="control-group">
                        <label className="checkbox-label">
                            <span>Glow</span>
                            <input
                                type="checkbox"
                                checked={glowEnabled}
                                onChange={() => {
                                    setGlowIntensity(glowEnabled ? 0 : 1)
                                }}
                            />
                        </label>
                    </div>

                    {glowEnabled && (
                        <div className="control-group">
                            <label className="slider-label">
                                <span>Glow Intensity:</span>
                                <input
                                    type="range"
                                    min={GLOW_DEFAULTS.min}
                                    max={GLOW_DEFAULTS.max}
                                    step={GLOW_DEFAULTS.step}
                                    value={glowIntensity}
                                    onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
                                    className="slider-input"
                                />
                                <span>{(glowIntensity ?? 0).toFixed(2)}</span>
                            </label>
                        </div>
                    )}

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
                    <div className="control-group">
                        <label className="checkbox-label">
                            <span>Doppler Shift</span>
                            <input
                                type="checkbox"
                                checked={dopplerShiftEnabled}
                                onChange={(e) => setDopplerShiftEnabled(e.target.checked)}
                            />
                        </label>
                        <div className="control-description">
                            Shows red and blue shifts in the accretion disk
                        </div>
                    </div>
                </>
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
                    
                    {selectedTexture !== 'no_disk' && (
                        <div className="control-group">
                            <label className="slider-label">
                                <span>Disk Brightness:</span>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="2.0"
                                    step="0.1"
                                    value={diskIntensity}
                                    onChange={(e) => setDiskIntensity(parseFloat(e.target.value))}
                                    className="slider-input"
                                />
                                <span>{diskIntensity?.toFixed(2)}</span>
                            </label>
                        </div>
                    )}
                    
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
