import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

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

  useEffect(() => {
    if (currentImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImages.length]);

  // Don't render anything if no images
  if (currentImages.length === 0) {
    return (
      <div className={`w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🏫</div>
          <h2 className="text-2xl font-bold mb-2">Les Hirondelles</h2>
          <p className="text-lg opacity-90">Excellence en éducation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {currentImages.filter((image: any): image is string => image && typeof image === 'string').map((image: string, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
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
