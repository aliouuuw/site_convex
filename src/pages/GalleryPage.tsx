import React, { useState } from "react";
import { FaImages, FaVideo, FaPlay, FaSearch, FaTimes, FaExpand } from "react-icons/fa";
import { ImageSlider } from "../components/ImageSlider";

const galleryItems = [
  {
    type: "image",
    src: "/images/about/school-heritage.jpg",
    title: "Patrimoine de l'école",
    description: "Une vue de notre bâtiment historique.",
    category: "Architecture",
    date: "2024-01-15"
  },
  {
    type: "video",
    src: "/videos/promo.mp4",
    title: "Vidéo Promotionnelle",
    description: "Découvrez notre école en action.",
    category: "Présentation",
    date: "2024-02-20"
  },
  {
    type: "image",
    src: "/images/about/history-1.jpg",
    title: "Cours de sciences",
    description: "Élèves en plein apprentissage des sciences naturelles.",
    category: "Éducation",
    date: "2024-03-10"
  },
  {
    type: "image",
    src: "/images/about/history-2.jpg",
    title: "Événement sportif",
    description: "Journée sportive annuelle avec tous les élèves.",
    category: "Sport",
    date: "2024-03-25"
  },
  {
    type: "video",
    src: "/videos/ceremony.mp4",
    title: "Cérémonie de remise des diplômes",
    description: "Moments émouvants de la remise des diplômes 2024.",
    category: "Cérémonie",
    date: "2024-06-15"
  },
  {
    type: "image",
    src: "/images/about/history-3.jpg",
    title: "Atelier d'art",
    description: "Créativité et expression artistique des élèves.",
    category: "Art",
    date: "2024-04-05"
  },
  {
    type: "image",
    src: "/images/about/history-4.jpg",
    title: "Bibliothèque",
    description: "Espace de lecture et de recherche pour tous.",
    category: "Infrastructure",
    date: "2024-01-30"
  },
  {
    type: "video",
    src: "/videos/activities.mp4",
    title: "Activités extrascolaires",
    description: "Découvrez nos nombreuses activités après les cours.",
    category: "Activités",
    date: "2024-05-12"
  },
  {
    type: "image",
    src: "/images/about/history-5.jpg",
    title: "Laboratoire informatique",
    description: "Apprentissage des nouvelles technologies.",
    category: "Technologie",
    date: "2024-02-28"
  }
];

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="gallery-card-container bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative h-64">
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      poster="/images/about/school-heritage.jpg" // Add a poster image for videos
                    />
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <FaVideo className="text-white text-5xl" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default GalleryPage;
