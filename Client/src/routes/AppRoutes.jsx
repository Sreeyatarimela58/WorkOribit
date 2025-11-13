import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/auth/Login.jsx";
// import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
// import ManagerDashboard from "../pages/manager/ManagerDashboard.jsx";
// import EmployeeDashboard from "../pages/employee/EmployeeDashboard.jsx";
// import Directory from "../pages/shared/Directory.jsx";
// import Error404 from "../pages/Error404.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* <Route
          path="/admin/*"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/manager/*"
          element={
            <PrivateRoute roles={["manager"]}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/employee/*"
          element={
            <PrivateRoute roles={["employee"]}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/directory"
          element={
            <PrivateRoute roles={["admin", "manager", "employee"]}>
              <Directory />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Error404 />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
