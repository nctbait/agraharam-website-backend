import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || ''; // e.g., http://localhost:8080

const getToken = () => localStorage.getItem('jwtToken');

const authAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests automatically
authAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  get: (url) => authAxios.get(url).then(res => res.data),
  post: (url, data) => authAxios.post(url, data).then(res => res.data),
  put: (url, data) => authAxios.put(url, data).then(res => res.data),
  delete: (url) => authAxios.delete(url).then(res => res.data),
  instance: authAxios
};

export default api;

// Export helper methods
//const get = (url) => authAxios.get(url).then(res => res.data);
//const post = (url, data) => authAxios.post(url, data).then(res => res.data);
//const put = (url, data) => authAxios.put(url, data).then(res => res.data);
//const del = (url) => authAxios.delete(url).then(res => res.data);
/*
export default {
  get,
  post,
  put,
  delete: del,
  instance: authAxios // if you need to access it directly
};*/
