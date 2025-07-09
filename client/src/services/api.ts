import axios from 'axios';
import { token } from '../context/userContext';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
