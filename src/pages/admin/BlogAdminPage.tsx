import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

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
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; post: any }>({
    isOpen: false,
    post: null,
  });

  const posts = useQuery(api.blog.listAllBlogPosts, { limit: 50 });
  const deletePost = useMutation(api.blog.deleteBlogPost);
  const publishPost = useMutation(api.blog.publishBlogPost);
  const unpublishPost = useMutation(api.blog.unpublishBlogPost);

  const handleCreate = () => {
    void navigate("/admin/blog/create");
  };

  const handleEdit = (post: any) => {
    void navigate(`/admin/blog/edit/${post.slug}`);
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
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
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
