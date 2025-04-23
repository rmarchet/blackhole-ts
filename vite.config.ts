import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    glsl(),
    react(),
    checker({
      typescript: true,
      overlay: true,
      enableBuild: false,
    }),
  ],
  assetsInclude: ['**/*.glsl'],
  esbuild: {
    loader: 'tsx',
  },
})
