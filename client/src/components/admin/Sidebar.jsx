import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path
      ? "bg-[#5048e5]/20 text-[#5048e5]"
      : "text-gray-400 hover:bg-gray-800";

  return (
    <aside className="flex h-screen sticky top-0 w-64 flex-col justify-between border-r border-gray-800 bg-gray-900 p-4">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="size-8 text-[#5048e5]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">WorkOrbit</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">

          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isActive("/admin/dashboard")}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm font-medium">Dashboard</p>
          </Link>

          <Link
            to="/admin/employees"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isActive("/admin/employees")}`}
          >
            <span className="material-symbols-outlined">groups</span>
            <p className="font-semibold text-sm">Employees</p>
          </Link>

          <Link
            to="/admin/onboarding"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isActive("/admin/onboarding")}`}
          >
            <span className="material-symbols-outlined">dynamic_form</span>
            <p className="text-sm font-medium">Onboarding</p>
          </Link>

          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isActive("/admin/settings")}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </Link>

        </nav>
      </div>
    </aside>
  );
}
