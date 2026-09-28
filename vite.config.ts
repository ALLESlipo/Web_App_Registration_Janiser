import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 5173 (the Vite default) is taken by another project on this machine.
  server: { port: 5180, strictPort: true },
  preview: { port: 5181, strictPort: true },
})
