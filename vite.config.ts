import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    glsl(),
    react(),
    checker({
      typescript: true,
      overlay: true,
      enableBuild: false,
    }),
    compression({ algorithm: 'gzip' }),
  ],
  assetsInclude: ['**/*.glsl'],
  esbuild: {
    loader: 'tsx',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Put each top-level node_module in its own chunk
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
})
