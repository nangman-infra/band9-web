// Environment configuration
// Vite exposes env variables on import.meta.env
// Only variables prefixed with VITE_ are exposed

interface EnvConfig {
  apiBaseUrl: string;
  mode: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

function getEnvConfig(): EnvConfig {
  const mode = import.meta.env.MODE || 'development';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://172.16.0.8:3000';

  return {
    apiBaseUrl,
    mode,
    isDevelopment: mode === 'development',
    isStaging: mode === 'staging',
    isProduction: mode === 'production',
  };
}

export const env = getEnvConfig();

// Helper function to build full API URL
// 백엔드에서 글로벌 프리픽스가 제거되어 프리픽스 없이 직접 호출
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Build full URL (프리픽스 없이 직접 호출)
  const baseUrl = env.apiBaseUrl.endsWith('/') 
    ? env.apiBaseUrl.slice(0, -1) 
    : env.apiBaseUrl;
  
  return `${baseUrl}${cleanEndpoint}`;
}



