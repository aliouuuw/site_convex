import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import OptimizedImage from './OptimizedImage';

interface DisplayImageSliderProps {
  id: string;
  defaultImages?: string[];
  className?: string;
}

export const DisplayImageSlider: React.FC<DisplayImageSliderProps> = ({
  id,
  defaultImages,
  className = '',
}) => {
  // Get content from Convex
  const content = useQuery(api.content.getContent, { id });
  const isLoading = content === undefined;
  
  // Use content from database if available, otherwise fallback to default images
  const currentImages = (() => {
    if (content?.content) {
      try {
        const parsed = JSON.parse(content.content);
        return Array.isArray(parsed) 
          ? parsed.filter((img: any): img is string => img && typeof img === 'string')
          : [];
      } catch (error) {
        console.warn('Failed to parse slider images from Convex:', error);
        return defaultImages || [];
      }
    }
    return defaultImages || [];
  })();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  // Preload first image for faster LCP
  useEffect(() => {
    if (currentImages.length > 0) {
      const firstImage = currentImages[0];
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = firstImage;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [currentImages]);

  useEffect(() => {
    if (currentImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImages.length]);

  // Loading skeleton while fetching content
  if (isLoading) {
    return (
      <div className={`w-full h-full relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Empty state - elegant branded background (no emoji)
  if (currentImages.length === 0) {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark,#003d6b)] to-[var(--accent)] ${className}`}>
        <div className="absolute inset-0 bg-[url('/images/logo.svg')] bg-center bg-no-repeat bg-[length:120px] opacity-10" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder while first image loads */}
      {!firstImageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] z-[1]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      )}
      
      {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((image: string, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <OptimizedImage
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
            style={{ filter: 'brightness(0.7)' }}
            loading={index === 0 ? 'eager' : 'lazy'}
            priority={index === 0}
            onLoad={index === 0 ? () => setFirstImageLoaded(true) : undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((_: string, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayImageSlider;
