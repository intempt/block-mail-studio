
export const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';
export const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
export const showComponentInfo = import.meta.env.VITE_SHOW_COMPONENT_INFO === 'true';
export const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

export const envConfig = {
  isDevelopment,
  isProduction,
  showComponentInfo,
  debugMode,
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development'
};
