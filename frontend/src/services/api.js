import axios from 'axios';

// Resolve API base URL dynamically for multi-device access and proxying
const getApiBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

  // 1. If explicit cloud URL is provided (e.g. Render / production backend), use it
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  // 2. When accessed in browser
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLocalNetworkIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.endsWith('.local');

    // In Vite dev server (port 5173), use relative '/api' which Vite proxies to backend port 8000
    if (window.location.port === '5173') {
      return '/api';
    }

    // If accessed via local Wi-Fi IP directly on port 8000 (e.g. mobile phone on Wi-Fi)
    if (isLocalNetworkIp) {
      return `http://${hostname}:8000/api`;
    }

    // If running on a cloud domain (like Vercel)
    if (!isLocalhost && !isLocalNetworkIp) {
      if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
      }
      return '/api';
    }
  }

  const base = envUrl || 'http://localhost:8000/api';
  return base.endsWith('/api') ? base : `${base}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data payload or bubble clean error message
api.interceptors.response.use(
  (response) => {
    // If backend returns standard { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    let message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    if (error.message === 'Network Error' || (!error.response && error.code === 'ERR_NETWORK')) {
      if (typeof window !== 'undefined' && window.location?.hostname?.includes('vercel.app')) {
        message = 'Backend is unreachable from Vercel. Please ensure your FastAPI backend is deployed (e.g. on Render) and VITE_API_URL is configured.';
      } else {
        message = 'Cannot connect to backend server. Make sure the backend is running (uvicorn app.main:app --host 0.0.0.0 --port 8000).';
      }
    }

    if (error.response?.status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem('learnai_token');
      localStorage.removeItem('learnai_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
