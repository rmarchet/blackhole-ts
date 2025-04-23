import React from 'react';
import { useBloom } from '../hooks/useBloom';
import { useBloomCheckbox } from '../hooks/useBloomCheckbox';
import { useDiskTexture } from '../hooks/useDiskTexture';
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
        useStripes,
        setUseStripes
    } = useDiskTexture();

    // Handle striped texture toggle specifically
    const handleStripedTextureToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setUseStripes(e.target.checked);
    };

    return (
        <div className="controls-container">
            <h3 className="controls-title">Bloom Controls</h3>
            
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

            <h3 className="controls-title">Disk Texture Controls</h3>
            
            <div className="control-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={useStripes}
                        onChange={handleStripedTextureToggle}
                    />
                    Use Striped Disk Texture
                </label>
            </div>
        </div>
    );
}
