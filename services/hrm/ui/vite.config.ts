import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  base: '/',
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'hrmApp',
      filename: 'remoteEntry.js',
      // In dev mode, use '/' — the MF auto-init script prepends window.origin automatically.
      // In production, 'auto' detects the correct base URL at runtime.
      publicPath: mode === 'development' ? '/' : 'auto',
      dts: false, // Disable dts plugin - avoids fs-extra ESM/CommonJS compatibility issue
      exposes: {
        // Standard export name for all apps - Shell expects './ShellEntry'
        './ShellEntry': './src/federation/shell-entry.tsx',
      },
      shared: {
        react: {
          requiredVersion: false,
          singleton: true, // Only one React instance (use Shell's when available)
        },
        'react-dom': {
          requiredVersion: false,
          singleton: true,
        },
        'react-router-dom': {
          requiredVersion: false,
          singleton: true,
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false, // Required for Module Federation
    rollupOptions: {
      output: {
        // IMPORTANT: Do NOT split shared dependencies for Module Federation
        // React, React-DOM, and React-Router-DOM must stay in main bundle
        manualChunks: (id: string) => {
          // Exclude shared dependencies from chunking
          if (id.includes('node_modules')) {
            if (
              id.includes('react/') || 
              id.includes('react-dom/') || 
              id.includes('react-router-dom/') ||
              id.includes('react/index') ||
              id.includes('react-dom/index')
            ) {
              // Keep in main bundle for Module Federation sharing
              return undefined;
            }
            // Other vendor libraries can be chunked
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 4175, // Dev server port (same as preview for consistency)
    host: true,
    cors: true, // Enable CORS for Module Federation
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
  preview: {
    port: 4175, // App UI port - default: 4175
    host: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },
}));
