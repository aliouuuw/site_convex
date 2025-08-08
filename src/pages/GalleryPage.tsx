import React, { useState } from "react";
import { FaImages, FaVideo, FaPlay, FaSearch, FaTimes, FaExpand } from "react-icons/fa";
import { ImageSlider } from "../components/ImageSlider";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Remove static data - we'll fetch from Convex

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch media with "gallery" tag from Convex
  const galleryMedia = useQuery(api.media.searchMedia, { tag: "gallery", limit: 50 });

  // Transform Convex media data to match our component structure
  const galleryItems = galleryMedia?.map((item) => {
    console.log("Gallery item URL:", item.url); // Debug log
    return {
      type: item.type,
      src: item.url,
      title: item.name,
      description: item.alt || "Image de la galerie",
      category: item.tags?.find(tag => tag !== "gallery") || "Général",
      date: new Date(item.uploadedAt).toISOString().split('T')[0],
      width: item.width,
      height: item.height,
      size: item.size
    };
  }) || [];

  const filteredItems = galleryItems.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (newFilter: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setFilter(newFilter);
      setIsLoading(false);
    }, 300);
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard navigation for modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedItem) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      {/* Hero Section */}
      <section className="relative bg-white text-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-accent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  Galerie
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Galerie Multimédia
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Découvrez les moments forts et les instants capturés au sein
                    de notre école, en images et en vidéos.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Loading State */}
          {galleryMedia === undefined && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Chargement de la galerie...</span>
            </div>
          )}

          {/* Empty State */}
          {galleryMedia !== undefined && galleryItems.length === 0 && (
            <div className="text-center py-12">
              <FaImages className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun média dans la galerie</h3>
              <p className="text-gray-500">Les médias avec le tag "gallery" apparaîtront ici.</p>
            </div>
          )}

          {/* Gallery Content */}
          {galleryMedia !== undefined && galleryItems.length > 0 && (
            <>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la galerie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Enhanced Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                filter === "all"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg"
              }`}
            >
              Tout ({galleryItems.length})
            </button>
            <button
              onClick={() => handleFilterChange("image")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2 ${
                filter === "image"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg"
              }`}
            >
              <FaImages />
              <span>Images ({galleryItems.filter(item => item.type === "image").length})</span>
            </button>
            <button
              onClick={() => handleFilterChange("video")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2 ${
                filter === "video"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg"
              }`}
            >
              <FaVideo />
              <span>Vidéos ({galleryItems.filter(item => item.type === "video").length})</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''} trouvé{filteredItems.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* No Results State */}
          {galleryMedia !== undefined && galleryItems.length > 0 && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FaSearch className="mx-auto text-6xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-500 mb-4">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="btn btn-primary"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
          {/* Gallery Grid */}
          {filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.map((item, index) => (
              <div
                key={index}
                className="gallery-card-container bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div 
                  className="h-64 cursor-pointer group"
                  onClick={() => openModal(item)}
                >
                  {item.type === "image" ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          console.error("Failed to load image:", item.src);
                          console.error("Image error event:", e);
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          const fallback = parent?.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully:", item.src);
                          const parent = (event?.target as HTMLElement)?.parentElement;
                          const loading = parent?.querySelector('.image-loading') as HTMLElement;
                          if (loading) {
                            loading.style.display = 'none';
                          }
                        }}
                      />
                      {/* Loading state */}
                      <div className="image-loading absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      poster={item.src} // Use the video URL as poster for now
                    />
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "image" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.type === "image" ? "Image" : "Vidéo"}
                    </span>
                    <span className="text-xs text-gray-500">{item.category}</span>
                  </div>
                  
                  <h3 
                    className="text-lg font-bold text-gray-900 mb-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.title}
                  </h3>
                  
                  <p 
                    className="text-gray-600 text-sm leading-relaxed mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    {item.width && item.height && (
                      <span>{item.width} × {item.height}</span>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inspirez-vous et rejoignez-nous
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Contactez-nous pour en savoir plus sur nos programmes et nos
              événements à venir.
            </p>
            <a href="/contact" className="btn btn-accent">
              Nous Contacter
            </a>
          </div>
        </div>
      </section>

      {/* Modal for viewing media */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
            >
              <FaTimes />
            </button>
            
            {selectedItem.type === "image" ? (
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={selectedItem.src}
                controls
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
                autoPlay
              />
            )}
            
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-gray-300 mb-1">{selectedItem.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{selectedItem.category}</span>
                <span>•</span>
                <span>{new Date(selectedItem.date).toLocaleDateString('fr-FR')}</span>
                {selectedItem.width && selectedItem.height && (
                  <>
                    <span>•</span>
                    <span>{selectedItem.width} × {selectedItem.height}px</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
