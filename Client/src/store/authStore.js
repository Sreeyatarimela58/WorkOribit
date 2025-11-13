import { create } from "zustand";
import axios from "../api/axiosClient";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,

  login: async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, error: null });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed" });
      return false;
    }
  },

  fetchUser: async () => {
    const { token } = get();
    if (!token) return set({ loading: false });
    try {
      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data, loading: false });
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false , error: err.response?.data?.message || "User fetch failed"});
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
