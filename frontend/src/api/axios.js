import axios from 'axios';
import { clearSession, readSession } from '../auth/session.js';

export const api = axios.create({
  baseURL: 'https://fatos-observados.onrender.com/',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const session = readSession();
  if (session && config.url !== '/auth/login') config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error;
    // A forbidden captain action is different from an expired session.
    if (error.config?.url !== '/auth/login' &&
      (status === 401 || (status === 403 && message === 'Invalid or expired token.'))) clearSession();
    return Promise.reject(error);
  },
);

export default api;
