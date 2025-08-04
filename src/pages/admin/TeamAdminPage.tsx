import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function TeamAdminPage() {
  const members = useQuery(api.team.listTeamMembers, {});

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-2">Team</h2>
        <p className="text-gray-600 mb-6">Manage your team members</p>
        
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
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
