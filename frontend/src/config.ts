// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Fetch wrapper that adds ngrok bypass header
export const apiFetch = (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'ngrok-skip-browser-warning': 'true', // Bypass ngrok warning page
  };
  
  return fetch(url, { ...options, headers });
};
