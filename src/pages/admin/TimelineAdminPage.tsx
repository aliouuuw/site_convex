import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";

interface TimelineEntryFormProps {
  entry?: any;
  onClose: () => void;
  onSave: () => void;
}

function TimelineEntryForm({ entry, onClose, onSave }: TimelineEntryFormProps) {
  const [year, setYear] = useState(entry?.year || "");
  const [title, setTitle] = useState(entry?.title || "");
  const [description, setDescription] = useState(entry?.description || "");
  const [order, setOrder] = useState(entry?.order || 0);
  const [visible, setVisible] = useState(entry?.visible ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEntry = useMutation(api.timeline.createTimelineEntry);
  const updateEntry = useMutation(api.timeline.updateTimelineEntry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const entryData = {
      year,
      title,
      description,
      order,
      visible,
    };

    try {
      if (entry) {
        await updateEntry({ id: entry._id, ...entryData });
        toast.success("Timeline entry updated successfully!");
      } else {
        await createEntry(entryData);
        toast.success("Timeline entry created successfully!");
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving entry:", error);
      const errorMessage = error?.message || "Failed to save timeline entry";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {entry ? "Edit Timeline Entry" : "Add New Timeline Entry"}
          </h2>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 2003 or Aujourd'hui"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Fondation de L'Institution"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Description of the timeline event"
              required
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="visible" className="ml-2 block text-sm text-gray-900">
              Visible
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TimelineAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [deletingEntry, setDeletingEntry] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const entries = useQuery(api.timeline.listAllTimelineEntries) || [];
  const deleteEntry = useMutation(api.timeline.deleteTimelineEntry);

  const handleCreate = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = (entry: any) => {
    setDeletingEntry(entry);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingEntry) return;
    
    try {
      await deleteEntry({ id: deletingEntry._id });
      toast.success("Timeline entry deleted successfully!");
      setShowDeleteDialog(false);
      setDeletingEntry(null);
    } catch (error: any) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete timeline entry");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Timeline Management</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Timeline Entry
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Timeline Entries ({entries.length})
            </h2>
          </div>

          {entries.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No timeline entries found. Create your first entry to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <div key={entry._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-semibold text-primary">
                          {entry.year}
                        </span>
                        {!entry.visible && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Hidden
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          Order: {entry.order}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {entry.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {entry.description}
                      </p>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(entry.createdAt)}
                        {entry.updatedAt !== entry.createdAt && (
                          <span className="ml-4">
                            Updated: {formatDate(entry.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="px-3 py-1 text-sm text-primary hover:text-primary-dark focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <TimelineEntryForm
            entry={editingEntry}
            onClose={() => setShowForm(false)}
            onSave={() => setShowForm(false)}
          />
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => { void confirmDelete(); }}
          title="Delete Timeline Entry"
          message={`Are you sure you want to delete "${deletingEntry?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </AdminLayout>
  );
}
