import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  host: '0.0.0.0',
  port: 5173,
  hmr: {
    clientPort: 5173,   // tells the browser which port to use for HMR
  },
}
})
