import { create } from "zustand";
import axios from "../api/axiosClient";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,

  // LOGIN
  login: async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({ user, token, error: null });

      return { ok: true, user };
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed" });
      return { ok: false };
    }
  },

  // SIGNUP (TO BE USED BY ADMIN ONLY)
  signup: async (email, password , role , employeeId) => {
    try {
      await axios.post("/auth/register", { email, password, role , employeeId });
      return { ok: true };
    } catch (err) {
      set({ error: err.response?.data?.message || "Signup failed" });
      return { ok: false };
    }
  },

  // FETCH USER ON PAGE LOAD
  fetchUser: async () => {
    const { token } = get();
    if (!token) return set({ loading: false });

    try {
      const res = await axios.get("/auth/me");
      set({ user: res.data, loading: false });
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false, error: err.response?.data?.message || "fetchUser Failed" });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
