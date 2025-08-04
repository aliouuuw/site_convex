import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

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

  const createMember = useMutation(api.team.createTeamMember);
  const updateMember = useMutation(api.team.updateTeamMember);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      } else {
        await createMember(memberData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {member ? "Edit Team Member" : "Add New Team Member"}
          </h2>
        </div>
        
        <form onSubmit={(e) => { void handleSubmit(e); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label htmlFor="visible" className="ml-2 block text-sm text-gray-700">
                Visible
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {member ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamAdminPage() {
  const members = useQuery(api.team.listTeamMembers, {});
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const handleSave = () => {
    // The query will automatically refresh when the component re-renders
    // No manual refetch needed with Convex React
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Team</h2>
            <p className="text-gray-600">Manage your team members</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Member
          </button>
        </div>

        {!members && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading team members…
          </div>
        )}

        {members && members.length === 0 && (
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-600">
            No team members yet. Add your first team member.
          </div>
        )}

        {members && members.length > 0 && (
          <div className="grid gap-4">
            {members.map((m) => (
              <div
                key={m._id as string}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 flex-shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{m.name}</h3>
                  {m.role && (
                    <p className="text-sm text-gray-600 mt-1">{m.role}</p>
                  )}
                </div>
                {m.bio && (
                  <div className="text-sm text-gray-600 max-w-md">
                    {m.bio.substring(0, 100)}{m.bio.length > 100 ? "…" : ""}
                  </div>
                )}
                <button
                  onClick={() => setEditingMember(m)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {(showForm || editingMember) && (
          <TeamMemberForm
            member={editingMember}
            onClose={() => {
              setShowForm(false);
              setEditingMember(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </AdminLayout>
  );
}
