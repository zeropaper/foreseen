import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    monacoEditorPlugin({
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
    }),
  ],
});
