import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [cesium()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9898',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
});
