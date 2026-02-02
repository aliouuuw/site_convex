import { useMemo } from "react";
import { FaMapMarkerAlt, FaDirections, FaExternalLinkAlt } from "react-icons/fa";

interface LocationMapProps {
  coordinates?: string; // "lat,lng" format
  address?: string;
  addressDetails?: string;
  mapUrl?: string;
  className?: string;
  height?: string;
}

/**
 * Parse coordinates string to lat/lng object
 */
function parseCoordinates(coordinates: string): { lat: number; lng: number } | null {
  const parts = coordinates.split(",").map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return null;
  }
  return { lat: parts[0], lng: parts[1] };
}

/**
 * Generate OpenStreetMap embed URL
 */
function getOSMEmbedUrl(lat: number, lng: number): string {
  // OpenStreetMap embed iframe URL
  const bbox = 0.01; // bounding box size
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - bbox}%2C${lat - bbox}%2C${lng + bbox}%2C${lat + bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

/**
 * Generate Google Maps directions URL
 */
function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Generate Google Maps view URL
 */
function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function LocationMap({
  coordinates,
  address,
  addressDetails,
  mapUrl,
  className = "",
  height = "h-64",
}: LocationMapProps) {
  const parsed = useMemo(() => {
    if (!coordinates) return null;
    return parseCoordinates(coordinates);
  }, [coordinates]);

  // If no coordinates, show a placeholder with address
  if (!parsed) {
    return (
      <div className={`bg-gray-200 ${height} flex items-center justify-center text-gray-600 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <FaMapMarkerAlt className="text-4xl mb-3 mx-auto text-gray-400" />
          <p className="font-medium">{address || "Adresse non configurée"}</p>
          {addressDetails && <p className="text-sm mt-1">{addressDetails}</p>}
          <p className="text-xs mt-3 text-gray-500">
            Configurez les coordonnées GPS dans les paramètres du site
          </p>
        </div>
      </div>
    );
  }

  const embedUrl = getOSMEmbedUrl(parsed.lat, parsed.lng);
  const directionsUrl = getDirectionsUrl(parsed.lat, parsed.lng);
  const googleMapsUrl = mapUrl || getGoogleMapsUrl(parsed.lat, parsed.lng);

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      {/* Map iframe */}
      <div className={`relative ${height}`}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Localisation"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Address and actions bar */}
      <div className="bg-white border border-t-0 border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-gray-700">
          <p className="font-medium">{address}</p>
          {addressDetails && <p className="text-gray-500 text-xs">{addressDetails}</p>}
        </div>
        <div className="flex gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            <FaDirections /> Itinéraire
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <FaExternalLinkAlt /> Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
