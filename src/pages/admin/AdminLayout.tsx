import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-20 self-start h-[calc(100vh-5rem)] w-60 border-r border-gray-200 p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin</h2>
        <nav className="flex flex-col gap-2">
          {[
            { path: "/admin/blog", label: "Blog" },
            { path: "/admin/media", label: "Media" },
            { path: "/admin/team", label: "Team" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-10 bg-gray-50 pt-24">{children}</main>
    </div>
  );
}
