import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default function ({ command }) {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      include: ['@stomp/stompjs', 'sockjs-client'],
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:80',
          changeOrigin: true,
        },
        '/ws-stomp': {
          target: 'http://localhost:80',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  });
}
