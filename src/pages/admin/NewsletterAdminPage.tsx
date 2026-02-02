import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { FaNewspaper, FaUserCheck, FaUserTimes, FaTrash, FaFilter, FaSpinner, FaDownload } from "react-icons/fa";
import type { Id } from "../../../convex/_generated/dataModel";

type SubscriptionStatus = "active" | "unsubscribed";

export default function NewsletterAdminPage() {
  const [filterStatus, setFilterStatus] = useState<SubscriptionStatus | undefined>("active");

  const subscriptions = useQuery(api.email.listSubscriptions, { status: filterStatus, limit: 1000 });
  const activeCount = useQuery(api.email.countSubscriptions, { status: "active" }) ?? 0;
  const unsubscribedCount = useQuery(api.email.countSubscriptions, { status: "unsubscribed" }) ?? 0;

  const deleteSubscription = useMutation(api.email.deleteSubscription);

  const handleDelete = async (id: Id<"newsletter_subscriptions">) => {
    if (!confirm("Supprimer cet abonné définitivement ?")) return;
    await deleteSubscription({ id });
    toast.success("Abonné supprimé");
  };

  const handleExportCSV = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast.error("Aucun abonné à exporter");
      return;
    }

    const headers = ["Email", "Nom", "Statut", "Date d'inscription", "Source"];
    const rows = subscriptions.map((sub) => [
      sub.email,
      sub.name || "",
      sub.status,
      new Date(sub.subscribedAt).toISOString(),
      sub.source || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Abonnés Newsletter</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez les inscriptions à la newsletter
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark flex items-center gap-2"
          >
            <FaDownload /> Exporter CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUserCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Abonnés actifs</p>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FaUserTimes className="text-gray-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Désinscrits</p>
                <p className="text-2xl font-bold text-gray-900">{unsubscribedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaNewspaper className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{activeCount + unsubscribedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-400" />
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus((e.target.value || undefined) as SubscriptionStatus | undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Tous</option>
            <option value="active">Actifs</option>
            <option value="unsubscribed">Désinscrits</option>
          </select>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscriptions === undefined ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <FaSpinner className="animate-spin mx-auto mb-2" />
                      Chargement...
                    </td>
                  </tr>
                ) : subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Aucun abonné
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{sub.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sub.name || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            sub.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {sub.status === "active" ? "Actif" : "Désinscrit"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(sub.subscribedAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{sub.source || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => { void handleDelete(sub._id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
