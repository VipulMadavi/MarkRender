import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-codemirror': [
            '@codemirror/commands',
            '@codemirror/lang-markdown',
            '@codemirror/language',
            '@codemirror/state',
            '@codemirror/view',
          ],
          'vendor-katex': ['katex'],
          'vendor-markdown': ['markdown-it', 'prismjs'],
        },
      },
    },
  },
})
