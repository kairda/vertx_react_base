import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Vert.x server (port 8080) serves the production build from the classpath folder "webroot".
// During development, run `npm run dev` and open http://localhost:5173 – API calls and the
// WebSocket are proxied to the running Vert.x server, and edits show up instantly (HMR).
const server = 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  // relative asset URLs, so the app also works when mounted below a context path
  base: './',
  build: {
    outDir: '../src/main/resources/webroot',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': server,
      '/ws': { target: server, ws: true },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
