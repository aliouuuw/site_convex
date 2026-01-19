import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { getPageRegistry } from '../lib/contentRegistry';
import { useEditMode as useEditModeHook } from '../hooks/useEditMode';
import MediaSelector from './MediaSelector';
import { Id } from '../../convex/_generated/dataModel';
import RichTextEditor from './RichTextEditor';
import { FaTrash } from 'react-icons/fa6';
import { sanitizeRichText } from '../../shared/contentSanitizer';

interface EditPanelProps {
  page: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPanel({ page, isOpen, onClose }: EditPanelProps) {
  const { isEditMode } = useEditModeHook();
  const registry = getPageRegistry(page);
  const [isUploading, setIsUploading] = useState(false);

  const updateContent = useMutation(api.content.updateContent);
  const storeMediaRecord = useMutation(api.media.storeMediaRecord);

  // Page-level hydration: fetch all content for current page once
  const pageContents = useQuery(api.content.getContentByPage, { page }) || [];
  const contentMap = useMemo(() => {
    const map = new Map<string, { id: string; content: string; type: 'text' | 'image'; page: string; mediaId?: Id<'media'>; alt?: string }>();
    for (const item of pageContents) {
      map.set(item.id, item as any);
    }
    return map;
  }, [pageContents]);

  if (!isEditMode) return null;

  const handleTextChange = async (id: string, value: string, page: string) => {
    try {
      console.log('Saving text content:', { id, value, page });
      await updateContent({
        id,
        content: value,
        type: 'text',
        page,
      });
      console.log('Text content saved successfully');
    } catch (error) {
      console.error('Failed to update text:', error);
      alert(`Failed to save text content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



  const TextEditor = ({ id, page }: { id: string; page: string }) => {
    const hydrated = contentMap.get(id)?.content || '';
    const [value, setValue] = useState(hydrated);
    const [hasChanges, setHasChanges] = useState(false);

    React.useEffect(() => {
      if (hydrated !== undefined && hydrated !== value) {
        setValue(hydrated);
        setHasChanges(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      setHasChanges(newValue !== hydrated);
    };

    const handleSave = () => {
      if (hasChanges) {
        void handleTextChange(id, value, page);
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
    const currentSrc = contentMap.get(id)?.content;

    const removeImage = async () => {
      // Confirmation dialog
      const confirmed = window.confirm('Are you sure you want to remove this image? This action cannot be undone.');
      if (!confirmed) return;

      try {
        console.log('Removing image:', { id, page });
        await updateContent({
          id,
          content: '',
          type: 'image',
          page,
        });
        console.log('Image removed successfully');
      } catch (error) {
        console.error('Failed to remove image:', error);
        alert(`Failed to remove image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    const handleMediaSelect = async (media: { url: string; name: string; size: number; mediaId?: string }) => {
      try {
        setIsUploading(true);
        
        // Store media record in Convex if it doesn't exist
        let mediaId: Id<"media"> | undefined;
        if (!media.mediaId) {
          mediaId = await storeMediaRecord({
            url: media.url,
            name: media.name,
            size: media.size,
            type: 'image',
            alt: '',
            uploadedBy: 'admin', // TODO: Get from auth context
          });
        } else {
          mediaId = media.mediaId as Id<"media">;
        }

        // Update content with new image
        await updateContent({
          id,
          content: media.url,
          type: 'image',
          page,
          mediaId,
        });

        console.log('Image updated successfully');
      } catch (error) {
        console.error('Failed to update image:', error);
        alert(`Failed to update image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        {currentSrc && (
          <img src={currentSrc} alt="Current" className="w-full h-20 object-cover rounded" />
        )}
        <div className="space-y-1">
          <MediaSelector
            onSelect={(media) => {
              void handleMediaSelect(media);
            }}
            currentImageUrl={currentSrc}
            accept="image/*"
            className="w-full"
            disabled={isUploading}
          />
          {currentSrc && (
            <button
              onClick={() => {
                void removeImage();
              }}
              className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 p-2 rounded border border-red-200 hover:border-red-300 flex items-center justify-center gap-1"
              title="Remove this image"
              disabled={isUploading}
            >
              <FaTrash className="text-xs" />
              Remove Image
            </button>
          )}
        </div>
      </div>
    );
  };

  const SliderEditor = ({ id, page }: { id: string; page: string }) => {
    const currentImages = (() => {
      const existing = contentMap.get(id)?.content;
      if (!existing) return [] as string[];
      try {
        const parsed = JSON.parse(existing);
        return Array.isArray(parsed) ? parsed.filter((x: unknown): x is string => typeof x === 'string') : [];
      } catch {
        return [] as string[];
      }
    })();

    const removeImage = async (index: number) => {
      try {
        const updatedImages = currentImages.filter((_: string, i: number) => i !== index);
        await updateContent({
          id,
          content: JSON.stringify(updatedImages),
          type: 'image',
          page,
        });
      } catch (error) {
        console.error('Failed to remove slider image:', error);
        alert(`Failed to remove image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    const clearAllImages = async () => {
      const confirmed = window.confirm(`Are you sure you want to remove all ${currentImages.length} images? This action cannot be undone.`);
      if (!confirmed) return;

      try {
        await updateContent({
          id,
          content: JSON.stringify([]),
          type: 'image',
          page,
        });
      } catch (error) {
        console.error('Failed to clear slider images:', error);
        alert(`Failed to clear images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    const handleSliderMediaSelect = async (media: { url: string; name: string; size: number; mediaId?: string }) => {
      try {
        setIsUploading(true);
        
        // Add new image to the array
        const updatedImages = [...currentImages, media.url];

        // Store media record in Convex if it doesn't exist
        let mediaId: Id<"media"> | undefined;
        if (!media.mediaId) {
          mediaId = await storeMediaRecord({
            url: media.url,
            name: media.name,
            size: media.size,
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

        console.log('Slider image added successfully');
      } catch (error) {
        console.error('Failed to add slider image:', error);
        alert(`Failed to add image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        {currentImages.length > 0 && (
          <div className="space-y-2">
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {currentImages.map((img: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
                  <img src={img} alt={`Slide ${index + 1}`} className="w-8 h-8 object-cover rounded" />
                  <span className="text-xs flex-1 truncate">{img.split('/').pop()}</span>
                  <button
                    onClick={() => {
                      void removeImage(index);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded flex items-center gap-1"
                    title={`Remove image ${index + 1}`}
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
            {currentImages.length > 1 && (
              <button
                onClick={() => {
                  void clearAllImages();
                }}
                className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 p-2 rounded border border-red-200 hover:border-red-300 flex items-center justify-center gap-1"
                title="Remove all images"
              >
                <FaTrash className="text-xs" />
                Clear All ({currentImages.length})
              </button>
            )}
          </div>
        )}
        <MediaSelector
          onSelect={(media) => {
            void handleSliderMediaSelect(media);
          }}
          accept="image/*"
          className="w-full"
          disabled={isUploading}
        />
      </div>
    );
  };

  const RichTextField = ({ id, page }: { id: string; page: string }) => {
    const hydrated = contentMap.get(id)?.content || '';
    const [value, setValue] = useState(hydrated);
    const [hasChanges, setHasChanges] = useState(false);

    React.useEffect(() => {
      if (hydrated !== undefined && hydrated !== value) {
        setValue(hydrated);
        setHasChanges(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hydrated]);

    const handleSave = async () => {
      if (!hasChanges) return;
      try {
        const sanitized = sanitizeRichText(value);
        if (sanitized === hydrated) {
          setHasChanges(false);
          setValue(hydrated);
          return;
        }
        console.log('Saving rich text content:', { id, value: sanitized, page });
        await updateContent({ id, content: sanitized, type: 'richText', page });
        console.log('Rich text content saved successfully');
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to update rich text:', error);
        alert(`Failed to save rich text content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    return (
      <div className="space-y-2">
        <RichTextEditor content={value} onChange={(v) => { setValue(v); setHasChanges(v !== hydrated); }} minHeight={200} maxHeight={400} />
        {hasChanges && (
          <button
            onClick={() => {
              void handleSave();
            }}
            className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/90"
          >
            Save Changes
          </button>
        )}
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
                    {item.type === 'richText' && <RichTextField id={item.id} page={item.page} />}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Unregistered content detection */}
          {(() => {
            const registeredIds = new Set(
              Object.values(registry).flat().map((i) => i.id)
            );
            const unregistered = pageContents.filter((c) => !registeredIds.has(c.id));
            if (unregistered.length === 0) return null;
            if (import.meta.env.DEV) {
              // Dev-only warning to help keep registry in sync
              // eslint-disable-next-line no-console
              console.warn(`[EditPanel] Unregistered content for page "${page}":`, unregistered.map((u) => u.id));
            }
            return (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-amber-700 mb-2">Unregistered content</h3>
                <div className="space-y-2">
                  {unregistered.map((u) => (
                    <div key={u._id as unknown as string} className="border rounded p-2 bg-amber-50">
                      <div className="text-xs text-gray-700 font-medium">{u.id}</div>
                      <div className="text-xs text-gray-600 truncate">{u.content}</div>
                      <div className="mt-2 flex gap-2">
                        <button
                          className="text-xs px-2 py-1 border rounded"
                          onClick={() => {
                            void navigator.clipboard.writeText(u.id);
                          }}
                        >
                          Copy ID
                        </button>
                        <button
                          className="text-xs px-2 py-1 border rounded"
                          onClick={() => {
                            // eslint-disable-next-line no-console
                            console.log('Add to registry:', { id: u.id, page });
                            alert('Add this ID to the page registry in src/lib/contentRegistry.ts');
                          }}
                        >
                          Add to registry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Media Picker Modal */}
      {/* This section is no longer needed as MediaSelector handles its own state */}
      {/* {showMediaPicker && editingItem && (
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
            
            <MediaSelector
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
      )} */}
    </>
  );
}


