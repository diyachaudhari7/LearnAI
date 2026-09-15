import axios from 'axios';

// Resolve API base URL dynamically for multi-device access and proxying
export const getApiBaseUrl = () => {
  // 1. Browser runtime override (stored in localStorage) - enables immediate backend linking
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('learnai_api_url');
    if (customUrl && customUrl.trim()) {
      const clean = customUrl.trim().replace(/\/+$/, '');
      return clean.endsWith('/api') ? clean : `${clean}/api`;
    }
  }

  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

  // 2. Explicit cloud URL provided via Vite env var (e.g. Render / production backend)
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  // 3. When accessed in browser
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLocalNetworkIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.endsWith('.local');

    // In Vite dev server (port 5173), use relative '/api' which Vite dev proxy handles
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

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer Token if present and ensure dynamic baseURL
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
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

    const isVercelHost = typeof window !== 'undefined' && (
      window.location?.hostname?.includes('vercel.app') ||
      (!window.location?.hostname?.includes('localhost') && !/^(\d{1,3}\.){3}\d{1,3}$/.test(window.location?.hostname))
    );

    // 404 handler for Vercel: Vercel does not host backend API
    if (error.response?.status === 404 && isVercelHost) {
      const currentBase = getApiBaseUrl();
      if (currentBase === '/api' || currentBase.includes('vercel.app')) {
        message = 'Backend API not connected (404). Vercel does not host the Python backend. Please link your Render backend URL in Vercel Settings or click "Configure Backend" below.';
      } else {
        message = `API endpoint not found (404) at ${currentBase}. Please check your backend service on Render.`;
      }
    } else if (error.message === 'Network Error' || (!error.response && error.code === 'ERR_NETWORK')) {
      if (isVercelHost) {
        message = 'Backend server is unreachable from Vercel. Please ensure your FastAPI backend on Render is active and awake.';
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

export const setCustomBackendUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('learnai_api_url');
  } else {
    const clean = url.trim().replace(/\/+$/, '');
    const finalUrl = clean.endsWith('/api') ? clean : `${clean}/api`;
    localStorage.setItem('learnai_api_url', finalUrl);
  }
};

export const getCustomBackendUrl = () => {
  return typeof window !== 'undefined' ? (localStorage.getItem('learnai_api_url') || '') : '';
};

export const getActiveBackendUrl = () => {
  return getApiBaseUrl();
};

export default api;
