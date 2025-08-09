import { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MediaPicker from './MediaPicker';
import toast from 'react-hot-toast';

interface MediaSelectorProps {
  onSelect: (media: { url: string; name: string; size: number; mediaId?: string }) => void;
  currentImageUrl?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
}

export default function MediaSelector({
  onSelect,
  currentImageUrl,
  accept = "image/*",
  className = "",
  disabled = false,
}: MediaSelectorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upload' | 'library'>('upload');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const media = useQuery(api.media.searchMedia, { limit: 50 });

  const handleImageLoad = (mediaId: string) => {
    setLoadedImages(prev => new Set(prev).add(mediaId));
  };

  const handleMediaSelect = (mediaItem: any) => {
    setSelectedImage(mediaItem);
  };

  const confirmSelection = () => {
    if (selectedImage) {
      onSelect({
        url: selectedImage.url,
        name: selectedImage.name,
        size: selectedImage.size,
        mediaId: selectedImage._id,
      });
      setShowMediaLibrary(false);
      setSelectedImage(null);
    }
  };

  const handleUploadComplete = ({ uploadData }: { uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }> }) => {
    if (uploadData.length > 0) {
      onSelect(uploadData[0]);
      setShowMediaLibrary(false);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    toast.error(`Upload failed: ${error.message}`);
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
    <div className={className}>
      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Image
          </label>
          <div className="relative inline-block">
            <img
              src={currentImageUrl}
              alt="Current"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => onSelect({ url: '', name: '', size: 0 })}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Media Selection Button */}
      <button
        type="button"
        onClick={() => {
          setShowMediaLibrary(true);
          setSelectedImage(null);
          setLoadedImages(new Set());
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {currentImageUrl ? 'Change Image' : 'Select Image'}
      </button>

      {/* Media Selection Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Select Image</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaLibrary(false);
                    setSelectedImage(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={disabled}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    type="button"
                    onClick={() => setSelectedTab('upload')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'upload'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Upload New
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTab('library')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'library'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Media Library
                  </button>
                </nav>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedTab === 'upload' ? (
                <div>
                  <MediaPicker
                    onUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    accept={accept}
                    className="w-full"
                    disabled={disabled}
                  />
                </div>
              ) : (
                <div>
                  {media === undefined ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No media files available. Upload some first!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {media
                        .filter(item => item.type === 'image') // Only show images
                        .map((item) => (
                          <div
                            key={item._id}
                            onClick={() => loadedImages.has(item._id) ? handleMediaSelect(item) : null}
                            className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                              selectedImage?._id === item._id 
                                ? 'border-primary bg-primary/5' 
                                : loadedImages.has(item._id)
                                  ? 'border-gray-200 hover:border-primary cursor-pointer'
                                  : 'border-gray-200 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="aspect-square bg-gray-100 relative">
                              {/* Loading indicator */}
                              {!loadedImages.has(item._id) && (
                                <div className="loading-indicator absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm z-20">
                                  <div className="text-center">
                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin mb-2"></div>
                                    <div>Loading...</div>
                                  </div>
                                </div>
                              )}
                              
                              <img
                                src={item.url}
                                alt={item.alt || item.title || item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(`Failed to load image: ${item.url}`, item);
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement?.querySelector('.error-fallback') as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                                onLoad={() => {
                                  console.log(`Successfully loaded image: ${item.url}`);
                                  handleImageLoad(item._id);
                                }}
                              />
                              
                              <div className="error-fallback absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm z-10" style={{ display: 'none' }}>
                                <div className="text-center">
                                  <div className="text-2xl mb-2">🖼️</div>
                                  <div>Image failed to load</div>
                                  <div className="text-xs mt-1 truncate px-2">{item.name}</div>
                                </div>
                              </div>
                              
                              {/* Selection indicator */}
                              {selectedImage?._id === item._id && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-30">
                                  <div className="bg-primary text-white p-2 rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              
                              {/* Hover overlay for loaded images */}
                              {loadedImages.has(item._id) && selectedImage?._id !== item._id && (
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center z-20 group">
                                  <button type="button" className="opacity-0 group-hover:opacity-100 bg-white text-primary px-3 py-1 rounded text-sm font-medium transition-opacity">
                                    Select
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs text-gray-600 truncate">{item.title || item.name}</p>
                              <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMediaLibrary(false);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={disabled}
              >
                Cancel
              </button>
              {selectedImage && (
                <button
                  type="button"
                  onClick={confirmSelection}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                  disabled={disabled}
                >
                  Use Selected Image
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}