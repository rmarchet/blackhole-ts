import React, { useState } from 'react';
import { useBloom } from '../hooks/useBloom';
import { useBloomCheckbox } from '../hooks/useBloomCheckbox';
import { useDiskTexture, DISK_TEXTURE_OPTIONS } from '../hooks/useDiskTexture';
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

    const {
        enabled,
        setEnabled
    } = useBloomCheckbox();

    const {
        selectedTexture,
        setSelectedTexture
    } = useDiskTexture();

    // State to track which control groups are expanded
    const [expandedGroups, setExpandedGroups] = useState({
        bloom: true,
        diskTexture: true
    });

    // Toggle the expanded state of a control group
    const toggleGroup = (groupName: 'bloom' | 'diskTexture') => {
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
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                            />
                            Enable Bloom
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="slider-label">
                            Intensity: {intensity.toFixed(2)}
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={intensity}
                                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                                className="slider-input"
                            />
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="slider-label">
                            Threshold: {threshold.toFixed(2)}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="slider-input"
                            />
                        </label>
                    </div>

                    <div className="control-group">
                        <label className="slider-label">
                            Radius: {radius.toFixed(2)}
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={radius}
                                onChange={(e) => setRadius(parseFloat(e.target.value))}
                                className="slider-input"
                            />
                        </label>
                    </div>
                </>
            )}

            <h3 
                className="controls-title" 
                onClick={() => toggleGroup('diskTexture')}
                style={{ cursor: 'pointer' }}
            >
                Disk Controls {expandedGroups.diskTexture ? '▼' : '▶'}
            </h3>
            
            {expandedGroups.diskTexture && (
                <div className="control-group">
                    <label className="select-label">
                        Disk Texture:
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
            )}
        </div>
    );
}
