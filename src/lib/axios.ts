import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'test'
    ? '/api' // Utilisé par MSW dans les tests
    : import.meta.env.VITE_API_BASE_URL, 
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("jwt");
    }
    return Promise.reject(err);
  }
);
