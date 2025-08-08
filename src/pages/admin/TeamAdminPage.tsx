import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/ConfirmDialog";
import MediaPicker from "../../components/MediaPicker";

interface TeamMemberFormProps {
  member?: any;
  onClose: () => void;
  onSave: () => void;
}

function TeamMemberForm({ member, onClose, onSave }: TeamMemberFormProps) {
  const [name, setName] = useState(member?.name || "");
  const [role, setRole] = useState(member?.role || "");
  const [photo, setPhoto] = useState(member?.photo || "");
  const [bio, setBio] = useState(member?.bio || "");
  const [order, setOrder] = useState(member?.order || 0);
  const [visible, setVisible] = useState(member?.visible ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const createMember = useMutation(api.team.createTeamMember);
  const updateMember = useMutation(api.team.updateTeamMember);

  const handleMediaUpload = (payload: { previews: string[]; uploadData: Array<{ url: string; name: string; size: number; mediaId?: string }> }) => {
    if (payload.uploadData.length > 0) {
      const uploadedUrl = payload.uploadData[0].url;
      setPhoto(uploadedUrl);
      setUploadError(null);
    }
  };

  const handleMediaUploadError = (error: Error) => {
    setUploadError(error.message);
    toast.error(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const memberData = {
      name,
      role: role || undefined,
      photo: photo || undefined,
      bio: bio || undefined,
      order,
      visible,
    };

    try {
      if (member) {
        await updateMember({ id: member._id, ...memberData });
        toast.success("Team member updated successfully!");
      } else {
        await createMember(memberData);
        toast.success("Team member created successfully!");
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Error saving member:", error);
      const errorMessage = error?.message || "Failed to save team member";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {member ? "Edit Team Member" : "Add New Team Member"}
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
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="e.g., Teacher, Director, Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            <MediaPicker
              onUploadComplete={handleMediaUpload}
              onUploadError={handleMediaUploadError}
              className="mb-3"
              accept="image/*"
              multiple={false}
              disabled={isSubmitting}
            />
            {uploadError && (
              <div className="text-red-600 text-sm mb-2">{uploadError}</div>
            )}
            {photo && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={photo}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-sm text-gray-500">Current photo</span>
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
            {!photo && name && (
              <div className="mt-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                  {getInitials(name)}
                </div>
                <span className="text-sm text-gray-500">No photo uploaded</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="Brief description about this team member..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
              Visible on public team page
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
              disabled={isSubmitting || !name.trim()}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Saving..." : (member ? "Update Member" : "Add Member")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; member: any }>({
    isOpen: false,
    member: null,
  });

  // Use the new listAllTeamMembers query to see both visible and hidden members
  const members = useQuery(api.team.listAllTeamMembers);
  const deleteMember = useMutation(api.team.deleteTeamMember);

  const handleCreate = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (member: any) => {
    setDeleteConfirm({ isOpen: true, member });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.member) return;

    try {
      await deleteMember({ id: deleteConfirm.member._id });
      toast.success("Team member deleted successfully!");
      setDeleteConfirm({ isOpen: false, member: null });
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast.error(error?.message || "Failed to delete team member");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
          <h1 className="text-xl font-bold text-gray-900">Team Members</h1>
          <button
            onClick={handleCreate}
            className="btn btn-primary"
          >
            Add New Member
          </button>
        </div>

        {members === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members yet. Add your first member!</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={member.photo}
                                alt={member.name}
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium ${member.photo ? 'hidden' : 'flex'}`}
                            >
                              {getInitials(member.name)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            {member.bio && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {member.bio.length > 50 ? `${member.bio.slice(0, 50)}...` : member.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.role || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.visible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(member.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
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
          <TeamMemberForm
            member={editingMember}
            onClose={() => setShowForm(false)}
            onSave={() => {
              // The form will close itself and show a toast
            }}
          />
        )}

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, member: null })}
          onConfirm={() => void confirmDelete()}
          title="Delete Team Member"
          message={
            <div>
              <p>Are you sure you want to delete this team member?</p>
              <p className="font-semibold mt-2">"{deleteConfirm.member?.name}"</p>
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
