import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RichTextEditor from "../../components/RichTextEditor";
import MediaPicker from "../../components/MediaPicker";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string; // URL to Uploadthing file
  coverImageName: string; // Original filename
  coverImageSize: number; // File size in bytes
  coverImageUploadedAt: string; // ISO timestamp
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
}

export default function BlogEditorPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    contentHtml: "",
    coverImageUrl: "",
    coverImageName: "",
    coverImageSize: 0,
    coverImageUploadedAt: "",
    author: "",
    category: "",
    tags: [],
    featured: false,
    status: "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Fetch existing post if editing - use the edit query that bypasses status checks
  const existingPost = useQuery(
    api.blog.getBlogPostForEdit,
    isEditing && slug ? { slug: slug } : "skip"
  );

  useEffect(() => {
    if (existingPost && isEditing) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt || "",
        contentHtml: existingPost.contentHtml || "",
        coverImageUrl: existingPost.coverImageUrl || "",
        coverImageName: existingPost.coverImageName || "",
        coverImageSize: existingPost.coverImageSize || 0,
        coverImageUploadedAt: existingPost.coverImageUploadedAt || "",
        author: existingPost.author || "",
        category: existingPost.category || "",
        tags: existingPost.tags || [],
        featured: existingPost.featured || false,
        status: existingPost.status,
      });
      // Set preview if we have a coverImageUrl
      if (existingPost.coverImageUrl) {
        setCoverImagePreview(existingPost.coverImageUrl);
      } else {
        setCoverImagePreview(null);
      }
    }
  }, [existingPost, isEditing]);

  const createPost = useMutation(api.blog.createBlogPost);
  const updatePost = useMutation(api.blog.updateBlogPost);

  const generateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData(prev => ({ ...prev, slug: generated }));
  };

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);
    handleInputChange("tags", tags);
  };

  const handleCoverImageUpload = async (uploadData: { url: string; name: string; size: number; mediaId?: string }) => {
    try {
      // If backend already returned a mediaId, use the returned URL and metadata
      if (uploadData.mediaId) {
        handleInputChange("coverImageUrl", uploadData.url);
        handleInputChange("coverImageName", uploadData.name);
        handleInputChange("coverImageSize", uploadData.size);
        handleInputChange("coverImageUploadedAt", new Date().toISOString());
        setCoverImagePreview(uploadData.url);
        return;
      }

      // Media record should have been created by the upload endpoint
      // If no mediaId was returned, just use the upload data directly
      console.warn("No mediaId returned from upload - media record may not have been created");

      // Persisted — set post fields
      handleInputChange("coverImageUrl", uploadData.url);
      handleInputChange("coverImageName", uploadData.name);
      handleInputChange("coverImageSize", uploadData.size);
      handleInputChange("coverImageUploadedAt", new Date().toISOString());
      setCoverImagePreview(uploadData.url);
    } catch (err) {
      console.error("Failed to persist media or set cover image:", err);
      // still set preview locally so the user sees the image immediately
      handleInputChange("coverImageUrl", uploadData.url);
      handleInputChange("coverImageName", uploadData.name);
      handleInputChange("coverImageSize", uploadData.size);
      handleInputChange("coverImageUploadedAt", new Date().toISOString());
      setCoverImagePreview(uploadData.url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const savePromise = isEditing 
      ? (async () => {
          // We already have the post data from the existingPost query
          if (!existingPost) {
            throw new Error("Blog post not found");
          }
          return updatePost({ id: existingPost._id, ...formData });
        })()
      : createPost(formData);

    savePromise
      .then(() => {
        toast.success(isEditing ? "Blog post updated successfully!" : "Blog post created successfully!");
        void navigate("/admin/blog");
      })
      .catch((error: any) => {
        console.error("Error saving post:", error);
        const errorMessage = error?.message || "Failed to save blog post";
        setError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to discard your changes?")) {
      void navigate("/admin/blog");
    }
  };

  // Show loading state when fetching existing post
  if (isEditing && existingPost === undefined) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading blog post...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state if post not found
  if (isEditing && existingPost === null) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Blog Post Not Found</h2>
            <p className="text-red-600 mb-4">The blog post you're trying to edit doesn't exist or you don't have permission to access it.</p>
            <button
              onClick={() => void navigate("/admin/blog")}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Back to Blog List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update your blog post content" : "Write and publish your blog post"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="Enter blog post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                    placeholder="blog-post-slug"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    disabled={!formData.title || isSubmitting}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="Author name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="Category..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (external)
                </label>
                <input
                  type="url"
                  value={formData.coverImageUrl}
                  onChange={(e) => {
                    handleInputChange("coverImageUrl", e.target.value);
                    setCoverImagePreview(e.target.value);
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                  placeholder="image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <MediaPicker
                  onUploadComplete={({ uploadData }) => {
                    // Use the uploadData for persistence and preview for immediate UI
                    if (uploadData.length > 0) {
                      void handleCoverImageUpload(uploadData[0]);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                    toast.error("Failed to upload image");
                  }}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {coverImagePreview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        setCoverImagePreview(null);
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-lg border border-gray-200 p-0">
            <div className="px-6 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            </div>
            {/* Ensure popovers overlay outside the editor area */}
            <div className="relative z-0 px-4 h-fit pb-4">
              {/* Prevent Enter or toolbar interactions inside the editor from submitting the form */}
              <div
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    // allow Cmd/Ctrl+Enter to submit if desired; currently disabled
                    e.preventDefault();
                    e.stopPropagation();
                  } else if (e.key === "Enter") {
                    // prevent plain Enter from triggering implicit submit on some browsers
                    e.stopPropagation();
                  }
                }}
                onMouseDown={(e) => {
                  // Prevent toolbar button clicks inside the editor area from bubbling to form
                  // which could trigger a submit via implicit behavior.
                  e.stopPropagation();
                }}
              >
                <RichTextEditor
                  content={formData.contentHtml}
                  onChange={(content) => handleInputChange("contentHtml", content)}
                  placeholder="Start writing your blog post content..."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured post
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // Wrap async logic in a void IIFE to satisfy no-misused-promises (void return expected).
                  void (async () => {
                    // Explicitly save draft without submitting the form element, avoiding unintended navigations.
                    setIsSubmitting(true);
                    setError(null);
                    try {
                      if (isEditing) {
                        if (!existingPost) throw new Error("Blog post not found");
                        await updatePost({ id: existingPost._id, ...formData, status: "draft" });
                        toast.success("Draft saved");
                      } else {
                        await createPost({ ...formData, status: "draft" });
                        toast.success("Draft created");
                      }
                    } catch (err: any) {
                      const msg = err?.message || "Failed to save draft";
                      setError(msg);
                      toast.error(msg);
                    } finally {
                      setIsSubmitting(false);
                    }
                  })();
                }}
                disabled={isSubmitting || !formData.title.trim() || !formData.slug.trim()}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Draft
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.slug.trim()}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
