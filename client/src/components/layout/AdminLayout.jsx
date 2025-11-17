import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
