# Black Hole Visualization

A real-time 3D visualization of a black hole using React, Three.js, and GLSL shaders. This project simulates gravitational lensing, accretion disk effects, and relativistic beaming around a black hole, inspired by scientifically accurate black hole renderings.

<img src="public/blackhole.svg" width="200" alt="Black Hole Visualization" />

## Screenshot

<img src="screenshot.jpg" width="400" alt="Black Hole Visualization Screenshot" />

## Features

- Real-time gravitational lensing simulation
- Accretion disk with multiple texture options
  - natural
  - arrows
  - stripes
  - grid
  - blue
- Doppler shift effect
- Relativistic beaming effect
- Photon ring at the event horizon
- Rotation to simulate a Kerr black hole
  - frame dragging effect
- Customizable glow effects
- Interactive camera controls with orbit mode
- Performance quality adjustment
- Post-processing effects:
  - Bloom with adjustable intensity
  - Glow with customizable parameters
- Background options:
  - Star field with proper parallax
  - Milky Way background
- Persistent settings using local storage

## Technologies Used

- React + TypeScript
- Three.js
- React Three Fiber
- GLSL Shaders
- Vite
- Local Storage for persistent settings

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rmarchet/blackhole-ts.git
cd blackhole-ts
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Controls

### Camera Controls
- Left-click + drag: Rotate camera
- Right-click + drag: Pan camera
- Mouse wheel: Zoom in/out
- Toggle orbit mode for automatic camera rotation

### Visual Controls
- Performance Quality:
  - High quality: More accurate ray marching steps
  - Low quality: Better performance
- Bloom Effect:
  - Adjustable intensity
  - Configurable threshold and radius
- Glow Effect:
  - Toggle glow
  - Adjustable intensity
- Accretion Disk:
  - Multiple texture options
  - Adjustable intensity
  - Toggle Doppler shift
- Background:
  - Toggle star field
  - Toggle Milky Way
  - Adjustable background intensity

## How It Works

The visualization uses advanced ray marching techniques in GLSL shaders to simulate:
- [Gravitational lensing](Docs/Gravitational%20Lensing.md) around the black hole using geodesic calculations
- Accretion disk with realistic [Doppler and relativistic effects](Docs/Doppler%20Shift.md)
- Photon ring at the event horizon
- Relativistic beaming and light aberration
- Star field background with proper parallax
- Post-processing effects for enhanced visual quality



## Project Structure

- `src/components/`: React components including the main BlackHole component
- `src/shaders/`: GLSL shader code for the visualization
- `src/hooks/`: Custom React hooks for state management
- `src/constants/`: Configuration and constant values
- `src/assets/`: Textures and static assets

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the work of Kip Thorne and the visual effects team of "Interstellar"
- Based on scientific papers about black hole visualization
- Thanks to the Three.js and React Three Fiber communities
