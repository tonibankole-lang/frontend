import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,          // Frontend runs on this port
    proxy: {
      '/api': 'http://localhost:4000' // Forward API requests to backend
    }
  }
});
