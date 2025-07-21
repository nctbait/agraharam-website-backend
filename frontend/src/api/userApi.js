// src/api/userApi.js
import axios from 'axios';

const API_URL = "http://localhost:8080/api/users";

export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
