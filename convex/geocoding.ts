import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

/**
 * Action: Geocode an address using Nominatim (OpenStreetMap)
 * This is free and doesn't require an API key for reasonable usage
 */
export const geocodeAddress = action({
  args: {
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
  },
  handler: async (ctx, { addressLine1, addressLine2, city, country, postalCode }) => {
    // Build full address string
    const parts = [
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country || "Sénégal",
    ].filter(Boolean);

    if (parts.length === 1 && !addressLine1) {
      throw new Error("Adresse insuffisante pour le géocodage");
    }

    const fullAddress = parts.join(", ");

    try {
      // Use Nominatim OpenStreetMap API (free, no key required for low volume)
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "LesHirondelles/1.0 (contact@leshirondelles.sn)",
          "Accept-Language": "fr",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur de géocodage: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return {
          success: false,
          message: "Adresse non trouvée",
          coordinates: null,
          displayName: null,
        };
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);

      return {
        success: true,
        message: "Coordonnées trouvées",
        coordinates: `${lat},${lon}`,
        displayName: result.display_name,
        lat,
        lon,
        // Generate Google Maps URL (for linking, not embedding - embedding requires API key)
        mapEmbedUrl: `https://www.google.com/maps?q=${lat},${lon}`,
        // Generate OpenStreetMap URL as fallback
        osmUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error(`Erreur lors du géocodage: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    }
  },
});

/**
 * Admin: Update map coordinates directly
 */
export const updateMapCoordinates = mutation({
  args: {
    mapCoordinates: v.string(),
    mapUrl: v.optional(v.string()),
  },
  handler: async (ctx, { mapCoordinates, mapUrl }) => {
    const settings = await ctx.db.query("site_settings").first();
    if (!settings) {
      throw new Error("Paramètres non initialisés");
    }

    await ctx.db.patch(settings._id, {
      mapCoordinates,
      ...(mapUrl && { mapUrl }),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Helper: Parse coordinates string "lat,lng" to object
 */
export function parseCoordinates(coordinates: string): { lat: number; lng: number } | null {
  const parts = coordinates.split(",").map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return null;
  }
  return { lat: parts[0], lng: parts[1] };
}

/**
 * Helper: Generate Google Maps directions URL
 */
export function getDirectionsUrl(coordinates: string): string | null {
  const parsed = parseCoordinates(coordinates);
  if (!parsed) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${parsed.lat},${parsed.lng}`;
}

/**
 * Helper: Generate static map image URL (using OpenStreetMap static tiles)
 * Note: For production, consider using Mapbox or Google Maps Static API
 */
export function getStaticMapUrl(coordinates: string, zoom: number = 15): string | null {
  const parsed = parseCoordinates(coordinates);
  if (!parsed) return null;
  // Using staticmap.openstreetmap.de (free service)
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${parsed.lat},${parsed.lng}&zoom=${zoom}&size=600x400&markers=${parsed.lat},${parsed.lng},red-pushpin`;
}
