import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaArchive, FaTrash, FaFilter, FaSpinner, FaPaperPlane, FaExclamationTriangle, FaCheckCircle, FaRedo } from "react-icons/fa";
import type { Id } from "../../../convex/_generated/dataModel";

type MessageStatus = "new" | "read" | "replied" | "archived";

const statusLabels: Record<MessageStatus, string> = {
  new: "Nouveau",
  read: "Lu",
  replied: "Répondu",
  archived: "Archivé",
};

const statusColors: Record<MessageStatus, string> = {
  new: "bg-red-100 text-red-800",
  read: "bg-blue-100 text-blue-800",
  replied: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

export default function MessagesAdminPage() {
  const [filterStatus, setFilterStatus] = useState<MessageStatus | undefined>(undefined);
  const [selectedMessage, setSelectedMessage] = useState<Id<"contact_messages"> | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const messages = useQuery(api.email.listMessages, { status: filterStatus, limit: 100 });
  const selectedMessageData = useQuery(
    api.email.getMessage,
    selectedMessage ? { id: selectedMessage } : "skip"
  );

  const markAsRead = useMutation(api.email.markAsRead);
  const replyToMessage = useMutation(api.email.replyToMessage);
  const archiveMessage = useMutation(api.email.archiveMessage);
  const deleteMessage = useMutation(api.email.deleteMessage);
  const resendNotification = useMutation(api.email.resendNotification);

  const handleSelect = async (id: Id<"contact_messages">, status: string) => {
    setSelectedMessage(id);
    setReplyText("");
    setShowResendForm(false);
    setResendEmail("");
    if (status === "new") {
      await markAsRead({ id });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setIsReplying(true);
    try {
      await replyToMessage({ id: selectedMessage, replyMessage: replyText });
      toast.success("Réponse enregistrée");
      setReplyText("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la réponse");
    } finally {
      setIsReplying(false);
    }
  };

  const handleArchive = async (id: Id<"contact_messages">) => {
    await archiveMessage({ id });
    if (selectedMessage === id) setSelectedMessage(null);
    toast.success("Message archivé");
  };

  const handleDelete = async (id: Id<"contact_messages">) => {
    if (!confirm("Supprimer ce message définitivement ?")) return;
    await deleteMessage({ id });
    if (selectedMessage === id) setSelectedMessage(null);
    toast.success("Message supprimé");
  };

  const handleResend = async () => {
    if (!selectedMessage) return;
    setIsResending(true);
    try {
      const result = await resendNotification({
        id: selectedMessage,
        customEmail: resendEmail || undefined,
      });
      toast.success(`Email envoyé à ${result.emailTo}`);
      setShowResendForm(false);
      setResendEmail("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi");
    } finally {
      setIsResending(false);
    }
  };

  const getEmailStatusIcon = (msg: any) => {
    if (msg.emailSent === true) {
      return <FaCheckCircle className="text-green-500" title="Email envoyé" />;
    } else if (msg.emailSent === false || msg.emailError) {
      return <FaExclamationTriangle className="text-red-500" title={`Erreur: ${msg.emailError || "Échec"}`} />;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages de contact</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterStatus || ""}
              onChange={(e) => setFilterStatus((e.target.value || undefined) as MessageStatus | undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Tous les messages</option>
              <option value="new">Nouveaux</option>
              <option value="read">Lus</option>
              <option value="replied">Répondus</option>
              <option value="archived">Archivés</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-medium text-gray-900">
                {messages?.length ?? 0} message(s)
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {messages === undefined ? (
                <div className="p-8 text-center text-gray-500">
                  <FaSpinner className="animate-spin mx-auto mb-2" />
                  Chargement...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun message
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div
                    key={msg._id}
                    onClick={() => { void handleSelect(msg._id, msg.status); }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage === msg._id ? "bg-primary/5 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {msg.status === "new" ? (
                          <FaEnvelope className="text-red-500" />
                        ) : (
                          <FaEnvelopeOpen className="text-gray-400" />
                        )}
                        <span className="font-medium text-gray-900">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEmailStatusIcon(msg)}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[msg.status as MessageStatus]}`}>
                          {statusLabels[msg.status as MessageStatus]}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.receivedAt).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {selectedMessageData ? (
              <div className="h-full flex flex-col">
                <div className="border-b border-gray-200 p-4 flex justify-between items-start">
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedMessageData.subject}</h2>
                    <p className="text-sm text-gray-500">
                      De: {selectedMessageData.name} &lt;{selectedMessageData.email}&gt;
                    </p>
                    {selectedMessageData.phone && (
                      <p className="text-sm text-gray-500">Tél: {selectedMessageData.phone}</p>
                    )}
                    {selectedMessageData.department && (
                      <p className="text-sm text-gray-500">Service: {selectedMessageData.department}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowResendForm(!showResendForm)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Renvoyer l'email de notification"
                    >
                      <FaRedo />
                    </button>
                    <button
                      onClick={() => handleArchive(selectedMessageData._id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Archiver"
                    >
                      <FaArchive />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessageData._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  {/* Email Status */}
                  <div className="mb-4 p-3 rounded-lg text-sm">
                    {selectedMessageData.emailSent === true ? (
                      <div className="bg-green-50 text-green-700 flex items-center gap-2">
                        <FaCheckCircle />
                        <span>
                          Email envoyé à <strong>{selectedMessageData.emailTo}</strong> le{" "}
                          {selectedMessageData.emailSentAt
                            ? new Date(selectedMessageData.emailSentAt).toLocaleString("fr-FR")
                            : ""}
                        </span>
                      </div>
                    ) : selectedMessageData.emailError ? (
                      <div className="bg-red-50 text-red-700 flex items-center gap-2">
                        <FaExclamationTriangle />
                        <span>Erreur d'envoi: {selectedMessageData.emailError}</span>
                      </div>
                    ) : selectedMessageData.emailSent === false ? (
                      <div className="bg-yellow-50 text-yellow-700 flex items-center gap-2">
                        <FaExclamationTriangle />
                        <span>Échec de l'envoi de l'email de notification</span>
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-gray-600 flex items-center gap-2">
                        <FaPaperPlane />
                        <span>Statut d'envoi inconnu</span>
                      </div>
                    )}
                  </div>

                  {/* Resend Form */}
                  {showResendForm && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Renvoyer l'email de notification</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        L'email sera envoyé à l'adresse configurée dans les paramètres (ou celle saisie ci-dessous).
                      </p>
                      <input
                        type="email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="Email personnalisé (optionnel)"
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => { void handleResend(); }}
                          disabled={isResending}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaPaperPlane /> {isResending ? "Envoi..." : "Envoyer"}
                        </button>
                        <button
                          onClick={() => setShowResendForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                    {selectedMessageData.message}
                  </div>

                  {selectedMessageData.replyMessage && (
                    <div className="mt-4 bg-green-50 rounded-lg p-4">
                      <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
                        <FaReply /> Réponse envoyée le{" "}
                        {selectedMessageData.repliedAt
                          ? new Date(selectedMessageData.repliedAt).toLocaleString("fr-FR")
                          : ""}
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedMessageData.replyMessage}
                      </p>
                    </div>
                  )}
                </div>

                {selectedMessageData.status !== "replied" && selectedMessageData.status !== "archived" && (
                  <div className="border-t border-gray-200 p-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Votre réponse..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    />
                    <button
                      onClick={() => { void handleReply(); }}
                      disabled={isReplying || !replyText.trim()}
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaReply /> {isReplying ? "Envoi..." : "Répondre"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 p-8">
                <div className="text-center">
                  <FaEnvelope className="text-4xl mx-auto mb-3" />
                  <p>Sélectionnez un message pour le lire</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
