import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import OptimizedImage from './OptimizedImage';

interface DisplayImageProps {
  id: string;
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  wrapperClassName?: string;
}

export const DisplayImage: React.FC<DisplayImageProps> = ({
  id,
  src,
  alt = '',
  className = '',
  width,
  height,
  fallbackSrc,
  loading = 'lazy',
  priority = false,
  wrapperClassName,
}) => {
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  
  // Use content from database if available, otherwise fallback to props
  const currentSrc = content?.content || src;
  const currentAlt = content?.alt || alt;

  return (
    <OptimizedImage
      src={currentSrc || fallbackSrc || ''}
      alt={currentAlt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      priority={priority}
      wrapperClassName={wrapperClassName}
      fallbackSrc={fallbackSrc}
    />
  );
};

export default DisplayImage;
