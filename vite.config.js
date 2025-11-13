// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,          // fixed port
    strictPort: true,   // do not switch to another port if 300 is in use
    host: true,         // allows access from network (optional)
  },
})
