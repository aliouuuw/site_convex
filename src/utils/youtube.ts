/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports: standard watch URLs, short URLs, embed URLs, youtu.be
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    // Short URL: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embed URL: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Shorts URL: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generates a YouTube embed URL from a video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Generates a YouTube thumbnail URL from a video ID
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: "default" | "hq" | "mq" | "sd" | "maxres" = "hq"): string {
  const qualityMap: Record<string, string> = {
    default: "default",
    hq: "hqdefault",
    mq: "mqdefault",
    sd: "sddefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Checks if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Parses a YouTube URL and returns all relevant information
 */
export function parseYouTubeUrl(url: string): {
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  isValid: boolean;
} {
  const videoId = extractYouTubeId(url);
  
  if (!videoId) {
    return {
      videoId: null,
      embedUrl: null,
      thumbnailUrl: null,
      isValid: false,
    };
  }

  return {
    videoId,
    embedUrl: getYouTubeEmbedUrl(videoId),
    thumbnailUrl: getYouTubeThumbnailUrl(videoId),
    isValid: true,
  };
}
