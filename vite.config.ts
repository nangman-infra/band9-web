import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get API base URL from environment variables
  // 백엔드에서 글로벌 프리픽스가 제거되어 프리픽스 없이 직접 호출
  // 개발 모드에서도 CORS가 활성화되어 있어 직접 호출하므로 proxy 불필요
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000';

  return {
    plugins: [react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    })],
    // 개발 모드에서도 CORS가 활성화되어 있어 proxy 불필요
    // 필요시 아래 주석을 해제하여 proxy 사용 가능
    // server: {
    //   proxy: {
    //     '/users': {
    //       target: apiBaseUrl,
    //       changeOrigin: true,
    //     },
    //     '/vocabulary': {
    //       target: apiBaseUrl,
    //       changeOrigin: true,
    //     },
    //   },
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});






