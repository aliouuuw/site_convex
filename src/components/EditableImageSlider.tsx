import React, { useState, useEffect, JSX, forwardRef, useImperativeHandle } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEditMode } from '../hooks/useEditMode';
import MediaPicker from './MediaPicker';
import { Id } from '../../convex/_generated/dataModel';

interface EditableImageSliderProps {
  id: string;
  defaultImages: string[];
  className?: string;
  page?: string;
}

export interface EditableImageSliderRef {
  triggerEdit: () => void;
}

export const EditableImageSlider = forwardRef<EditableImageSliderRef, EditableImageSliderProps>(({
  id,
  defaultImages,
  className = '',
  page = 'home',
}, ref) => {
  const { isEditMode } = useEditMode();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showManager, setShowManager] = useState(false);
  
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  const updateContent = useMutation(api.content.updateContent);
  const storeMediaRecord = useMutation(api.media.storeMediaRecord);
  
  // Use content from database if available, otherwise fallback to default images
  const currentImages = content?.content ? 
    JSON.parse(content.content).filter((img: any): img is string => img && typeof img === 'string') : 
    defaultImages;

  const triggerEditMode = (index: number = 0) => {
    if (isEditMode) {
      setEditingIndex(index);
      setShowMediaPicker(true);
    }
  };

  // Expose the triggerEdit method to parent component
  useImperativeHandle(ref, () => ({
    triggerEdit: () => triggerEditMode()
  }), [isEditMode]);

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      triggerEditMode(index);
    }
  };



  const handleUploadComplete = async (payload: {
    previews: string[];
    uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }>;
  }) => {
    try {
      setIsUploading(true);
      const uploadItem = payload.uploadData[0];
      
      if (!uploadItem) {
        throw new Error('No upload data received');
      }

      // Store media record in Convex
      let mediaId: Id<"media"> | undefined;
      if (!uploadItem.mediaId) {
        const newMediaId = await storeMediaRecord({
          url: uploadItem.url,
          name: uploadItem.name,
          size: uploadItem.size,
          type: 'image',
          alt: `Hero background image ${editingIndex !== null ? editingIndex + 1 : ''}`,
          uploadedBy: 'admin', // TODO: Get from auth context
        });
        mediaId = newMediaId as Id<"media">;
      } else {
        mediaId = uploadItem.mediaId as Id<"media">;
      }

      // Update the images array
      const updatedImages = [...currentImages];
      if (editingIndex !== null) {
        updatedImages[editingIndex] = uploadItem.url;
      } else {
        updatedImages.push(uploadItem.url);
      }

      // Save to database
      await updateContent({
        id,
        content: JSON.stringify(updatedImages),
        type: 'image',
        page,
        mediaId,
        alt: `Hero background images`,
      });

      setShowMediaPicker(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Upload failed:', error);
      // Error is handled by MediaPicker component
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    // Error is handled by MediaPicker component
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages: string[] = currentImages.filter((_: string, i: number): boolean => i !== index);
      await updateContent({
        id,
        content: JSON.stringify(updatedImages),
        type: 'image',
        page,
      });
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      return; // pause autoplay while editing
    }
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImages.length, isEditMode]);

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentImages.length) return;
    const updated = [...currentImages];
    const temp = updated[newIndex];
    updated[newIndex] = updated[index];
    updated[index] = temp;
    try {
      await updateContent({
        id,
        content: JSON.stringify(updated),
        type: 'image',
        page,
      });
    } catch (e) {
      console.error('Failed to reorder images', e);
    }
  };

  return (
    <>
      <div className={`w-full h-full relative overflow-hidden ${className}`}>
        {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((image: string, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.7)' }}
              onClick={(e) => handleImageClick(index, e)}
            />
          </div>
        ))}

        {/* Optional: Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((_: string, index: number): JSX.Element => (
            <button
              key={index}
              onClick={(): void => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
              }`}
            />
            ))}
        </div>

        {/* Edit mode overlay */}
        {isEditMode && (
          <>
            {/* Non-blocking tint */}
            <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
            {/* Floating actions */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => {
                  setEditingIndex(null);
                  setShowMediaPicker(true);
                }}
                className="bg-primary/80 hover:bg-primary px-3 py-2 rounded text-sm text-white transition-colors shadow"
              >
                Add Image
              </button>
              <button
                onClick={() => setShowManager((s) => !s)}
                className="bg-white/90 hover:bg-white text-gray-900 px-3 py-2 rounded text-sm transition-colors shadow"
              >
                {showManager ? 'Close' : 'Manage'}
              </button>
            </div>

            {/* Manager Panel */}
            {showManager && (
              <div className="absolute top-16 right-4 z-30 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 w-80 max-h-96 overflow-auto border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Hero Background Images</h4>
                  <button
                    onClick={() => setShowManager(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((image: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <img src={image} alt={`Slide ${index + 1}`} className="w-16 h-10 object-cover rounded border" />
                      <div className="flex-1 text-xs truncate">{image.split('/').pop()}</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { void moveImage(index, 'up'); }}
                          className="px-2 py-1 text-xs border rounded disabled:opacity-40"
                          disabled={index === 0}
                          title="Move up"
                        >↑</button>
                        <button
                          onClick={() => { void moveImage(index, 'down'); }}
                          className="px-2 py-1 text-xs border rounded disabled:opacity-40"
                          disabled={index === currentImages.length - 1}
                          title="Move down"
                        >↓</button>
                        <button
                          onClick={() => { setEditingIndex(index); setShowMediaPicker(true); }}
                          className="px-2 py-1 text-xs border rounded"
                          title="Replace"
                        >Replace</button>
                        <button
                          onClick={() => { void handleRemoveImage(index); }}
                          className="px-2 py-1 text-xs border rounded text-red-600"
                          title="Remove"
                        >Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t">
                  <button
                    onClick={() => { setEditingIndex(null); setShowMediaPicker(true); }}
                    className="w-full bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded text-sm"
                  >
                    Add New Image
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingIndex !== null 
                  ? `Edit Image ${editingIndex + 1}` 
                  : 'Add New Image'
                }
              </h3>
              <button
                onClick={() => {
                  setShowMediaPicker(false);
                  setEditingIndex(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
            
            <MediaPicker
              onUploadComplete={(payload) => { void handleUploadComplete(payload); }}
              onUploadError={handleUploadError}
              accept="image/*"
              disabled={isUploading}
              className="mb-4"
            />
            
            {isUploading && (
              <div className="text-center text-sm text-gray-600">
                Updating image...
              </div>
            )}

            {/* Current images list for editing */}
            {currentImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Images:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {currentImages.map((image: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate flex-1 mr-2">
                        {image && typeof image === 'string' ? image.split('/').pop() : 'Invalid image'}
                      </span>
                      {isEditMode && (
              <button
                onClick={() => { void handleRemoveImage(index); }}
                className="text-red-500 hover:text-red-700 text-sm"
                disabled={isUploading}
              >
                Remove
              </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowMediaPicker(false);
                  setEditingIndex(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
