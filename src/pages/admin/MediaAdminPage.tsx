import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import MediaPicker from "../../components/MediaPicker";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMedia = useMutation(api.media.upsertMedia);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const mediaData = {
      url,
      type,
      alt: alt || undefined,
      width,
      height,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
    };

    try {
      await uploadMedia(mediaData);
      toast.success("Media uploaded successfully!");
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error uploading media:", error);
      const errorMessage = error?.message || "Failed to upload media";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
        </div>
        
        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files
            </label>
            <MediaPicker
              onUploadComplete={(urls) => {
                if (urls.length > 0) {
                  setUrl(urls[0]);
                  setType("image");
                }
              }}
              onUploadError={(error) => {
                setError(error.message);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "image" | "video")}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
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
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="Describe the media for accessibility"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={width || ""}
                onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height || ""}
                onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
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
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="gallery, hero, blog, team"
            />
          </div>

          {url && type === "image" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <img
                src={url}
                alt="Preview"
                className="max-w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !url.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Uploading..." : "Upload Media"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MediaAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; media: any }>({
    isOpen: false,
    media: null,
  });

  const media = useQuery(api.media.searchMedia, { limit: 50 });
  const deleteMediaMutation = useMutation(api.media.deleteMedia);

  const handleUpload = () => {
    setShowForm(true);
  };

  const handleDelete = (mediaItem: any) => {
    setDeleteConfirm({ isOpen: true, media: mediaItem });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.media) return;

    try {
      await deleteMediaMutation({ id: deleteConfirm.media._id });
      toast.success("Media deleted successfully!");
      setDeleteConfirm({ isOpen: false, media: null });
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error(error?.message || "Failed to delete media");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (_url: string) => {
    // This is a placeholder - in a real app you'd get this from the file metadata
    return "—";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          <button
            onClick={handleUpload}
            className="btn btn-primary"
          >
            Upload Media
          </button>
        </div>

        {media === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No media files yet. Upload your first file!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {media.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.alt || "Media"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span className="text-sm">Video</span>
                    </div>
                  )}
                  <div className="hidden w-full h-full flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Failed to load</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "image" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.type}
                    </span>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                  
                  {item.alt && (
                    <p className="text-sm text-gray-600 mb-2 truncate" title={item.alt}>
                      {item.alt}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    {item.width && item.height && (
                      <div>{item.width} × {item.height}px</div>
                    )}
                    <div>Size: {formatFileSize(item.url)}</div>
                    <div>Uploaded: {formatDate(item.createdAt)}</div>
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => void navigator.clipboard.writeText(item.url)}
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <MediaUploadForm
            onClose={() => setShowForm(false)}
            onSave={() => {
              // The form will close itself and show a toast
            }}
          />
        )}

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, media: null })}
          onConfirm={() => void confirmDelete()}
          title="Delete Media"
          message={
            <div>
              <p>Are you sure you want to delete this media file?</p>
              {deleteConfirm.media?.alt && (
                <p className="font-semibold mt-2">"{deleteConfirm.media.alt}"</p>
              )}
              <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
            </div>
          }
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </AdminLayout>
  );
}
