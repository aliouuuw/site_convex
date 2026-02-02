import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AdminLayout from "./AdminLayout";
import toast from "react-hot-toast";
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShareAlt, FaClock, FaUsers, FaSave } from "react-icons/fa";

type TabId = "org" | "address" | "phones" | "emails" | "social" | "hours" | "departments";

interface Department {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  order?: number;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "org", label: "Organisation", icon: <FaBuilding /> },
  { id: "address", label: "Adresse", icon: <FaMapMarkerAlt /> },
  { id: "phones", label: "Téléphones", icon: <FaPhone /> },
  { id: "emails", label: "Emails", icon: <FaEnvelope /> },
  { id: "social", label: "Réseaux sociaux", icon: <FaShareAlt /> },
  { id: "hours", label: "Horaires", icon: <FaClock /> },
  { id: "departments", label: "Services", icon: <FaUsers /> },
];

export default function SiteSettingsAdminPage() {
  const settings = useQuery(api.siteSettings.getSiteSettings);
  const hasSettings = useQuery(api.siteSettings.hasSettings);
  const initializeSettings = useMutation(api.siteSettings.initializeSettings);
  const updateAllSettings = useMutation(api.siteSettings.updateAllSettings);

  const [activeTab, setActiveTab] = useState<TabId>("org");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [departments, setDepartments] = useState<Department[]>([]);

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      // Use type assertion to access all properties safely
      const s = settings as Record<string, any>;
      setFormData({
        orgName: s.orgName || "",
        orgTagline: s.orgTagline || "",
        orgDescription: s.orgDescription || "",
        addressLine1: s.addressLine1 || "",
        addressLine2: s.addressLine2 || "",
        city: s.city || "",
        country: s.country || "",
        postalCode: s.postalCode || "",
        mapUrl: s.mapUrl || "",
        mapCoordinates: s.mapCoordinates || "",
        phoneMain: s.phoneMain || "",
        phoneMobile: s.phoneMobile || "",
        phoneWhatsApp: s.phoneWhatsApp || "",
        whatsAppUrl: s.whatsAppUrl || "",
        emailGeneral: s.emailGeneral || "",
        emailDirection: s.emailDirection || "",
        emailInscription: s.emailInscription || "",
        emailVieScolaire: s.emailVieScolaire || "",
        socialFacebook: s.socialFacebook || "",
        socialInstagram: s.socialInstagram || "",
        socialLinkedIn: s.socialLinkedIn || "",
        socialTwitter: s.socialTwitter || "",
        socialYouTube: s.socialYouTube || "",
        socialTikTok: s.socialTikTok || "",
        hoursWeekdays: s.hoursWeekdays || "",
        hoursSaturday: s.hoursSaturday || "",
        hoursSunday: s.hoursSunday || "",
        hoursNote: s.hoursNote || "",
      });
      setDepartments(s.departments || []);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInitialize = async () => {
    try {
      await initializeSettings();
      toast.success("Paramètres initialisés avec succès !");
    } catch (error: any) {
      toast.error("Erreur lors de l'initialisation");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAllSettings({
        ...formData,
        departments,
      });
      toast.success("Paramètres enregistrés !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const addDepartment = () => {
    setDepartments([
      ...departments,
      { name: "", contactPerson: "", email: "", phone: "", order: departments.length + 1 },
    ]);
  };

  const updateDepartment = (index: number, field: keyof Department, value: string | number) => {
    const updated = [...departments];
    updated[index] = { ...updated[index], [field]: value };
    setDepartments(updated);
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  if (settings === undefined) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (hasSettings === false) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-white rounded-lg shadow p-8 text-center max-w-md mx-auto">
            <FaBuilding className="text-5xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Paramètres du site</h2>
            <p className="text-gray-600 mb-6">
              Les paramètres n'ont pas encore été initialisés. Cliquez sur le bouton ci-dessous pour créer les paramètres par défaut.
            </p>
            <button
              onClick={() => { void handleInitialize(); }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Initialiser les paramètres
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "org":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaBuilding className="text-primary" /> Informations de l'organisation
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'organisation *</label>
                <input
                  type="text"
                  value={formData.orgName || ""}
                  onChange={(e) => handleInputChange("orgName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                <input
                  type="text"
                  value={formData.orgTagline || ""}
                  onChange={(e) => handleInputChange("orgTagline", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.orgDescription || ""}
                  onChange={(e) => handleInputChange("orgDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case "address":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Adresse
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse ligne 1</label>
                <input
                  type="text"
                  value={formData.addressLine1 || ""}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Rue, numéro..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse ligne 2</label>
                <input
                  type="text"
                  value={formData.addressLine2 || ""}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Complément d'adresse, repères..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input
                    type="text"
                    value={formData.country || ""}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien Google Maps</label>
                <input
                  type="url"
                  value={formData.mapUrl || ""}
                  onChange={(e) => handleInputChange("mapUrl", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>
        );

      case "phones":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaPhone className="text-primary" /> Numéros de téléphone
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone principal</label>
                <input
                  type="tel"
                  value={formData.phoneMain || ""}
                  onChange={(e) => handleInputChange("phoneMain", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+221 33 XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone mobile</label>
                <input
                  type="tel"
                  value={formData.phoneMobile || ""}
                  onChange={(e) => handleInputChange("phoneMobile", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+221 77 XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phoneWhatsApp || ""}
                  onChange={(e) => handleInputChange("phoneWhatsApp", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+221 77 XXX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien WhatsApp</label>
                <input
                  type="url"
                  value={formData.whatsAppUrl || ""}
                  onChange={(e) => handleInputChange("whatsAppUrl", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://wa.me/221XXXXXXXXX"
                />
              </div>
            </div>
          </div>
        );

      case "emails":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaEnvelope className="text-primary" /> Adresses email
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email général</label>
                <input
                  type="email"
                  value={formData.emailGeneral || ""}
                  onChange={(e) => handleInputChange("emailGeneral", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Direction</label>
                <input
                  type="email"
                  value={formData.emailDirection || ""}
                  onChange={(e) => handleInputChange("emailDirection", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="direction@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Inscriptions</label>
                <input
                  type="email"
                  value={formData.emailInscription || ""}
                  onChange={(e) => handleInputChange("emailInscription", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="inscription@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Vie Scolaire</label>
                <input
                  type="email"
                  value={formData.emailVieScolaire || ""}
                  onChange={(e) => handleInputChange("emailVieScolaire", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="viescolaire@example.com"
                />
              </div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaShareAlt className="text-primary" /> Réseaux sociaux
            </h3>
            <p className="text-sm text-gray-500">Entrez les URLs complètes de vos profils</p>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📘 Facebook</label>
                <input
                  type="url"
                  value={formData.socialFacebook || ""}
                  onChange={(e) => handleInputChange("socialFacebook", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📷 Instagram</label>
                <input
                  type="url"
                  value={formData.socialInstagram || ""}
                  onChange={(e) => handleInputChange("socialInstagram", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">💼 LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinkedIn || ""}
                  onChange={(e) => handleInputChange("socialLinkedIn", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🐦 Twitter / X</label>
                <input
                  type="url"
                  value={formData.socialTwitter || ""}
                  onChange={(e) => handleInputChange("socialTwitter", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">▶️ YouTube</label>
                <input
                  type="url"
                  value={formData.socialYouTube || ""}
                  onChange={(e) => handleInputChange("socialYouTube", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://youtube.com/@..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🎵 TikTok</label>
                <input
                  type="url"
                  value={formData.socialTikTok || ""}
                  onChange={(e) => handleInputChange("socialTikTok", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>
          </div>
        );

      case "hours":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaClock className="text-primary" /> Horaires d'ouverture
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lundi - Vendredi</label>
                <input
                  type="text"
                  value={formData.hoursWeekdays || ""}
                  onChange={(e) => handleInputChange("hoursWeekdays", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="8h00 - 17h00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Samedi</label>
                <input
                  type="text"
                  value={formData.hoursSaturday || ""}
                  onChange={(e) => handleInputChange("hoursSaturday", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="8h00 - 12h00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimanche</label>
                <input
                  type="text"
                  value={formData.hoursSunday || ""}
                  onChange={(e) => handleInputChange("hoursSunday", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Fermé"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note spéciale</label>
                <textarea
                  value={formData.hoursNote || ""}
                  onChange={(e) => handleInputChange("hoursNote", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Horaires spéciaux pendant les vacances..."
                />
              </div>
            </div>
          </div>
        );

      case "departments":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaUsers className="text-primary" /> Services / Départements
              </h3>
              <button
                type="button"
                onClick={addDepartment}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-500">Service #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeDepartment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => updateDepartment(index, "name", e.target.value)}
                      placeholder="Nom du service"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={dept.contactPerson || ""}
                        onChange={(e) => updateDepartment(index, "contactPerson", e.target.value)}
                        placeholder="Personne de contact"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        value={dept.order || index + 1}
                        onChange={(e) => updateDepartment(index, "order", parseInt(e.target.value) || 0)}
                        placeholder="Ordre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="email"
                        value={dept.email || ""}
                        onChange={(e) => updateDepartment(index, "email", e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="tel"
                        value={dept.phone || ""}
                        onChange={(e) => updateDepartment(index, "phone", e.target.value)}
                        placeholder="Téléphone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucun service configuré. Cliquez sur "Ajouter" pour créer un service.
                </p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres du site</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez les informations de contact et paramètres globaux
            </p>
          </div>
          <button
            onClick={() => { void handleSave(); }}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
          >
            <FaSave /> {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>

        {/* Last Updated */}
        {settings?.updatedAt && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Dernière mise à jour:{" "}
            {new Date(settings.updatedAt).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
