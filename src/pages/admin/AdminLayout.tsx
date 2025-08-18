import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaImages, FaUsers, FaQuoteLeft, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  // Fetch real-time stats from Convex
  const blogPostCount = useQuery(api.blog.countBlogPosts) ?? 0;
  const mediaFileCount = useQuery(api.media.countMediaFiles) ?? 0;
  const teamMemberCount = useQuery(api.team.countTeamMembers) ?? 0;
  const testimonialsCount = useQuery(api.testimonials.listAllTestimonials, { limit: 1000 })?.length ?? 0;
  const timelineEntriesCount = useQuery(api.timeline.countTimelineEntries) ?? 0;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-20 self-start h-[calc(100vh-5rem)] min-w-64 max-w-fit border-r border-gray-200 p-6 bg-white shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Panneau d'administration</h2>
          <p className="text-sm text-gray-500">Gérez votre contenu</p>
          {user && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Connecté en tant que</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
            </div>
          )}
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { path: "/admin/blog", label: "Articles de blog", icon: <FaEdit className="text-lg" /> },
            { path: "/admin/testimonials", label: "Témoignages", icon: <FaQuoteLeft className="text-lg" /> },
            { path: "/admin/timeline", label: "Chronologie", icon: <FaHistory className="text-lg" /> },
            { path: "/admin/media", label: "Bibliothèque média", icon: <FaImages className="text-lg" /> },
            { path: "/admin/team", label: "Membres de l'équipe", icon: <FaUsers className="text-lg" /> },
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
          <div className="text-xs text-gray-400 mb-2">Statistiques rapides</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total articles</span>
              <span className="font-medium">{blogPostCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fichiers média</span>
              <span className="font-medium">{mediaFileCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Membres équipe</span>
              <span className="font-medium">{teamMemberCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Témoignages</span>
              <span className="font-medium">{testimonialsCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Entrées chronologie</span>
              <span className="font-medium">{timelineEntriesCount}</span>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
      <main className="w-full p-10 bg-gray-50 pt-24 overflow-x-scroll">{children}</main>
    </div>
  );
}
