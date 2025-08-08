import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useEditMode } from '../hooks/useEditMode';
import MediaPicker from './MediaPicker';
import { Id } from '../../convex/_generated/dataModel';

interface EditableImageProps {
  id: string;
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  page?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  alt = '',
  className = '',
  width,
  height,
  fallbackSrc,
  page = 'home',
}) => {
  const { isEditMode } = useEditMode();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  const updateContent = useMutation(api.content.updateContent);
  const storeMediaRecord = useMutation(api.media.storeMediaRecord);
  
  // Use content from database if available, otherwise fallback to props
  const currentSrc = content?.content || src;
  const currentAlt = content?.alt || alt;

  const handleImageClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      setShowMediaPicker(true);
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
        mediaId = await storeMediaRecord({
          url: uploadItem.url,
          name: uploadItem.name,
          size: uploadItem.size,
          type: 'image',
          alt: currentAlt,
          uploadedBy: 'admin', // TODO: Get from auth context
        });
      } else {
        mediaId = uploadItem.mediaId as Id<"media">;
      }

      // Update content with new image
      await updateContent({
        id,
        content: uploadItem.url,
        type: 'image',
        page,
        mediaId,
        alt: currentAlt,
      });

      setShowMediaPicker(false);
    } catch (error) {
      console.error('Failed to update image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
    // TODO: Show user-friendly error message
  };

  return (
    <div className="relative group">
      <img
        src={currentSrc || fallbackSrc}
        alt={currentAlt}
        className={`${className} ${isEditMode ? 'cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all' : ''}`}
        width={width}
        height={height}
        onClick={handleImageClick}
        data-live-edit-id={id}
        data-live-edit-type="image"
      />
      
      {isEditMode && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleImageClick}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium shadow-lg"
          >
            Change Image
          </button>
        </div>
      )}

      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Image</h3>
              <button
                onClick={() => setShowMediaPicker(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
            
            <MediaPicker
              onUploadComplete={(payload) => void handleUploadComplete(payload)}
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
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
