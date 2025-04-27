import React, { useState } from 'react';
import { useBloom } from '../hooks/useBloom';
import { useDiskTexture } from '../hooks/useDiskTexture';
import { DISK_TEXTURE_OPTIONS } from '../constants/textures';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLocalStorageBoolean } from '../hooks/useLocalStorage';
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
import { BLACK_HOLE, DEFAULTS } from '../constants/blackHole';
import './Controls.css';

const COLLAPSE_ICONS = {
  DOWN: '▼',
  UP: '▲',
  RIGHT: '▶',
}


export function Controls() {
    const [isCollapsed, setIsCollapsed] = useState(false);
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

    const [blackHoleRotation, setBlackHoleRotation] = useLocalStorage<number>(
        'blackHoleRotation', DEFAULTS.BLACK_HOLE.ROTATION, { reloadOnChange: true }
    );

    const [jetEnabled, setJetEnabled] = useLocalStorageBoolean(
        'jetEnabled', DEFAULTS.BLACK_HOLE.RELATIVISTIC_JET, { reloadOnChange: true }
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

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Clear all localStorage values
        localStorage.clear();
        
        // Reset all values to defaults
        setGlowIntensity(GLOW_DEFAULTS.intensity);
        setBloomEnabled(BLOOM_DEFAULTS.enabled);
        setBeamingEnabled(DISK_DEFAULTS.beaming);
        setStarsEnabled(BACKGROUND_DEFAULTS.stars);
        setMilkywayEnabled(BACKGROUND_DEFAULTS.milkyway);
        setOrbitEnabled(CAMERA_DEFAULTS.orbit);
        setPerformanceMode(PERFORMANCE_DEFAULTS.enabled);
        setDiskIntensity(DISK_DEFAULTS.intensity);
        setDopplerShiftEnabled(DISK_DEFAULTS.dopplerShift);
        setIntensity(SLIDER_RANGES.bloomIntensity.default);
        setThreshold(SLIDER_RANGES.bloomThreshold.default);
        setRadius(SLIDER_RANGES.bloomRadius.default);
        setBlackHoleRotation(DEFAULTS.BLACK_HOLE.ROTATION);
        setJetEnabled(DEFAULTS.BLACK_HOLE.RELATIVISTIC_JET);
        
        // Reset expanded groups state
        setExpandedGroups(DEFAULT_EXPANDED_GROUPS);
        
        // Force page reload to ensure all components update
        window.location.reload();
    };

    return (
        <div className={`controls-container ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="controls-header">
              <div 
                className="collapse-button"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <img src="/icon.svg" alt="App Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
                <span>Controls</span>

                <button 
                  onClick={handleReset}
                  className="reset-button"
                  title="Reset all settings to their default values"
                >
                  Reset to Defaults
                </button>
                {isCollapsed ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.UP}
              </div>
            </div>

            <div className={`controls-content ${isCollapsed ? 'hidden' : ''}`}>
                <h3 
                  className="controls-title" 
                  onClick={() => toggleGroup('performance')}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Performance Controls</span> {expandedGroups.performance ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
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
                    <span>Bloom Controls</span> {expandedGroups.bloom ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
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
                  <span>Effects Controls</span> {expandedGroups.effects ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
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

                        <div className="control-group">
                            <label className="checkbox-label">
                                <span>Relativistic Jet</span>
                                <input
                                    type="checkbox"
                                    checked={jetEnabled}
                                    onChange={e => setJetEnabled(e.target.checked)}
                                />
                            </label>
                            <div className="control-description">
                                Show or hide the relativistic jet
                            </div>
                        </div>

                        <div className="control-group">
                            <label className="slider-label">
                                <span>Black Hole Rotation:</span>
                                <input
                                    type="range"
                                    min={BLACK_HOLE.ROTATION.MIN}
                                    max={BLACK_HOLE.ROTATION.MAX}
                                    step={0.001}
                                    value={blackHoleRotation}
                                    onChange={(e) => setBlackHoleRotation(parseFloat(e.target.value))}
                                    className="slider-input"
                                />
                                <span>{blackHoleRotation.toFixed(3)}</span>
                            </label>
                            <div className="control-description">
                              Controls the spin of the black hole (0 = non-rotating, 0.998 = maximum rotation)
                            </div>
                        </div>
                    </>
                )}

                <h3 
                  className="controls-title" 
                  onClick={() => toggleGroup('diskTexture')}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Textures Controls</span> {expandedGroups.diskTexture ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
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
                  <span>Camera Controls</span> {expandedGroups.camera ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
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
        </div>
    );
}
