# Black Hole Visualization

<!-- vscode-markdown-toc -->
- 1. [Screenshot](#Screenshot)
- 2. [Features](#Features)
- 3. [Technologies Used](#TechnologiesUsed)
- 4. [Getting Started](#GettingStarted)
  - 4.1. [Prerequisites](#Prerequisites)
  - 4.2. [Installation](#Installation)
- 5. [Controls](#Controls)
	- 5.1. [Camera Controls](#CameraControls)
	- 5.2. [Visual Controls](#VisualControls)
- 6. [How It Works](#HowItWorks)
- 7. [Project Structure](#ProjectStructure)
- 8. [License](#License)
- 9. [Acknowledgments](#Acknowledgments)
- 10. [Docs](/rmarchet/blackhole-ts/tree/main/Docs)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

<br />
<img src="public/blackhole.svg" width="118" alt="Black Hole Visualization" align="left" style="margin: 0 20px 8px 0" />
A real-time 3D visualization of a black hole using React, Three.js, and GLSL shaders. This project simulates gravitational lensing, accretion disk effects, and relativistic beaming around a black hole, inspired by scientifically accurate black hole renderings.<br /><br /><br /><br />

##  1. <a name='Screenshot'></a>Screenshot

This is one of the possible visualizations that can be generated with this app:

<img src="screenshot.jpg" width="400" alt="Black Hole Visualization Screenshot" />

##  2. <a name='Features'></a>Features

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

##  3. <a name='TechnologiesUsed'></a>Technologies Used

- React + TypeScript
- Three.js
- React Three Fiber
- GLSL Shaders
- Vite
- Local Storage for persistent settings

##  4. <a name='GettingStarted'></a>Getting Started

###  4.1. <a name='Prerequisites'></a>Prerequisites

- Node.js (v20 or higher)
- npm or yarn

###  4.2. <a name='Installation'></a>Installation

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

##  5. <a name='Controls'></a>Controls

###  5.1. <a name='CameraControls'></a>Camera Controls
- Left-click + drag: Rotate camera
- Right-click + drag: Pan camera
- Mouse wheel: Zoom in/out
- Toggle orbit mode for automatic camera rotation

###  5.2. <a name='VisualControls'></a>Visual Controls
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

##  6. <a name='HowItWorks'></a>How It Works

The visualization uses advanced ray marching techniques in GLSL shaders to simulate:
- [Gravitational lensing](docs/Gravitational%20Lensing.md) around the black hole using geodesic calculations
- Accretion disk with realistic [Doppler and relativistic effects](docs/Doppler%20Shift.md)
- Photon ring at the event horizon
- Relativistic beaming and light aberration
- [Relativistic Jet](docs/Relativistic%20Jet.md) for a rotating black hole
- Star field and Milky Way background with proper parallax
- Post-processing effects for enhanced visual quality



##  7. <a name='ProjectStructure'></a>Project Structure

- `src/components/`: React components including the main BlackHole component
- `src/shaders/`: GLSL shader code for the visualization
- `src/hooks/`: Custom React hooks for state management
- `src/constants/`: Configuration and constant values
- `src/assets/`: Textures and static assets

##  8. <a name='License'></a>License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  9. <a name='Acknowledgments'></a>Acknowledgments

- Inspired by the work of Kip Thorne and the visual effects team of "Interstellar"
- Based on scientific papers about black hole visualization
- Thanks to the Three.js and React Three Fiber communities
