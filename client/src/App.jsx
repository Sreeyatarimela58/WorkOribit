import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/authStore";
import { ToastProvider } from "./context/Toast";
export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // auto fetch logged-in user
  }, []);

  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}
