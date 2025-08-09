// DEPRECATED: Use DisplayImage instead. This component is kept for backward compatibility.
// All editing should now happen through the centralized EditPanel.

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface EditableImageProps {
  id: string;
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  alt = '',
  className = '',
  width,
  height,
  fallbackSrc,
}) => {
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  
  // Use content from database if available, otherwise fallback to props
  const currentSrc = content?.content || src;
  const currentAlt = content?.alt || alt;

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={currentAlt}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default EditableImage;
