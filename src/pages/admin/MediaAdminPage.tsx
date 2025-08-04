import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

interface MediaUploadFormProps {
  onClose: () => void;
  onSave: () => void;
}

function MediaUploadForm({ onClose, onSave }: MediaUploadFormProps) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [alt, setAlt] = useState("");
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [tags, setTags] = useState("");

  const uploadMedia = useMutation(api.media.upsertMedia);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mediaData = {
      url,
      type,
      alt: alt || undefined,
      width,
      height,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
    };

    uploadMedia(mediaData)
      .then(() => {
        onSave();
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading media:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "image" | "video")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (optional)
              </label>
              <input
                type="number"
                value={width || ""}
                onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (optional)
              </label>
              <input
                type="number"
                value={height || ""}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Upload Media
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MediaAdminPage() {
  const [tag, setTag] = useState<string>("");
  const items = useQuery(api.media.searchMedia, { tag: tag || undefined, limit: 24 });
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleSave = () => {
    // The query will automatically refresh when the component re-renders
    // No manual refetch needed with Convex React
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Media</h1>
            <p className="text-gray-600 mb-6">Manage your media library</p>
          </div>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Upload Media
          </button>
        </div>
        
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

        {showUploadForm && (
          <MediaUploadForm
            onClose={() => setShowUploadForm(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}
