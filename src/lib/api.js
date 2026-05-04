import axios from "axios";
const base = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const api = axios.create({
   baseURL: base,
  // baseURL: "http://127.0.0.1:8000", // backend url
});

// attach token automatically (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
