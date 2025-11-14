import { create } from "zustand";
import api from "../api/axiosClient.js"; // your axios instance

export const useEmployeeStore = create((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  // -----------------------------
  // FETCH ALL EMPLOYEES
  // -----------------------------
  getEmployees: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/employees");

      // Backend returns array of employees
      set({ employees: res.data, loading: false });

    } catch (error) {
      console.error("GET EMPLOYEES ERROR:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch employees",
      });
    }
  },

  // -----------------------------
  // FETCH EMPLOYEE BY ID
  // -----------------------------
  getEmployeeById: async (id) => {
    try {
      const res = await api.get(`/employees/${id}`);
      return res.data;
    } catch (error) {
      console.error("GET EMPLOYEE ERROR:", error);
      return null;
    }
  },

  // -----------------------------
  // CREATE EMPLOYEE
  // -----------------------------
  createEmployee: async (data) => {
    try {
      set({ loading: true });

      const res = await api.post("/employees", data);

      set((state) => ({
        employees: [res.data, ...state.employees],
        loading: false,
      }));

      return res.data;
    } catch (error) {
      console.error("CREATE EMPLOYEE ERROR:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create employee",
      });
      return null;
    }
  },

  // -----------------------------
  // UPDATE EMPLOYEE
  // -----------------------------
  updateEmployee: async (id, data) => {
    try {
      set({ loading: true });

      const res = await api.put(`/employees/${id}`, data);

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp._id === id ? res.data : emp
        ),
        loading: false,
      }));

      return res.data;
    } catch (error) {
      console.error("UPDATE EMPLOYEE ERROR:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update employee",
      });
      return null;
    }
  },

  // -----------------------------
  // DELETE EMPLOYEE
  // -----------------------------
  deleteEmployee: async (id) => {
    try {
      set({ loading: true });

      await api.delete(`/employees/${id}`);

      set((state) => ({
        employees: state.employees.filter((emp) => emp._id !== id),
        loading: false,
      }));

      return true;
    } catch (error) {
      console.error("DELETE EMPLOYEE ERROR:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete employee",
      });
      return false;
    }
  },

  // -----------------------------
  // GET MANAGERS FROM EMPLOYEES
  // -----------------------------
  getManagers: () => {
    const employees = get().employees;

    // TEMP: until backend exposes manager roles properly
    return employees.filter((emp) =>
      emp.jobTitle?.toLowerCase().includes("manager")
    );
  },
}));
