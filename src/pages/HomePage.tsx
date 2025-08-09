import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayImageSlider from '../components/DisplayImageSlider';
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import SEO from '../components/SEO';
import { FaCalendar, FaFileAlt, FaComments } from 'react-icons/fa';

const translate = (text: string) => {
  switch (text) {
    case "préscolaire":
      return "preschool";
    case "primaire":
      return "primary";
    case "collège":
      return "middleschool";
  }
};

const schoolLevels = [
  {
    title: "Préscolaire",
    description:
      "Un environnement bienveillant pour les premiers apprentissages",
    ageRange: "3-5 ans",
    highlights: ["Éveil artistique", "Développement moteur", "Socialisation"],
    image: "/images/programs/preschool.jpg",
  },
  {
    title: "Primaire",
    description: "Fondations solides pour l'apprentissage académique",
    ageRange: "6-10 ans",
    highlights: ["Français & Mathématiques", "Sciences", "Langues étrangères"],
    image: "/images/programs/primary.jpg",
  },
  {
    title: "Collège",
    description: "Préparation à l'excellence académique et personnelle",
    ageRange: "11-15 ans",
    highlights: ["Préparation BFEM", "Clubs & activités", "Orientation"],
    image: "/images/programs/middleschool.jpg",
  },
];



const HomePage: React.FC = () => {
  // Fetch published blog posts for the news section
  const blogPosts = useQuery(api.blog.listPublishedBlogPosts, { limit: 4 });
  // Fetch visible testimonials for the testimonials section
  const testimonials = useQuery(api.testimonials.listVisibleTestimonials, { limit: 6 });
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <div className="min-h-screen">
      <SEO 
        title="Les Hirondelles - École Privée d'Excellence à Dakar"
        description="École privée d'excellence à Dakar, Sénégal. Formation de qualité du préscolaire au collège avec des valeurs humaines et une excellence académique depuis plus de 20 ans."
        keywords="école privée, Dakar, Sénégal, préscolaire, primaire, collège, éducation, excellence académique, Les Hirondelles"
        url="/"
      />
      <main>
        {/* Hero Section - Condensed Content */}
        <section className="hero-background-optimized">
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-0">
            <DisplayImageSlider
              id="hero.background"
              defaultImages={[
                '/images/hero-school.jpg',
                '/images/mission-main.png',
                '/images/news-featured.jpg',
                '/images/programs/preschool.jpg',
                '/images/programs/primary.jpg',
                '/images/programs/middleschool.jpg'
              ]}
              page="home"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-[var(--primary)] to-[var(--accent)]/50 opacity-50" style={{ zIndex: 10 }}></div>
          
          <div className="container z-20">
            <div className="hero-content-background">
              <div className="hero-badge-elegant">
                <DisplayText id="hero.badge" page="home">
                  Excellence depuis 20+ ans
                </DisplayText>
              </div>
              <DisplayText 
                id="hero.title" 
                page="home" 
                as="h1" 
                className="hero-title-background"
              >
                Former les leaders de demain
              </DisplayText>
              <DisplayText 
                id="hero.description" 
                page="home" 
                as="p" 
                className="hero-description-background"
              >
                Excellence académique et valeurs humaines du préscolaire au
                collège.
              </DisplayText>
              <div className="hero-actions-background">
                <a href="#programs" className="btn btn-primary-hero">
                  Nos programmes
                </a>
                <a href="/contact" className="btn btn-secondary-hero">
                  Planifier une visite
                </a>
              </div>
              <div className="hero-stats-inline">
                <div className="hero-stat-inline">
                  <DisplayText id="hero.stats.students" page="home" className="stat-number-inline">
                    500+
                  </DisplayText>
                  <DisplayText id="hero.stats.students.label" page="home" className="stat-label-inline">
                    Élèves
                  </DisplayText>
                </div>
                <div className="hero-stat-inline">
                  <DisplayText id="hero.stats.success" page="home" className="stat-number-inline">
                    98%
                  </DisplayText>
                  <DisplayText id="hero.stats.success.label" page="home" className="stat-label-inline">
                    Réussite
                  </DisplayText>
                </div>
                <div className="hero-stat-inline">
                  <DisplayText id="hero.stats.years" page="home" className="stat-number-inline">
                    20+
                  </DisplayText>
                  <DisplayText id="hero.stats.years.label" page="home" className="stat-label-inline">
                    Années
                  </DisplayText>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Statistics - Horizontal Scroll */}
        <section className="stats-creative">
          <div className="stats-marquee">
            <div className="stats-track">
              <div className="stat-item-creative">
                <span className="stat-number">500+</span>
                <span className="stat-label">Élèves épanouis</span>
              </div>
              <div className="stat-item-creative">
                <span className="stat-number">20+</span>
                <span className="stat-label">Années d&apos;excellence</span>
              </div>
              <div className="stat-item-creative">
                <span className="stat-number">98%</span>
                <span className="stat-label">Taux de réussite</span>
              </div>
              <div className="stat-item-creative">
                <span className="stat-number">50+</span>
                <span className="stat-label">Enseignants dévoués</span>
              </div>
              <div className="stat-item-creative">
                <span className="stat-number">15</span>
                <span className="stat-label">Activités extra-scolaires</span>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="stat-item-creative">
                <span className="stat-number">500+</span>
                <span className="stat-label">Élèves épanouis</span>
              </div>
              <div className="stat-item-creative">
                <span className="stat-number">20+</span>
                <span className="stat-label">Années d&apos;excellence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Programs - Simplified Grid */}
        <section className="programs-simplified" id="programs" >
          <div className="container">
            <div className="section-header-creative">
              <div className="section-number">01</div>
              <div>
                <DisplayText 
                  id="programs.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Nos Programmes
                </DisplayText>
                <DisplayText 
                  id="programs.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Un parcours éducatif complet qui accompagne chaque élève vers
                  l&apos;excellence
                </DisplayText>
              </div>
            </div>

            <div className="programs-grid-simplified">
              {schoolLevels.map((level, index) => (
                <div key={index} className="program-card-simplified">
                  <div className="program-image-simplified">
                    <DisplayImage
                      id={`programs.${level.title.toLowerCase()}.image`}
                      src={level.image}
                      alt={level.title}
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
                      page="home"
                    />
                    <div className="program-age-badge">{level.ageRange}</div>
                  </div>
                  <div className="program-content-simplified">
                    <h3 className="program-title-simplified">{level.title}</h3>
                    <p className="program-description-simplified">
                      {level.description}
                    </p>
                    <ul className="program-highlights-simplified">
                      {level.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                    <a
                      href={`/programs/${translate(level.title.toLowerCase())}`}
                      className="program-link-simplified"
                    >
                      En savoir plus →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission - Simplified Two Column */}
        <section className="mission-simplified">
          <div className="container">
            <div className="section-header-creative">
              <div className="section-number">02</div>
              <div>
                <DisplayText 
                  id="mission.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Notre Mission
                </DisplayText>
                <DisplayText 
                  id="mission.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Former les citoyens de demain avec excellence et bienveillance
                </DisplayText>
              </div>
            </div>

            <div className="mission-grid">
              <div className="mission-content-simplified">
                <DisplayText 
                  id="mission.main" 
                  page="home" 
                  as="p" 
                  className="mission-text-large"
                >
                  Nous nous engageons à offrir une éducation de qualité qui
                  forme les citoyens de demain, cultivant l&apos;excellence
                  académique tout en développant les valeurs humaines
                  essentielles.
                </DisplayText>
                <DisplayText 
                  id="mission.secondary" 
                  page="home" 
                  as="p" 
                  className="mission-text-regular"
                >
                  Depuis notre création, nous accompagnons chaque élève dans son
                  épanouissement personnel et sa réussite scolaire, de la
                  maternelle au collège.
                </DisplayText>

                <div className="mission-values-simplified">
                  <div className="value-item-simplified">
                    <div className="value-icon">🎯</div>
                    <div>
                      <h4>Excellence académique</h4>
                      <p>Des programmes rigoureux et adaptés</p>
                    </div>
                  </div>
                  <div className="value-item-simplified">
                    <div className="value-icon">🤝</div>
                    <div>
                      <h4>Valeurs humaines</h4>
                      <p>Respect, intégrité et solidarité</p>
                    </div>
                  </div>
                  <div className="value-item-simplified">
                    <div className="value-icon">🌱</div>
                    <div>
                      <h4>Épanouissement personnel</h4>
                      <p>Développement de chaque potentiel</p>
                    </div>
                  </div>
                </div>

                <a href="/histoire" className="btn btn-primary">
                  Découvrir notre histoire
                </a>
              </div>

              <div className="mission-visual-simplified flex justify-center items-center">
                <div className="mission-image-wrapper h-[400px] w-[350px]">
                  <DisplayImage
                    id="mission.image"
                    src="/images/mission-main.png"
                    alt="Notre mission"
                    className="object-cover object-center w-full h-full"
                    page="home"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News - Magazine Style Layout */}
        <section className="news-creative">
          <div className="container">
            <div className="section-header-creative">
              <div className="section-number">03</div>
              <div>
                <DisplayText 
                  id="news.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Actualités
                </DisplayText>
                <DisplayText 
                  id="news.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Découvrez la vie dynamique de notre école
                </DisplayText>
              </div>
            </div>

            {blogPosts === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune actualité disponible pour le moment.</p>
              </div>
            ) : (
              <div className="news-magazine-grid">
                {/* Featured Blog Post */}
                <article className="news-featured">
                  <div className="news-image">
                    {blogPosts[0].coverImageUrl ? (
                      <DisplayImage
                        id="news.featured.image"
                        src={blogPosts[0].coverImageUrl}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                        page="home"
                      />
                    ) : (
                      <DisplayImage
                        id="news.featured.image.default"
                        src="/images/news-featured.jpg"
                        alt="Actualité"
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                        page="home"
                      />
                    )}
                    <div className="news-category">{blogPosts[0].category || "Actualité"}</div>
                  </div>
                  <div className="news-content">
                    <time className="news-date">
                      {formatDate(blogPosts[0].publishedAt)}
                    </time>
                    <h3 className="news-title">{blogPosts[0].title}</h3>
                    <p className="news-excerpt">
                      {blogPosts[0].excerpt || "Découvrez cette actualité de notre école."}
                    </p>
                    <a href={`/journal/${blogPosts[0].slug}`} className="news-link">
                      Lire la suite →
                    </a>
                  </div>
                </article>

                {/* Secondary Blog Posts */}
                <div className="news-secondary">
                  {blogPosts.slice(1, 4).map((post) => (
                    <article key={post._id} className="news-card-small">
                      <div className="news-meta">
                        <span className="news-category-small">{post.category || "Actualité"}</span>
                        <time className="news-date-small">
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h4 className="news-title-small">{post.title}</h4>
                      <p className="news-excerpt-small">
                        {post.excerpt || "Découvrez cette actualité de notre école."}
                      </p>
                      <a href={`/journal/${post.slug}`} className="news-link-small">
                        Lire →
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="news-cta">
              <a href="/journal" className="btn btn-secondary">
                Toutes les actualités
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials - Carousel with Floating Cards */}
        <section className="testimonials-creative">
          <div className="container">
            <div className="section-header-creative">
              <div className="section-number">04</div>
              <div>
                <h2 className="section-title-creative">
                  Ce qu&apos;ils disent de nous
                </h2>
              </div>
            </div>

            {testimonials === undefined ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun témoignage disponible pour le moment.</p>
              </div>
            ) : (
              <TestimonialsCarousel testimonials={testimonials} />
            )}
          </div>
        </section>

        {/* CTA - Interactive Contact Section */}
        <section className="cta-creative">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <DisplayText 
                  id="cta.title" 
                  page="home" 
                  as="h2" 
                  className="cta-title"
                >
                  Prêt à rejoindre notre communauté ?
                </DisplayText>
                <DisplayText 
                  id="cta.description" 
                  page="home" 
                  as="p" 
                  className="cta-description"
                >
                  Découvrez comment Les Hirondelles peut accompagner votre
                  enfant vers l&apos;excellence et la réussite.
                </DisplayText>
              </div>
              <div className="cta-actions">
                <div className="cta-card">
                  <div className="bg-primary text-white p-3 rounded-full w-fit mx-auto mb-2">
                    <FaCalendar className="w-8 h-8" />
                  </div>
                  <DisplayText 
                    id="cta.card1.title" 
                    page="home" 
                    as="h3"
                  >
                    Planifier une visite
                  </DisplayText>
                  <DisplayText 
                    id="cta.card1.description" 
                    page="home" 
                    as="p"
                  >
                    Découvrez nos installations
                  </DisplayText>
                  <a href="/contact" className="btn btn-primary">
                    <DisplayText id="cta.card1.button" page="home">
                      Réserver
                    </DisplayText>
                  </a>
                </div>
                <div className="cta-card">
                  <div className="bg-primary text-white p-3 rounded-full w-fit mx-auto mb-2">
                    <FaFileAlt className="w-8 h-8" />
                  </div>
                  <DisplayText 
                    id="cta.card2.title" 
                    page="home" 
                    as="h3"
                  >
                    Dossier d&apos;inscription
                  </DisplayText>
                  <DisplayText 
                    id="cta.card2.description" 
                    page="home" 
                    as="p"
                  >
                    Téléchargez notre brochure
                  </DisplayText>
                  <a href="/brochure" className="btn btn-secondary">
                    <DisplayText id="cta.card2.button" page="home">
                      Télécharger
                    </DisplayText>
                  </a>
                </div>
                <div className="cta-card">
                  <div className="bg-primary text-white p-3 rounded-full w-fit mx-auto mb-2">
                    <FaComments className="w-8 h-8" />
                  </div>
                  <DisplayText 
                    id="cta.card3.title" 
                    page="home" 
                    as="h3"
                  >
                    Nous contacter
                  </DisplayText>
                  <DisplayText 
                    id="cta.card3.description" 
                    page="home" 
                    as="p"
                  >
                    Posez vos questions
                  </DisplayText>
                  <a
                    href="/contact"
                    className="btn btn-secondary"
                  >
                    <DisplayText id="cta.card3.button" page="home">
                      Discuter
                    </DisplayText>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;