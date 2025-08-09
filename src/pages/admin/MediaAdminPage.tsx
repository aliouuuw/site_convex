import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import MediaPicker from "../../components/MediaPicker";

interface MediaUploadFormProps {
  onClose: () => void;
  onSave: () => void;
  editingMedia?: any;
}

function MediaUploadForm({ onClose, onSave, editingMedia }: MediaUploadFormProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [alt, setAlt] = useState("");
  const [width, setWidth] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [size, setSize] = useState<number>(0);
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);

  const resetForm = () => {
    setUrl("");
    setName("");
    setTitle("");
    setType("image");
    setAlt("");
    setWidth(undefined);
    setHeight(undefined);
    setSize(0);
    setTags("");
    setError(null);
    setMediaId(null);
  };

  // Reset form when editingMedia changes
  useEffect(() => {
    if (editingMedia) {
      setUrl(editingMedia.url);
      setName(editingMedia.name);
      setTitle(editingMedia.title || "");
      setType(editingMedia.type);
      setAlt(editingMedia.alt || "");
      setWidth(editingMedia.width);
      setHeight(editingMedia.height);
      setSize(editingMedia.size);
      setTags(editingMedia.tags?.join(", ") || "");
      setMediaId(editingMedia._id);
    } else {
      resetForm();
    }
  }, [editingMedia]);

  const storeMediaRecord = useMutation(api.media.storeMediaRecord);
  const updateMediaRecord = useMutation(api.media.updateMediaRecord);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const mediaData = {
      url,
      name,
      title: title || undefined,
      type,
      alt: alt || undefined,
      width,
      height,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
      size,
      uploadedBy: "admin", // Add uploadedBy field
    };

    try {
      if (mediaId) {
        // Update existing record with additional metadata
        await updateMediaRecord({
          id: mediaId as any, // Type assertion needed for the ID
          alt: alt || undefined,
          width,
          height,
          tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : undefined,
          type,
          title: title || undefined,
        });
        toast.success("Media details updated successfully!");
      } else {
        // Create new record (fallback case)
        await storeMediaRecord(mediaData);
        toast.success("Media uploaded successfully!");
      }
      resetForm();
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving media:", error);
      const errorMessage = error?.message || "Failed to save media";
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
          <h2 className="text-xl font-semibold text-gray-900">
            {mediaId ? "Edit Media Details" : "Upload Media"}
          </h2>
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
              accept="image/*,video/*"
              onUploadComplete={({ uploadData }) => {
                if (uploadData.length > 0) {
                  const file = uploadData[0];
                  setUrl(file.url);
                  setName(file.name);
                  setType(file.url.match(/\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|m4v|3gp)$/i) ? "video" : "image");
                  setSize(file.size);
                  // Store the mediaId if it was created during upload
                  if (file.mediaId) {
                    setMediaId(file.mediaId);
                  }
                }
              }}
              onUploadError={(error) => {
                console.error("MediaPicker upload error:", error);
                setError(error.message);
                toast.error(`Upload failed: ${error.message}`);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="Enter a custom title for the media"
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
              {type === "video" ? "Description" : "Alt Text"}
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder={type === "video" ? "Describe the video content" : "Describe the image for accessibility"}
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

          {url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              {type === "image" ? (
                <img
                  src={url}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <video
                  src={url}
                  className="max-w-full h-32 object-cover rounded-md border"
                  controls
                  preload="metadata"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    if (!width && !height) {
                      setWidth(video.videoWidth);
                      setHeight(video.videoHeight);
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
              className="btn btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!mediaId && (!url.trim() || !name.trim()))}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Saving..." : mediaId ? "Update Details" : "Upload Media"}
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
  const [videoPreview, setVideoPreview] = useState<{ isOpen: boolean; media: any }>({
    isOpen: false,
    media: null,
  });
  const [editingMedia, setEditingMedia] = useState<any>(null);

  const media = useQuery(api.media.searchMedia, { limit: 50 });
  const deleteMediaMutation = useMutation(api.media.deleteMedia);

  const handleUpload = () => {
    setEditingMedia(null);
    setShowForm(true);
  };

  const handleEdit = (mediaItem: any) => {
    setEditingMedia(mediaItem);
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (size: number) => {
    if (!size) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let bytes = size;
    let unitIndex = 0;
    
    while (bytes >= 1024 && unitIndex < units.length - 1) {
      bytes /= 1024;
      unitIndex++;
    }
    
    return `${bytes.toFixed(1)} ${units[unitIndex]}`;
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
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  {item.type === "image" ? (
                    <>
                      <img
                        src={item.url}
                        alt={item.alt || "Media"}
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          console.error(`Failed to load image: ${item.url}`, item);
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.error-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log(`Successfully loaded image: ${item.url}`);
                        }}
                      />
                      <div className="error-fallback absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm flex-col z-10" style={{ display: 'none' }}>
                        <div className="text-4xl mb-2">🖼️</div>
                        <div className="font-medium">Image failed to load</div>
                        <div className="text-xs mt-1 text-center px-2">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.url}</div>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="relative w-full h-full group cursor-pointer"
                      onClick={() => setVideoPreview({ isOpen: true, media: item })}
                    >
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        VIDEO
                      </div>
                      <div className="hidden w-full h-full flex-col items-center justify-center text-gray-500 bg-gray-100">
                        <svg className="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span className="text-sm">Video</span>
                      </div>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {item.title && (
                    <p className="text-sm font-medium text-gray-900 mb-1 truncate" title={item.title}>
                      {item.title}
                    </p>
                  )}
                  {item.alt && (
                    <p className="text-sm text-gray-600 mb-2 truncate" title={item.alt}>
                      {item.alt}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    {item.width && item.height && (
                      <div>{item.width} × {item.height}px</div>
                    )}
                    <div>Size: {formatFileSize(item.size)}</div>
                    <div>Uploaded: {formatDate(item.uploadedAt)}</div>
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
                      onClick={() =>
                        void (async () => {
                          try {
                            await navigator.clipboard.writeText(item.url);
                            toast.success("URL copied to clipboard!");
                          } catch (error) {
                            console.error("Failed to copy URL:", error);
                            toast.error("Failed to copy URL");
                          }
                        })()
                      }
                      className="text-primary hover:text-primary/80 text-sm font-medium hover:cursor-pointer hover:underline"
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
            onClose={() => {
              setShowForm(false);
              setEditingMedia(null);
            }}
            onSave={() => {
              // The form will close itself and show a toast
            }}
            editingMedia={editingMedia}
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

        {/* Video Preview Modal */}
        {videoPreview.isOpen && videoPreview.media && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button
                onClick={() => setVideoPreview({ isOpen: false, media: null })}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold z-10"
              >
                ✕
              </button>
              <video
                src={videoPreview.media.url}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] rounded-lg"
                onError={(e) => {
                  console.error("Video playback error:", e);
                  toast.error("Failed to load video");
                }}
              >
                Your browser does not support the video tag.
              </video>
              {videoPreview.media.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 rounded-b-lg">
                  <p className="text-sm font-medium">{videoPreview.media.title}</p>
                </div>
              )}
              {videoPreview.media.alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 rounded-b-lg">
                  <p className="text-sm">{videoPreview.media.alt}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
