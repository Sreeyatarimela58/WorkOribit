import axios from "axios";
import useAuthStore from "../store/authStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://urban-spoon-7vwpv6r77jq92xr5-5000.app.github.dev/api",
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
