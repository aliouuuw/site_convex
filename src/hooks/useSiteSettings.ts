import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface Department {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  order?: number;
}

export interface SiteSettings {
  _id: string | null;
  // Organization
  orgName: string;
  orgTagline?: string;
  orgDescription?: string;
  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  mapUrl?: string;
  mapCoordinates?: string;
  // Phones
  phoneMain?: string;
  phoneMobile?: string;
  phoneWhatsApp?: string;
  whatsAppUrl?: string;
  // Emails
  emailGeneral?: string;
  emailDirection?: string;
  emailInscription?: string;
  emailVieScolaire?: string;
  // Social
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedIn?: string;
  socialTwitter?: string;
  socialYouTube?: string;
  socialTikTok?: string;
  // Hours
  hoursWeekdays?: string;
  hoursSaturday?: string;
  hoursSunday?: string;
  hoursNote?: string;
  // Departments
  departments?: Department[];
  // Meta
  updatedAt: number;
}

/**
 * Hook to get site settings (single query for all settings)
 * This is more efficient than the key-value contact_info approach
 */
export function useSiteSettings() {
  const settings = useQuery(api.siteSettings.getSiteSettings);
  
  return {
    settings: settings as SiteSettings | undefined,
    isLoading: settings === undefined,
  };
}

/**
 * Helper: Get full address as a single string
 */
export function getFullAddress(settings: SiteSettings): string {
  const parts = [
    settings.addressLine1,
    settings.addressLine2,
    settings.city,
    settings.country,
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * Helper: Get formatted phone link
 */
export function getPhoneLink(phone: string | undefined): string {
  if (!phone) return "";
  return `tel:${phone.replace(/\s/g, "")}`;
}

/**
 * Helper: Get formatted email link
 */
export function getEmailLink(email: string | undefined): string {
  if (!email) return "";
  return `mailto:${email}`;
}

/**
 * Helper: Get social media links as array for iteration
 */
export function getSocialLinks(settings: SiteSettings) {
  const links = [];
  
  if (settings.socialFacebook) {
    links.push({ name: "Facebook", url: settings.socialFacebook, icon: "📘" });
  }
  if (settings.socialInstagram) {
    links.push({ name: "Instagram", url: settings.socialInstagram, icon: "📷" });
  }
  if (settings.socialLinkedIn) {
    links.push({ name: "LinkedIn", url: settings.socialLinkedIn, icon: "💼" });
  }
  if (settings.socialTwitter) {
    links.push({ name: "Twitter/X", url: settings.socialTwitter, icon: "🐦" });
  }
  if (settings.socialYouTube) {
    links.push({ name: "YouTube", url: settings.socialYouTube, icon: "▶️" });
  }
  if (settings.socialTikTok) {
    links.push({ name: "TikTok", url: settings.socialTikTok, icon: "🎵" });
  }
  
  return links;
}

/**
 * Helper: Get business hours as array
 */
export function getBusinessHours(settings: SiteSettings) {
  const hours = [];
  
  if (settings.hoursWeekdays) {
    hours.push({ label: "Lundi - Vendredi", value: settings.hoursWeekdays });
  }
  if (settings.hoursSaturday) {
    hours.push({ label: "Samedi", value: settings.hoursSaturday });
  }
  if (settings.hoursSunday) {
    hours.push({ label: "Dimanche", value: settings.hoursSunday });
  }
  
  return hours;
}

/**
 * Helper: Get sorted departments
 */
export function getSortedDepartments(settings: SiteSettings): Department[] {
  if (!settings.departments) return [];
  return [...settings.departments].sort((a, b) => (a.order || 0) - (b.order || 0));
}
