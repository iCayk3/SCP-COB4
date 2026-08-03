import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
  withCredentials: true
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('sgc-session-expired'));
    }
    return Promise.reject(error);
  }
);
