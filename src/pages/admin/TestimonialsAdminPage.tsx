import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import MediaSelector from "../../components/MediaSelector";

function StatusBadge({ visible, featured }: { visible?: boolean; featured?: boolean }) {
  return (
    <div className="flex gap-1">
      {visible ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200">
          Visible
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
          Hidden
        </span>
      )}
      {featured && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
          Featured
        </span>
      )}
    </div>
  );
}

function TestimonialForm({ 
  testimonial, 
  onSave, 
  onCancel, 
  isLoading 
}: { 
  testimonial?: any; 
  onSave: (data: any) => void; 
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    quote: testimonial?.quote || "",
    author: testimonial?.author || "",
    role: testimonial?.role || "",
    imageUrl: testimonial?.imageUrl || "",
    imageName: testimonial?.imageName || "",
    imageSize: testimonial?.imageSize || 0,
    imageUploadedAt: testimonial?.imageUploadedAt || "",
    featured: testimonial?.featured || false,
    visible: testimonial?.visible !== false, // default to true
    order: testimonial?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quote.trim() || !formData.author.trim() || !formData.role.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
            Quote *
          </label>
          <textarea
            id="quote"
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
            placeholder="Enter the testimonial quote..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Mme Fatou Diop"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Parent d'élève"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Image
          </label>
          <MediaSelector
            onSelect={(media) => {
              setFormData({
                ...formData,
                imageUrl: media.url,
                imageName: media.name,
                imageSize: media.size,
                imageUploadedAt: media.url ? new Date().toISOString() : "",
              });
            }}
            currentImageUrl={formData.imageUrl}
            accept="image/*"
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={formData.visible}
              onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
              Visible on homepage
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured testimonial
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : testimonial ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TestimonialsAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; testimonial: any }>({
    isOpen: false,
    testimonial: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const testimonials = useQuery(api.testimonials.listAllTestimonials, { limit: 50 });
  const createTestimonial = useMutation(api.testimonials.createTestimonial);
  const updateTestimonial = useMutation(api.testimonials.updateTestimonial);
  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);
  const toggleVisibility = useMutation(api.testimonials.toggleTestimonialVisibility);
  const toggleFeatured = useMutation(api.testimonials.toggleTestimonialFeatured);

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowForm(true);
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleSave = async (formData: any) => {
    setIsLoading(true);
    try {
      const testimonialData = {
        quote: formData.quote,
        author: formData.author,
        role: formData.role,
        imageUrl: formData.imageUrl,
        imageName: formData.imageName,
        imageSize: formData.imageSize,
        imageUploadedAt: formData.imageUploadedAt,
        featured: formData.featured,
        visible: formData.visible,
        order: formData.order,
      };

      if (editingTestimonial) {
        await updateTestimonial({
          id: editingTestimonial._id,
          ...testimonialData,
        });
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial(testimonialData);
        toast.success("Testimonial created successfully!");
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch (error: any) {
      console.error("Error saving testimonial:", error);
      toast.error(error?.message || "Failed to save testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (testimonial: any) => {
    setDeleteConfirm({ isOpen: true, testimonial });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.testimonial) return;

    try {
      await deleteTestimonial({ id: deleteConfirm.testimonial._id });
      toast.success("Testimonial deleted successfully!");
      setDeleteConfirm({ isOpen: false, testimonial: null });
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast.error(error?.message || "Failed to delete testimonial");
    }
  };

  const handleToggleVisibility = async (testimonial: any) => {
    try {
      await toggleVisibility({ id: testimonial._id });
      toast.success(`Testimonial ${testimonial.visible ? "hidden" : "made visible"} successfully!`);
    } catch (error: any) {
      console.error("Error toggling visibility:", error);
      toast.error(error?.message || "Failed to toggle visibility");
    }
  };

  const handleToggleFeatured = async (testimonial: any) => {
    try {
      await toggleFeatured({ id: testimonial._id });
      toast.success(`Testimonial ${testimonial.featured ? "unfeatured" : "featured"} successfully!`);
    } catch (error: any) {
      console.error("Error toggling featured:", error);
      toast.error(error?.message || "Failed to toggle featured status");
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
          <h1 className="text-xl font-bold text-gray-900">Testimonials</h1>
          {!showForm && (
            <button
              onClick={handleCreate}
              className="btn btn-primary"
            >
              Add New Testimonial
            </button>
          )}
        </div>

        {showForm && (
          <TestimonialForm
            testimonial={editingTestimonial}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {testimonials === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : testimonials.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials yet. Create your first one!</p>
          </div>
        ) : !showForm && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Testimonial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
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
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          {testimonial.imageUrl ? (
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.author}
                              className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold mr-3 flex-shrink-0">
                              {testimonial.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              "{testimonial.quote}"
                            </p>
                            {testimonial.imageName && (
                              <p className="text-xs text-gray-500 mt-1">
                                📷 {testimonial.imageName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge visible={testimonial.visible} featured={testimonial.featured} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {testimonial.order || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(testimonial.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => void handleToggleVisibility(testimonial)}
                            className={`text-sm font-medium ${
                              testimonial.visible 
                                ? "text-yellow-600 hover:text-yellow-800" 
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {testimonial.visible ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => void handleToggleFeatured(testimonial)}
                            className={`text-sm font-medium ${
                              testimonial.featured 
                                ? "text-orange-600 hover:text-orange-800" 
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            {testimonial.featured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            onClick={() => handleEdit(testimonial)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(testimonial)}
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
          onClose={() => setDeleteConfirm({ isOpen: false, testimonial: null })}
          onConfirm={() => void confirmDelete()}
          title="Delete Testimonial"
          message={
            <div>
              <p>Are you sure you want to delete this testimonial?</p>
              <p className="font-semibold mt-2">From: {deleteConfirm.testimonial?.author}</p>
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
