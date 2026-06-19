import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use '/smileme/' for production builds (GitHub Pages compatibility),
  // but serve from root during dev/preview so the dev server works at '/'.
  base: command === 'build' ? '/smileme/' : '/',
  server: {
    allowedHosts: true
  },
  build: {
    sourcemap: true
  }
}))
