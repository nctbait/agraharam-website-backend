// apiHelper.js
export const authFetch = (url, options = {}) => {
    const token = localStorage.getItem('jwtToken');
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
  };
  