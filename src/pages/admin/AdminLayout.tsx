import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaEdit, FaImages, FaUsers } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Fetch real-time stats from Convex
  const blogPostCount = useQuery(api.blog.countBlogPosts) ?? 0;
  const mediaFileCount = useQuery(api.media.countMediaFiles) ?? 0;
  const teamMemberCount = useQuery(api.team.countTeamMembers) ?? 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-20 self-start h-[calc(100vh-5rem)] min-w-64 max-w-fit border-r border-gray-200 p-6 bg-white shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-sm text-gray-500">Manage your content</p>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { path: "/admin/blog", label: "Blog Posts", icon: <FaEdit className="text-lg" /> },
            { path: "/admin/media", label: "Media Library", icon: <FaImages className="text-lg" /> },
            { path: "/admin/team", label: "Team Members", icon: <FaUsers className="text-lg" /> },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-xs text-gray-400 mb-2">Quick Stats</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Posts</span>
              <span className="font-medium">{blogPostCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Media Files</span>
              <span className="font-medium">{mediaFileCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Team Members</span>
              <span className="font-medium">{teamMemberCount}</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="w-full p-10 bg-gray-50 pt-24 overflow-x-scroll">{children}</main>
    </div>
  );
}
