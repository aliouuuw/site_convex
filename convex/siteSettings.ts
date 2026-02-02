import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Department object validator
const departmentValidator = v.object({
  name: v.string(),
  contactPerson: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  order: v.optional(v.number()),
});

// Default settings for initialization
const DEFAULT_SETTINGS = {
  orgName: "Institution Les Hirondelles",
  orgTagline: "Excellence éducative depuis plus de 20 ans",
  orgDescription: "École privée d'excellence à Dakar, Sénégal",
  
  addressLine1: "Avenue Cheikh Anta Diop",
  addressLine2: "Face à l'Université Cheikh Anta Diop, près de la station Total",
  city: "Dakar",
  country: "Sénégal",
  postalCode: "",
  mapUrl: "",
  mapCoordinates: "",
  
  phoneMain: "+221 33 XXX XX XX",
  phoneMobile: "+221 77 XXX XX XX",
  phoneWhatsApp: "+221 77 XXX XX XX",
  whatsAppUrl: "https://wa.me/22177XXXXXX",
  
  emailGeneral: "contact@leshirondelles.sn",
  emailDirection: "direction@leshirondelles.sn",
  emailInscription: "inscription@leshirondelles.sn",
  emailVieScolaire: "viescolaire@leshirondelles.sn",
  
  socialFacebook: "https://facebook.com/LesHirondellesSN",
  socialInstagram: "https://instagram.com/leshirondelles_sn",
  socialLinkedIn: "https://linkedin.com/company/les-hirondelles",
  socialTwitter: "",
  socialYouTube: "",
  socialTikTok: "",
  
  hoursWeekdays: "8h00 - 17h00",
  hoursSaturday: "8h00 - 12h00",
  hoursSunday: "Fermé",
  hoursNote: "",
  
  departments: [
    { name: "Direction Générale", contactPerson: "Mme. Aïssatou Diop", email: "direction@leshirondelles.sn", phone: "+221 33 XXX XX XX", order: 1 },
    { name: "Admission / Inscriptions", email: "inscription@leshirondelles.sn", phone: "+221 77 XXX XX XX", order: 2 },
    { name: "Vie Scolaire", contactPerson: "Mme. Fatoumata Sarr", email: "viescolaire@leshirondelles.sn", phone: "+221 77 XXX XX XX", order: 3 },
  ],
};

// ============== PUBLIC QUERIES ==============

/**
 * Get site settings (public) - Single query for all settings
 * This is the main query used by public pages
 */
export const getSiteSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("site_settings").first();
    
    // Return defaults if no settings exist yet
    if (!settings) {
      return {
        ...DEFAULT_SETTINGS,
        updatedAt: Date.now(),
        _id: null,
      };
    }
    
    return settings;
  },
});

// ============== ADMIN QUERIES ==============

/**
 * Admin: Check if settings exist
 */
export const hasSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("site_settings").first();
    return settings !== null;
  },
});

// ============== ADMIN MUTATIONS ==============

/**
 * Admin: Initialize settings with defaults (run once)
 */
export const initializeSettings = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already exists
    const existing = await ctx.db.query("site_settings").first();
    if (existing) {
      return { success: false, message: "Settings already exist", id: existing._id };
    }
    
    const id = await ctx.db.insert("site_settings", {
      ...DEFAULT_SETTINGS,
      updatedAt: Date.now(),
    });
    
    return { success: true, message: "Settings initialized", id };
  },
});

/**
 * Admin: Update organization info
 */
export const updateOrgInfo = mutation({
  args: {
    orgName: v.optional(v.string()),
    orgTagline: v.optional(v.string()),
    orgDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized. Please initialize first.");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update address info
 */
export const updateAddressInfo = mutation({
  args: {
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
    mapCoordinates: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update phone numbers
 */
export const updatePhoneInfo = mutation({
  args: {
    phoneMain: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    phoneWhatsApp: v.optional(v.string()),
    whatsAppUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update email addresses
 */
export const updateEmailInfo = mutation({
  args: {
    emailGeneral: v.optional(v.string()),
    emailDirection: v.optional(v.string()),
    emailInscription: v.optional(v.string()),
    emailVieScolaire: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update social media links
 */
export const updateSocialMedia = mutation({
  args: {
    socialFacebook: v.optional(v.string()),
    socialInstagram: v.optional(v.string()),
    socialLinkedIn: v.optional(v.string()),
    socialTwitter: v.optional(v.string()),
    socialYouTube: v.optional(v.string()),
    socialTikTok: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update business hours
 */
export const updateBusinessHours = mutation({
  args: {
    hoursWeekdays: v.optional(v.string()),
    hoursSaturday: v.optional(v.string()),
    hoursSunday: v.optional(v.string()),
    hoursNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Update departments
 */
export const updateDepartments = mutation({
  args: {
    departments: v.array(departmentValidator),
  },
  handler: async (ctx, { departments }) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Settings not initialized");
    }
    
    // Sort by order
    const sorted = [...departments].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    await ctx.db.patch(settings._id, {
      departments: sorted,
      updatedAt: Date.now(),
    });
    
    return settings._id;
  },
});

/**
 * Admin: Bulk update all settings at once
 */
export const updateAllSettings = mutation({
  args: {
    orgName: v.optional(v.string()),
    orgTagline: v.optional(v.string()),
    orgDescription: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
    mapCoordinates: v.optional(v.string()),
    phoneMain: v.optional(v.string()),
    phoneMobile: v.optional(v.string()),
    phoneWhatsApp: v.optional(v.string()),
    whatsAppUrl: v.optional(v.string()),
    emailGeneral: v.optional(v.string()),
    emailDirection: v.optional(v.string()),
    emailInscription: v.optional(v.string()),
    emailVieScolaire: v.optional(v.string()),
    socialFacebook: v.optional(v.string()),
    socialInstagram: v.optional(v.string()),
    socialLinkedIn: v.optional(v.string()),
    socialTwitter: v.optional(v.string()),
    socialYouTube: v.optional(v.string()),
    socialTikTok: v.optional(v.string()),
    hoursWeekdays: v.optional(v.string()),
    hoursSaturday: v.optional(v.string()),
    hoursSunday: v.optional(v.string()),
    hoursNote: v.optional(v.string()),
    departments: v.optional(v.array(departmentValidator)),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("site_settings").first();
    
    // Filter out undefined values
    const updates: Record<string, any> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    
    if (!settings) {
      // Create with defaults + updates
      const id = await ctx.db.insert("site_settings", {
        ...DEFAULT_SETTINGS,
        updatedAt: Date.now(),
        ...updates,
      });
      return id;
    }
    
    await ctx.db.patch(settings._id, updates);
    return settings._id;
  },
});
