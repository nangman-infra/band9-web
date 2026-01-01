import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get API base URL and prefix from environment variables
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000';
  const apiPrefix = env.VITE_API_PREFIX;
  // Remove leading slash from prefix for proxy path
  const proxyPath = apiPrefix ? (apiPrefix.startsWith('/') ? apiPrefix : `/${apiPrefix}`) : null;

  // Proxy 설정 (환경 변수가 있을 때만 활성화)
  const proxyConfig = proxyPath ? {
    [proxyPath]: {
      target: apiBaseUrl,
      changeOrigin: true,
      // Only proxy in development mode
      configure: (proxy: any, _options: any) => {
        if (mode === 'development') {
          proxy.on('error', (err: Error, _req: any, _res: any) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
    },
  } : {};

  return {
    plugins: [react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    })],
    server: {
      proxy: proxyConfig,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});






