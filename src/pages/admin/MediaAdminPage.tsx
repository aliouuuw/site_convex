import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function MediaAdminPage() {
  const [tag, setTag] = useState<string>("");
  const items = useQuery(api.media.searchMedia, { tag: tag || undefined, limit: 24 });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-2">Media</h2>
        <p className="text-gray-600 mb-6">Manage your media library</p>
        
        <div className="mb-6 max-w-md">
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Filter by tag"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {!items && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading media…
          </div>
        )}

        {items && items.length === 0 && (
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-600">
            No media found.
          </div>
        )}

        {items && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((m) => (
              <div
                key={m._id as string}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt={m.alt || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-600 mb-1">
                    {m.type === "image" ? "Image" : "Video"}
                  </div>
                  <div className="text-xs text-gray-600 break-words">
                    {(m.tags || []).join(", ") || "No tags"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
