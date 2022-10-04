import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          lodash: ['lodash.get', 'lodash.set'],
        }
      },
    },
  },
  plugins: [
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        maximumFileSizeToCacheInBytes: 500000000,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
