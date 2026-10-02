import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cph_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      // Only redirect if current path is protected
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/teacher') || currentPath.startsWith('/upload')) {
        localStorage.removeItem('cph_token');
        localStorage.removeItem('cph_user');
        window.location.href = '/login/teacher';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
