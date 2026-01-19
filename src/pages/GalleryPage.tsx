import React, { useState, useCallback } from "react";
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SEO from "../components/SEO";
import OptimizedImage from "../components/OptimizedImage";

interface GalleryItem {
  type: string;
  src: string;
  thumbnail: string;
  title: string;
}

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const galleryMedia = useQuery(api.media.searchMedia, { tag: "gallery", limit: 50 });

  const galleryItems: GalleryItem[] = galleryMedia?.map((item) => ({
    type: item.type,
    src: item.url,
    thumbnail: item.thumbnailUrl || item.url,
    title: item.title || item.name,
  })) || [];

  const filteredItems = galleryItems.filter((item) =>
    filter === "all" || item.type === filter
  );

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const openModal = useCallback((index: number) => {
    setVideoError(false);
    setVideoLoading(filteredItems[index]?.type === "video");
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  }, [filteredItems]);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = "unset";
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setVideoError(false);
      setVideoLoading(filteredItems[selectedIndex + 1]?.type === "video");
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, filteredItems]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setVideoError(false);
      setVideoLoading(filteredItems[selectedIndex - 1]?.type === "video");
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex, filteredItems]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closeModal, goNext, goPrev]);

  const imageCount = galleryItems.filter((i) => i.type === "image").length;
  const videoCount = galleryItems.filter((i) => i.type === "video").length;

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO
        title="Galerie - Les Hirondelles"
        description="Découvrez les moments forts de notre école Les Hirondelles en images et vidéos."
        keywords="galerie, photos, vidéos, Les Hirondelles, Dakar"
        url="/gallery"
      />

      {/* Minimal Header */}
      <header className="py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">Galerie</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Les moments forts de notre école
        </p>
      </header>

      {/* Filter Tabs */}
      <nav className="flex justify-center gap-1 mb-12 px-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            filter === "all"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Tout
        </button>
        <button
          onClick={() => setFilter("image")}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            filter === "image"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Photos ({imageCount})
        </button>
        <button
          onClick={() => setFilter("video")}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            filter === "video"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Vidéos ({videoCount})
        </button>
      </nav>

      {/* Loading */}
      {galleryMedia === undefined && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {galleryMedia !== undefined && galleryItems.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p>Aucun média disponible</p>
        </div>
      )}

      {/* Masonry-style Grid */}
      {filteredItems.length > 0 && (
        <section className="px-4 pb-24 max-w-7xl mx-auto">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
                style={{ contentVisibility: "auto", containIntrinsicSize: "320px" }}
                onClick={() => openModal(index)}
              >
                {item.type === "image" ? (
                  <OptimizedImage
                    src={item.src}
                    alt={item.title}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    wrapperClassName="w-full"
                  />
                ) : (
                  <div className="relative aspect-video bg-gray-100">
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      poster={item.thumbnail && item.thumbnail !== item.src ? item.thumbnail : undefined}
                      muted
                      playsInline
                      onLoadedMetadata={(event) => {
                        if (!item.thumbnail || item.thumbnail === item.src) {
                          event.currentTarget.currentTime = 0.1;
                        }
                      }}
                      onSeeked={(event) => {
                        event.currentTarget.pause();
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <FaPlay className="text-gray-900 text-lg ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Hover overlay for images */}
                {item.type === "image" && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8"
          onClick={closeModal}
        >
          {/* Close button - outside card */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 bg-white/90 text-gray-800 hover:bg-white transition-colors rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10"
            aria-label="Fermer"
          >
            <FaTimes className="text-base" />
          </button>

          {/* Counter - outside card */}
          <div className="absolute top-7 left-6 text-white/70 text-xs tracking-wider uppercase z-10">
            {selectedIndex + 1} / {filteredItems.length}
          </div>

          {/* Navigation arrows - outside card */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 hover:bg-white transition-colors rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
              aria-label="Précédent"
            >
              <FaChevronLeft className="text-lg" />
            </button>
          )}
          {selectedIndex < filteredItems.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 hover:bg-white transition-colors rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10"
              aria-label="Suivant"
            >
              <FaChevronRight className="text-lg" />
            </button>
          )}

          {/* Card container */}
          <div
            className="relative w-full max-w-5xl bg-white/10 border border-white/15 rounded-3xl p-4 md:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-t-3xl" />

            {/* Media content */}
            <div className="relative w-full flex items-center justify-center pt-2">
              {selectedItem.type === "image" ? (
                <OptimizedImage
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                  wrapperClassName="max-w-full max-h-[70vh]"
                  loading="eager"
                  priority
                />
              ) : (
                <div className="relative w-full flex items-center justify-center">
                  {videoLoading && !videoError && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  {!videoError ? (
                    <video
                      src={selectedItem.src}
                      poster={selectedItem.thumbnail}
                      controls
                      playsInline
                      autoPlay
                      preload="metadata"
                      className="max-w-full max-h-[70vh] object-contain rounded-2xl"
                      onLoadedData={() => { setVideoError(false); setVideoLoading(false); }}
                      onCanPlay={() => { setVideoError(false); setVideoLoading(false); }}
                      onWaiting={() => setVideoLoading(true)}
                      onPlaying={() => setVideoLoading(false)}
                      onError={() => { setVideoLoading(false); setVideoError(true); }}
                    />
                  ) : (
                    <div className="text-center text-white/70 py-20">
                      <p>Impossible de charger la vidéo</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 bg-white/95 text-gray-900 rounded-2xl px-6 py-4 shadow-lg text-center">
              <h3 className="text-lg md:text-xl font-semibold">{selectedItem.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
