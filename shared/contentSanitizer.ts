export const RICH_TEXT_MEDIA_REGEX = /<(img|video|iframe|svg|figure|picture)\b/i;
const HTML_TAG_REGEX = /<[^>]+>/;
const HTML_STRIP_REGEX = /<[^>]*>/g;

export const looksLikeHtml = (value?: string | null): boolean =>
  Boolean(value && HTML_TAG_REGEX.test(value));

export const stripHtml = (html: string): string =>
  html.replace(HTML_STRIP_REGEX, "").replace(/&nbsp;/g, " ").trim();

export const sanitizeRichText = (html: string, plainText?: string): string => {
  if (!html) return "";
  const hasMedia = RICH_TEXT_MEDIA_REGEX.test(html);
  const normalizedText = (plainText ?? stripHtml(html)).trim();
  return !normalizedText && !hasMedia ? "" : html;
};

export const isEmptyRichText = (html: string): boolean =>
  sanitizeRichText(html) === "";
