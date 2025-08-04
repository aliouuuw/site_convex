import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function BlogAdminPage() {
  const posts = useQuery(api.blog.listPublishedBlogPosts, { limit: 20 });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-2">Blog</h2>
        <p className="text-gray-600 mb-6">Manage your blog posts</p>

        {!posts && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading posts…
          </div>
        )}

        {posts && posts.length === 0 && (
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-600">
            No posts yet. Create your first blog post.
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="grid gap-4">
            {posts.map((p) => (
              <div
                key={p._id as string}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {p.title}
                  </h3>
                  {p.featured && (
                    <span className="bg-accent text-gray-900 px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  slug:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                    {p.slug}
                  </code>
                </div>
                <div className="text-sm text-gray-600">
                  {p.publishedAt
                    ? `Published: ${new Date(
                        p.publishedAt
                      ).toLocaleDateString()}`
                    : "Not published"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
