// Environment configuration
// Vite exposes env variables on import.meta.env
// Only variables prefixed with VITE_ are exposed

interface EnvConfig {
  apiBaseUrl: string;
  apiPrefix: string;
  mode: string;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

function getEnvConfig(): EnvConfig {
  const mode = import.meta.env.MODE || 'development';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://172.16.0.8:3000';
  const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api/v1';

  return {
    apiBaseUrl,
    apiPrefix,
    mode,
    isDevelopment: mode === 'development',
    isStaging: mode === 'staging',
    isProduction: mode === 'production',
  };
}

export const env = getEnvConfig();

// Helper function to build full API URL
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const cleanPrefix = env.apiPrefix.startsWith('/') ? env.apiPrefix.slice(1) : env.apiPrefix;
  
  // Build full URL (development 모드에서도 CORS가 활성화되어 있어 직접 호출)
  const baseUrl = env.apiBaseUrl.endsWith('/') 
    ? env.apiBaseUrl.slice(0, -1) 
    : env.apiBaseUrl;
  
  return `${baseUrl}/${cleanPrefix}/${cleanEndpoint}`;
}



