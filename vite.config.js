import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' sorgt dafür, dass die App auch unter
// https://benutzername.github.io/repo-name/ funktioniert.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'docs' }
})
