import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

const TOKEN_KEY = 'jwtToken';
const getToken = () => localStorage.getItem(TOKEN_KEY);

function isExpired(token, skewMs = 5000) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return true;
    const expiresAt = decoded.exp * 1000;
    return Date.now() >= (expiresAt - skewMs);
  } catch {
    return true;
  }
}

export const authAxios = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Preflight: only if token exists. If expired, clear and bounce to login via event.
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      if (isExpired(token)) {
        localStorage.removeItem(TOKEN_KEY);
        // Tell the app to redirect once; do not spam on every request
        window.dispatchEvent(new CustomEvent('app:logout', {
          detail: { reason: 'Session expired. Please sign in again.' }
        }));
        // Cancel this request
        return Promise.reject(new axios.Cancel('token expired'));
      }
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: only force logout when the request WAS authenticated.
authAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const hadToken = !!error?.config?.headers?.Authorization; // critical
    if (hadToken && (status === 401 || status === 403)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('app:logout', {
        detail: { reason: 'Session expired. Please sign in again.' }
      }));
    }
    return Promise.reject(error);
  }
);

// Small helper API wrapper (keeps your existing pattern)
const api = {
  get: (url, config = {}) =>
    authAxios.get(url, config).then(res => (config.responseType === 'blob' ? res : res.data)),
  post: (url, data, config = {}) =>
    authAxios.post(url, data, config).then(res => res.data),
  put: (url, data, config = {}) =>
    authAxios.put(url, data, config).then(res => res.data),
  delete: (url, config = {}) =>
    authAxios.delete(url, config).then(res => res.data),
  uploadFile: (url, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return authAxios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  instance: authAxios
};

export default api;
