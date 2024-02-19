import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: './dist/report.html',
      open: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    host: '127.0.0.1',
    port: 8080,
  },
  preview: {
    host: '127.0.0.1',
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-libs': ['react', 'react-dom'],
          'routing-libs': ['react-router-dom'],
          'ui-libs': ['@mui/icons-material', '@mui/lab', '@mui/material'],
          'state-management-libs': ['@tanstack/react-query', 'recoil'],
          'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'date-libs': ['dayjs'],
          'utils-libs': ['axios'],
        },
      },
    },
  },
})
