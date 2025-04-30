import React, { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { useBloom } from '../hooks/useBloom'
import { useDiskTexture } from '../hooks/useDiskTexture'
import { DISK_TEXTURE_OPTIONS } from '../constants/textures'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLocalStorageBoolean } from '../hooks/useLocalStorage'
import {
  DEFAULT_EXPANDED_GROUPS,
  BLOOM_DEFAULTS,
  GLOW_DEFAULTS,
  DISK_DEFAULTS,
  BACKGROUND_DEFAULTS,
  CAMERA_DEFAULTS,
  PERFORMANCE_DEFAULTS,
  SLIDER_RANGES,
  RELOAD_CONTROLS_ON_CHANGE,
  type ControlGroup,
  type ExpandedGroups
} from '../constants/controls'
import { BLACK_HOLE, DEFAULTS } from '../constants/blackHole'
import '../styles/Controls.css'

const COLLAPSE_ICONS = {
  DOWN: '▼',
  UP: '▲',
  RIGHT: '▶',
}

interface ControlsProps {
  onFullScreen: () => void
}

export const Controls = ({
  onFullScreen,
}: ControlsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const {
    intensity,
    threshold,
    radius,
    setIntensity,
    setThreshold,
    setRadius
  } = useBloom()

  const [glowIntensity, setGlowIntensity] = useLocalStorage<number>(
    'glowIntensity', GLOW_DEFAULTS.intensity, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const glowEnabled = glowIntensity > 0

  const [bloomEnabled, setBloomEnabled] = useLocalStorage<boolean>(
    'bloomEnabled', BLOOM_DEFAULTS.enabled, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const {
    selectedTexture,
    setSelectedTexture
  } = useDiskTexture()

  const [beamingEnabled, setBeamingEnabled] = useLocalStorage<boolean>(
    'beamingEnabled', DISK_DEFAULTS.beaming, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [starsEnabled, setStarsEnabled] = useLocalStorage<boolean>(
    'starsEnabled', BACKGROUND_DEFAULTS.stars, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [milkywayEnabled, setMilkywayEnabled] = useLocalStorage<boolean>(
    'milkywayEnabled', BACKGROUND_DEFAULTS.milkyway, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [orbitEnabled, setOrbitEnabled] = useLocalStorage<boolean>(
    'orbitEnabled', CAMERA_DEFAULTS.orbit, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [performanceMode, setPerformanceMode] = useLocalStorage<boolean>(
    'performanceMode', PERFORMANCE_DEFAULTS.enabled, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [diskIntensity, setDiskIntensity] = useLocalStorage<number>(
    'diskIntensity', DISK_DEFAULTS.intensity, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [dopplerShiftEnabled, setDopplerShiftEnabled] = useLocalStorage<boolean>(
    'dopplerShiftEnabled', DISK_DEFAULTS.dopplerShift, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [blackHoleRotation, setBlackHoleRotation] = useLocalStorage<number>(
    'blackHoleRotation', DEFAULTS.BLACK_HOLE.ROTATION, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [jetEnabled, setJetEnabled] = useLocalStorageBoolean(
    'jetEnabled', DEFAULTS.BLACK_HOLE.RELATIVISTIC_JET, { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )

  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>(DEFAULT_EXPANDED_GROUPS)

  // Add localStorage for disk inner radius and width
  const [diskIn, setDiskIn] = useLocalStorage<number>(
    'diskIn',
    SLIDER_RANGES.diskInnerRadius.default,
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE }
  )
  const [diskWidth, setDiskWidth] = useLocalStorage<number>(
    'diskWidth', 
    SLIDER_RANGES.diskWidth.default, 
    { reloadOnChange: RELOAD_CONTROLS_ON_CHANGE },
  )

  const toggleGroup = (groupName: ControlGroup) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  // Handle texture selection
  const handleTextureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    setSelectedTexture(e.target.value)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Clear all localStorage values
    localStorage.clear()
        
    // Reset all values to defaults
    setGlowIntensity(GLOW_DEFAULTS.intensity)
    setBloomEnabled(BLOOM_DEFAULTS.enabled)
    setBeamingEnabled(DISK_DEFAULTS.beaming)
    setStarsEnabled(BACKGROUND_DEFAULTS.stars)
    setMilkywayEnabled(BACKGROUND_DEFAULTS.milkyway)
    setOrbitEnabled(CAMERA_DEFAULTS.orbit)
    setPerformanceMode(PERFORMANCE_DEFAULTS.enabled)
    setDiskIntensity(DISK_DEFAULTS.intensity)
    setDopplerShiftEnabled(DISK_DEFAULTS.dopplerShift)
    setIntensity(SLIDER_RANGES.bloomIntensity.default)
    setThreshold(SLIDER_RANGES.bloomThreshold.default)
    setRadius(SLIDER_RANGES.bloomRadius.default)
    setBlackHoleRotation(DEFAULTS.BLACK_HOLE.ROTATION)
    setJetEnabled(DEFAULTS.BLACK_HOLE.RELATIVISTIC_JET)
        
    // Reset expanded groups state
    setExpandedGroups(DEFAULT_EXPANDED_GROUPS)
        
    // Force page reload to ensure all components update
    window.location.reload()
  }

  return (
    <div className={`controls-container ${isCollapsed ? 'collapsed' : ''}`}>
      <Tooltip id="controls-tooltip" className='controls-tooltip' />
      <div className="controls-header">
        <div className="collapse-button" onClick={() => setIsCollapsed(!isCollapsed)}>
          <img src="/icon.svg" alt="App Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
          <span>Controls</span>
          {isCollapsed ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.UP}
        </div>
      </div>

      <div className={`controls-content ${isCollapsed ? 'hidden' : ''}`}>
        <h3 
          className="controls-title" 
          onClick={() => toggleGroup('performance')}
        >
          <span>Performance Controls</span> {expandedGroups.performance ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
        </h3>
                
        {expandedGroups.performance && (
          <div className="control-group">
            <label className="checkbox-label" data-tooltip-id="controls-tooltip" data-tooltip-content="Reduces quality to improve performance">
              <span>Performance Mode</span>
              <input
                type="checkbox"
                checked={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.checked)}
              />
            </label>
          </div>
        )}

        <h3 
          className="controls-title bloom-controls-title" 
          onClick={() => toggleGroup('bloom')}
        >
          <span>Bloom Controls</span> {expandedGroups.bloom ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
        </h3>
                
        {expandedGroups.bloom && (
          <div className='bloom-controls'>
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
          </div>
        )}

        <h3 
          className="controls-title" 
          onClick={() => toggleGroup('effects')}
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
              <label className="checkbox-label" data-tooltip-id="controls-tooltip" data-tooltip-content="Makes one side brighter and the other dimmer">
                <span>Beaming</span>
                <input
                  type="checkbox"
                  checked={beamingEnabled}
                  onChange={(e) => setBeamingEnabled(e.target.checked)}
                />
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox-label" data-tooltip-id="controls-tooltip" data-tooltip-content="Shows red and blue shifts in the accretion disk">
                <span>Doppler Shift</span>
                <input
                  type="checkbox"
                  checked={dopplerShiftEnabled}
                  onChange={(e) => setDopplerShiftEnabled(e.target.checked)}
                />
              </label>
            </div>

            <div className="control-group">
              <label className="checkbox-label" data-tooltip-id="controls-tooltip" data-tooltip-content="Toggle a relativistic jet emitted from the poles">
                <span>Relativistic Jet</span>
                <input
                  type="checkbox"
                  checked={jetEnabled}
                  onChange={e => setJetEnabled(e.target.checked)}
                />
              </label>
            </div>

            <div className="control-group">
              <label className="slider-label" data-tooltip-id="controls-tooltip" data-tooltip-html="Controls the spin of the black hole<br/>(0 = non-rotating, 0.998 = maximum rotation)">
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
            </div>
          </>
        )}

        <h3 
          className="controls-title" 
          onClick={() => toggleGroup('disk')}
        >
          <span>Disk Controls</span> {expandedGroups.disk ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
        </h3>
        {
          expandedGroups.disk && (
            <>                        
              {selectedTexture !== 'no_disk' && (
                <div className="control-group">
                  <label className="slider-label">
                    <span>Disk Intensity:</span>
                    <input
                      type="range"
                      min={SLIDER_RANGES.diskIntensity.min}
                      max={SLIDER_RANGES.diskIntensity.max}
                      step={SLIDER_RANGES.diskIntensity.step}
                      value={diskIntensity}
                      onChange={(e) => setDiskIntensity(parseFloat(e.target.value))}
                      className="slider-input"
                    />
                    <span>{diskIntensity?.toFixed(2)}</span>
                  </label>
                </div>
              )}

              {/* Disk geometry controls */}
              <div className="control-group">
                <label className="slider-label">
                  <span>Disk Inner Radius:</span>
                  <input
                    type="range"
                    min={SLIDER_RANGES.diskInnerRadius.min}
                    max={SLIDER_RANGES.diskInnerRadius.max}
                    step={SLIDER_RANGES.diskInnerRadius.step}
                    value={diskIn}
                    onChange={e => setDiskIn(parseFloat(e.target.value))}
                    className="slider-input"
                  />
                  <span>{diskIn.toFixed(2)}</span>
                </label>
              </div>
              <div className="control-group">
                <label className="slider-label">
                  <span>Disk Width:</span>
                  <input
                    type="range"
                    min={SLIDER_RANGES.diskWidth.min}
                    max={SLIDER_RANGES.diskWidth.max}
                    step={SLIDER_RANGES.diskWidth.step}
                    value={diskWidth}
                    onChange={e => setDiskWidth(parseFloat(e.target.value))}
                    className="slider-input"
                  />
                  <span>{diskWidth.toFixed(2)}</span>
                </label>
              </div>
            </>
          )
        }

        <h3 
          className="controls-title" 
          onClick={() => toggleGroup('textures')}
        >
          <span>Textures Controls</span> {expandedGroups.textures ? COLLAPSE_ICONS.DOWN : COLLAPSE_ICONS.RIGHT}
        </h3>
                
        {expandedGroups.textures && (
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
      <footer className="controls-footer">
        <button 
          onClick={handleReset}
          className="button reset-button"
          title="Reset all settings to their default values"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={onFullScreen}
          className="button fullscreen-button"
          title="Toggle Full Screen"
        >
          Toggle Full screen
        </button>
      </footer>
    </div>
  )
}
