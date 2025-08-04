import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

interface BlogPostFormProps {
  post?: any;
  onClose: () => void;
  onSave: () => void;
}

function BlogPostForm({ post, onClose, onSave }: BlogPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [contentHtml, setContentHtml] = useState(post?.contentHtml || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [category, setCategory] = useState(post?.category || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [featured, setFeatured] = useState(post?.featured || false);
  const [status, setStatus] = useState(post?.status || "draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useMutation(api.blog.createBlogPost);
  const updatePost = useMutation(api.blog.updateBlogPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const postData = {
      slug,
      title,
      excerpt: excerpt || undefined,
      contentHtml: contentHtml || undefined,
      coverImage: coverImage || undefined,
      author: author || undefined,
      category: category || undefined,
      tags: tags
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : undefined,
      featured,
      status,
    };

    try {
      if (post) {
        await updatePost({ id: post._id, ...postData });
        toast.success("Blog post updated successfully!");
      } else {
        await createPost(postData);
        toast.success("Blog post created successfully!");
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving post:", error);
      const errorMessage = error?.message || "Failed to save blog post";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {post ? "Edit Blog Post" : "Create New Blog Post"}
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
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  disabled={!title || isSubmitting}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="Brief description of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (HTML)
            </label>
            <textarea
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              rows={8}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 font-mono text-sm"
              placeholder="<p>Your content here...</p>"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              />
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
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured post
            </label>
          </div>

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
              disabled={isSubmitting || !title.trim() || !slug.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Saving..." : (post ? "Update Post" : "Create Post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    published: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function BlogAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; post: any }>({
    isOpen: false,
    post: null,
  });

  // Use the new listAllBlogPosts query instead of listPublishedBlogPosts
  const posts = useQuery(api.blog.listAllBlogPosts, { limit: 50 });
  const deletePost = useMutation(api.blog.deleteBlogPost);
  const publishPost = useMutation(api.blog.publishBlogPost);
  const unpublishPost = useMutation(api.blog.unpublishBlogPost);

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = (post: any) => {
    setDeleteConfirm({ isOpen: true, post });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.post) return;

    try {
      await deletePost({ id: deleteConfirm.post._id });
      toast.success("Blog post deleted successfully!");
      setDeleteConfirm({ isOpen: false, post: null });
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error(error?.message || "Failed to delete blog post");
    }
  };

  const handlePublish = async (post: any) => {
    try {
      await publishPost({ id: post._id });
      toast.success("Blog post published successfully!");
    } catch (error: any) {
      console.error("Error publishing post:", error);
      toast.error(error?.message || "Failed to publish blog post");
    }
  };

  const handleUnpublish = async (post: any) => {
    try {
      await unpublishPost({ id: post._id });
      toast.success("Blog post unpublished successfully!");
    } catch (error: any) {
      console.error("Error unpublishing post:", error);
      toast.error(error?.message || "Failed to unpublish blog post");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2>Blog Posts</h2>
          <button
            onClick={handleCreate}
            className="btn btn-primary"
          >
            Create New Post
          </button>
        </div>

        {posts === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500">/{post.slug}</div>
                          </div>
                          {post.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={post.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.author || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.category || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(post.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          {post.status === "draft" ? (
                            <button
                              onClick={() => void handlePublish(post)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => void handleUnpublish(post)}
                              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                            >
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <BlogPostForm
            post={editingPost}
            onClose={() => setShowForm(false)}
            onSave={() => {
              // The form will close itself and show a toast
            }}
          />
        )}

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, post: null })}
          onConfirm={() => void confirmDelete()}
          title="Delete Blog Post"
          message={
            <div>
              <p>Are you sure you want to delete this blog post?</p>
              <p className="font-semibold mt-2">"{deleteConfirm.post?.title}"</p>
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
