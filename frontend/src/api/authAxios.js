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
    //const payload = JSON.parse(atob(token.split('.')[1]));
    //console.log(payload);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const uploadFile = (url, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return authAxios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res.data);
};


const api = {
  // ✅ now accepts an optional config (params, responseType, headers, etc.)
  // ✅ returns FULL response when responseType === 'blob' (for CSV/filename headers)
  // ✅ returns data for all other cases (backward compatible)
  get: (url, config = {}) =>
    authAxios.get(url, config).then(res => {
      return config && config.responseType === 'blob' ? res : res.data;
    }),

  post: (url, data, config = {}) =>
    authAxios.post(url, data, config).then(res => res.data),

  put: (url, data, config = {}) =>
    authAxios.put(url, data, config).then(res => res.data),

  delete: (url, config = {}) =>
    authAxios.delete(url, config).then(res => res.data),

  uploadFile,
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
