import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages is served from: https://tonibankole-lang.github.io/frontend/
  // so base must be the repo name with leading/trailing slashes
  base: '/frontend/',
  server: {
    port: 5173
  }
});
