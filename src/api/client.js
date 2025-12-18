import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// Attach token to every request (read live from localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 => clear + redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=expired";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
