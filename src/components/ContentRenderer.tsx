import React from "react";
import { looksLikeHtml } from "../../shared/contentSanitizer";

interface ContentRendererProps {
  content?: string | null;
  type?: "text" | "richText" | string;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  type,
  fallback = null,
  className = "",
  style,
  as: Component = "span",
}) => {
  const shouldRenderHtml = type === "richText" || looksLikeHtml(content);

  if (shouldRenderHtml) {
    return (
      <Component
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    );
  }

  if (content) {
    return (
      <Component className={className} style={style}>
        {content}
      </Component>
    );
  }

  return (
    <Component className={className} style={style}>
      {fallback}
    </Component>
  );
};

export default ContentRenderer;
