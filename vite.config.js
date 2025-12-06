import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // For GitHub Pages deployment, set base to your repo name
  // base: '/frontend/',
  server: {
    port: 5173
  }
});
