# TO DO

There are several areas for improvement.

## Docs

- [ ] Add docs for Relativistic Beaming
- [ ] GitHub tab for docs
- [ ] Consider moving docs files to GitHub Wiki

## Camera and Scene

- [ ] Fix the "Orbit Camera" mode
  - [x] Enable the disk rotation
  - [x] Reduce the zoom level
  - [ ] Enable dragging controls
- [ ] Add Keyboard navigation for camera movement
- [x] Reduce the `maxDistance`

## Effects

- [ ] Fix the Blooming controls
  - [ ] Implement a realistic blooming aroung the accretion disk
- [ ] Fix the accretion disk transparency
- [ ] Make the Photon Ring more visible with rotating black hole
- [x] Make the Doppler shift more visible
- [ ] Make the Relativistic Beaming more visible and better positioned
- [ ] Add chromatic aberration near the event horizon
- [ ] Improve the Relativistic Jet visualization
- [ ] Add gravitational time dilation visualization effects

## Textures
- [ ] Fix the "Grid lines" texture
- [ ] Fix the "Thermal" simulation with realistic temperature colors
- [ ] Fix the "No texture" Doppler effect

# Controls
- [ ] Remember the collapsed/expanded state
- [ ] Add tooltips
- [ ] Keyboard navigation

# General App
- [ ] allow live refresh of the state without page reloads
- [ ] hot-reload in development server sometimes stops the app (needs refresh)
- [ ] Split `BlackHole.tsx` business logic from JSX
- [ ] Split `main.glsl` into separate files
  - [ ] The main fragment shader is quite complex with many calculations in the ray marching loop
  - [ ] Could split some calculations into separate functions/files for better organization
  - [ ] Consider adding early ray termination conditions
  - [ ] Could add level-of-detail (LOD) for distant views
  - [x] Move the jet rendering logic to a separate GLSL file
  - [ ] Move the disk rendering logic to a separate file
- [ ] Better constants organisation