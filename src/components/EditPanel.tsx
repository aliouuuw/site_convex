import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getPageRegistry } from '../lib/contentRegistry';
import { useEditMode as useEditModeHook } from '../hooks/useEditMode';
import MediaPicker from './MediaPicker';
import { Id } from '../../convex/_generated/dataModel';

interface EditPanelProps {
  page: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPanel({ page, isOpen, onClose }: EditPanelProps) {
  const { isEditMode } = useEditModeHook();
  const registry = getPageRegistry(page);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateContent = useMutation(api.content.updateContent);
  const storeMediaRecord = useMutation(api.media.storeMediaRecord);

  if (!isEditMode) return null;

  const handleTextChange = async (id: string, value: string, page: string) => {
    try {
      await updateContent({
        id,
        content: value,
        type: 'text',
        page,
      });
    } catch (error) {
      console.error('Failed to update text:', error);
    }
  };

  const handleImageUpload = async (id: string, page: string, payload: {
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
          alt: '',
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
      });

      setShowMediaPicker(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSliderUpload = async (id: string, page: string, payload: {
    previews: string[];
    uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }>;
  }) => {
    try {
      setIsUploading(true);
      const uploadItem = payload.uploadData[0];
      
      if (!uploadItem) {
        throw new Error('No upload data received');
      }

      // Get current images
      const content = await api.content.getContent({ id });
      const currentImages = content?.content ? JSON.parse(content.content) : [];
      
      // Add new image to the array
      const updatedImages = [...currentImages, uploadItem.url];

      // Store media record
      let mediaId: Id<"media"> | undefined;
      if (!uploadItem.mediaId) {
        mediaId = await storeMediaRecord({
          url: uploadItem.url,
          name: uploadItem.name,
          size: uploadItem.size,
          type: 'image',
          alt: `${id} image`,
          uploadedBy: 'admin',
        });
      }

      // Update content
      await updateContent({
        id,
        content: JSON.stringify(updatedImages),
        type: 'image',
        page,
        mediaId,
      });

      setShowMediaPicker(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update slider:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const TextEditor = ({ id, page }: { id: string; page: string }) => {
    const content = useQuery(api.content.getContent, { id });
    const [value, setValue] = useState(content?.content || '');
    const [hasChanges, setHasChanges] = useState(false);

    React.useEffect(() => {
      if (content?.content !== undefined && content.content !== value) {
        setValue(content.content);
        setHasChanges(false);
      }
    }, [content?.content]);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      setHasChanges(newValue !== (content?.content || ''));
    };

    const handleSave = () => {
      if (hasChanges) {
        handleTextChange(id, value, page);
        setHasChanges(false);
      }
    };

    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full p-2 border rounded text-sm resize-none min-h-[60px]"
          placeholder="Enter text..."
        />
        {hasChanges && (
          <button
            onClick={handleSave}
            className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90"
          >
            Save Changes
          </button>
        )}
      </div>
    );
  };

  const ImageEditor = ({ id, page }: { id: string; page: string }) => {
    const content = useQuery(api.content.getContent, { id });
    const currentSrc = content?.content;

    return (
      <div className="space-y-2">
        {currentSrc && (
          <img src={currentSrc} alt="Current" className="w-full h-20 object-cover rounded" />
        )}
        <button
          onClick={() => {
            setEditingItem(id);
            setShowMediaPicker(true);
          }}
          className="w-full text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded border"
        >
          {currentSrc ? 'Change Image' : 'Add Image'}
        </button>
      </div>
    );
  };

  const SliderEditor = ({ id, page }: { id: string; page: string }) => {
    const content = useQuery(api.content.getContent, { id });
    const currentImages = content?.content ? JSON.parse(content.content) : [];

    const removeImage = async (index: number) => {
      const updatedImages = currentImages.filter((_: string, i: number) => i !== index);
      await updateContent({
        id,
        content: JSON.stringify(updatedImages),
        type: 'image',
        page,
      });
    };

    return (
      <div className="space-y-2">
        {currentImages.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentImages.map((img: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
                <img src={img} alt={`Slide ${index + 1}`} className="w-8 h-8 object-cover rounded" />
                <span className="text-xs flex-1 truncate">{img.split('/').pop()}</span>
                <button
                  onClick={() => removeImage(index)}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            setEditingItem(id);
            setShowMediaPicker(true);
          }}
          className="w-full text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded border"
        >
          Add Image
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-[380px] max-w-[88vw] bg-white shadow-2xl border-l z-[1000] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit {page.charAt(0).toUpperCase() + page.slice(1)} Page</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>

        <div className="p-3 overflow-y-auto h-[calc(100%-56px)]">
          {Object.entries(registry).map(([section, items]) => (
            <div key={section} className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize">{section}</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border rounded p-2">
                    <div className="text-xs font-medium text-gray-600 mb-2">{item.label}</div>
                    {item.type === 'text' && <TextEditor id={item.id} page={item.page} />}
                    {item.type === 'image' && <ImageEditor id={item.id} page={item.page} />}
                    {item.type === 'imageSlider' && <SliderEditor id={item.id} page={item.page} />}
                    {item.type === 'richText' && <TextEditor id={item.id} page={item.page} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {registry[Object.keys(registry).find(section => 
                  registry[section].some(item => item.id === editingItem)
                ) || '']?.find(item => item.id === editingItem)?.type === 'imageSlider' 
                  ? 'Add Image to Slider' 
                  : 'Select Image'
                }
              </h3>
              <button
                onClick={() => {
                  setShowMediaPicker(false);
                  setEditingItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
            
            <MediaPicker
              onUploadComplete={(payload) => {
                const itemType = Object.values(registry)
                  .flat()
                  .find(item => item.id === editingItem)?.type;
                
                if (itemType === 'imageSlider') {
                  handleSliderUpload(editingItem, page, payload);
                } else {
                  handleImageUpload(editingItem, page, payload);
                }
              }}
              onUploadError={(error) => {
                console.error('Upload error:', error);
                setShowMediaPicker(false);
                setEditingItem(null);
              }}
              accept="image/*"
              disabled={isUploading}
              className="mb-4"
            />
            
            {isUploading && (
              <div className="text-center text-sm text-gray-600">
                Uploading image...
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowMediaPicker(false);
                  setEditingItem(null);
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
}


