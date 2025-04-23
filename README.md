# Black Hole Visualization

A real-time 3D visualization of a black hole using React, Three.js, and GLSL shaders. This project simulates gravitational lensing, accretion disk effects, and relativistic beaming around a black hole.

<img src="public/blackhole.svg" width="200" alt="Black Hole Visualization" />

## Screenshot

<img src="screenshot.jpg" width="400" alt="Black Hole Visualization Screenshot" />

## Features

- Real-time gravitational lensing simulation
- Accretion disk with doppler shift effects
- Relativistic beaming
- Interactive camera controls
- Performance quality adjustment
- Bloom effect toggle
- Star field background

## Technologies Used

- React + TypeScript
- Three.js
- React Three Fiber
- GLSL Shaders
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
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

- Left-click + drag: Rotate camera
- Right-click + drag: Pan camera
- Mouse wheel: Zoom in/out
- Use the control panel to:
  - Adjust performance quality
  - Toggle bloom effect

## How It Works

The visualization uses ray marching techniques in GLSL shaders to simulate:
- Gravitational lensing around the black hole
- Accretion disk with doppler shift effects
- Relativistic beaming
- Star field background with proper parallax

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on the work of [Your Reference Here]
- Inspired by real astronomical observations and theoretical physics
