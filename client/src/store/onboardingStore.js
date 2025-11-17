import { create } from "zustand";
import axios from "../api/axiosClient";

const useOnboardingStore = create((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/checklists");
      set({ templates: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch templates",
        loading: false,
      });
    }
  },

  createTemplate: async (payload) => {
    try {
      const res = await axios.post("/checklists", payload);
      // append
      set((s) => ({ templates: [res.data, ...s.templates] }));
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Create failed",
      };
    }
  },

  updateTemplate: async (id, payload) => {
    try {
      const res = await axios.put(`/checklists/${id}`, payload);
      set((s) => ({
        templates: s.templates.map((t) => (t._id === id ? res.data : t)),
      }));
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  },

  deleteTemplate: async (id) => {
    try {
      await axios.delete(`/checklists/${id}`);
      set((s) => ({ templates: s.templates.filter((t) => t._id !== id) }));
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Delete failed",
      };
    }
  },

  addTask: async (checklistId, task) => {
    try {
      const res = await axios.post(`/checklists/${checklistId}/items`, task);
      set((s) => ({
        templates: s.templates.map((t) =>
          t._id === checklistId ? { ...t, items: [...t.items, res.data] } : t
        ),
      }));
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Add task failed",
      };
    }
  },

  updateTask: async (checklistId, key, payload) => {
    try {
      const res = await axios.put(
        `/checklists/${checklistId}/items/${key}`,
        payload
      );
      set((s) => ({
        templates: s.templates.map((t) => {
          if (t._id !== checklistId) return t;
          return {
            ...t,
            items: t.items.map((it) => (it.key === key ? res.data : it)),
          };
        }),
      }));
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Update task failed",
      };
    }
  },

  deleteTask: async (checklistId, key) => {
    try {
      await axios.delete(`/checklists/${checklistId}/items/${key}`);
      set((s) => ({
        templates: s.templates.map((t) =>
          t._id === checklistId
            ? { ...t, items: t.items.filter((it) => it.key !== key) }
            : t
        ),
      }));
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Delete task failed",
      };
    }
  },

  // Onboarding instance actions
  assignOnboarding: async (employeeId, checklistId) => {
    try {
      const res = await axios.post(`/onboarding/${employeeId}/assign`, {
        checklistId,
      });
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Assign failed",
      };
    }
  },

  getEmployeeOnboarding: async (employeeId) => {
    try {
      const res = await axios.get(`/onboarding/${employeeId}`);
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Fetch failed",
      };
    }
  },

  updateOnboardingItem: async (employeeId, key, payload) => {
    try {
      const res = await axios.put(
        `/onboarding/${employeeId}/item/${key}`,
        payload
      );
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Update item failed",
      };
    }
  },

  approveOnboardingItem: async (employeeId, key) => {
    try {
      const res = await axios.post(
        `/onboarding/${employeeId}/item/${key}/approve`
      );
      return { ok: true, data: res.data };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.message || "Approve failed",
      };
    }
  },
}));

export default useOnboardingStore;
