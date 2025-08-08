import React, { useRef } from 'react';
import { EditableImageSlider, EditableImageSliderRef } from '../components/EditableImageSlider';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import { useEditMode } from '../hooks/useEditMode';

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

const testimonials = [
  {
    quote:
      "Les Hirondelles a donné à ma fille la confiance et les compétences nécessaires pour réussir. L'équipe pédagogique est exceptionnelle.",
    author: "Mme Fatou Diop",
    role: "Parent d'élève",
    image: "/images/parent1.png",
  },
  {
    quote:
      "Une école qui allie excellence académique et valeurs humaines. Mon fils s'épanouit chaque jour.",
    author: "M. Amadou Sall",
    role: "Parent d'élève",
    image: "/images/parent2.png",
  },
];

const newsEvents = [
  {
    title: "Journée Portes Ouvertes",
    date: "15 Mars 2024",
    description:
      "Venez découvrir notre établissement et rencontrer nos équipes",
    type: "Événement",
  },
  {
    title: "Concours de Sciences",
    date: "22 Mars 2024",
    description: "Nos élèves de collège participent au concours national",
    type: "Actualité",
  },
  {
    title: "Spectacle de fin d'année",
    date: "10 Juin 2024",
    description: "Représentation théâtrale et musicale de nos élèves",
    type: "Événement",
  },
];

const HomePage: React.FC = () => {
  const { isEditMode } = useEditMode();
  const backgroundSliderRef = useRef<EditableImageSliderRef>(null);
  
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section - Condensed Content */}
        <section className="hero-background-optimized">
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-0">
            <EditableImageSlider
              ref={backgroundSliderRef}
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
          <div className={`absolute top-0 left-0 w-full h-full bg-linear-to-r from-[var(--primary)] to-[var(--accent)]/50 opacity-50 ${isEditMode ? 'pointer-events-none' : ''}`} style={{ zIndex: isEditMode ? -1 : 10 }}></div>
          
          {/* Background Image Edit Button - Only visible in edit mode */}
          {isEditMode && (
            <div className="absolute top-4 left-4 z-30">
              <button
                onClick={() => {
                  backgroundSliderRef.current?.triggerEdit();
                }}
                className="bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded text-sm transition-colors shadow-lg backdrop-blur"
                title="Edit Background Images"
              >
                🖼️ Edit Background
              </button>
            </div>
          )}
          
          <div className="container z-20">
            <div className="hero-content-background">
              <div className="hero-badge-elegant">
                <EditableText id="hero.badge" page="home">
                  Excellence depuis 20+ ans
                </EditableText>
              </div>
              <EditableText 
                id="hero.title" 
                page="home" 
                as="h1" 
                className="hero-title-background"
              >
                Former les leaders de demain
              </EditableText>
              <EditableText 
                id="hero.description" 
                page="home" 
                as="p" 
                className="hero-description-background"
              >
                Excellence académique et valeurs humaines du préscolaire au
                collège.
              </EditableText>
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
                  <EditableText id="hero.stats.students" page="home" className="stat-number-inline">
                    500+
                  </EditableText>
                  <EditableText id="hero.stats.students.label" page="home" className="stat-label-inline">
                    Élèves
                  </EditableText>
                </div>
                <div className="hero-stat-inline">
                  <EditableText id="hero.stats.success" page="home" className="stat-number-inline">
                    98%
                  </EditableText>
                  <EditableText id="hero.stats.success.label" page="home" className="stat-label-inline">
                    Réussite
                  </EditableText>
                </div>
                <div className="hero-stat-inline">
                  <EditableText id="hero.stats.years" page="home" className="stat-number-inline">
                    20+
                  </EditableText>
                  <EditableText id="hero.stats.years.label" page="home" className="stat-label-inline">
                    Années
                  </EditableText>
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
                <EditableText 
                  id="programs.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Nos Programmes
                </EditableText>
                <EditableText 
                  id="programs.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Un parcours éducatif complet qui accompagne chaque élève vers
                  l&apos;excellence
                </EditableText>
              </div>
            </div>

            <div className="programs-grid-simplified">
              {schoolLevels.map((level, index) => (
                <div key={index} className="program-card-simplified">
                  <div className="program-image-simplified">
                    <EditableImage
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
                      href={`/programs/${level.title.toLowerCase()}`}
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
                <EditableText 
                  id="mission.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Notre Mission
                </EditableText>
                <EditableText 
                  id="mission.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Former les citoyens de demain avec excellence et bienveillance
                </EditableText>
              </div>
            </div>

            <div className="mission-grid">
              <div className="mission-content-simplified">
                <EditableText 
                  id="mission.main" 
                  page="home" 
                  as="p" 
                  className="mission-text-large"
                >
                  Nous nous engageons à offrir une éducation de qualité qui
                  forme les citoyens de demain, cultivant l&apos;excellence
                  académique tout en développant les valeurs humaines
                  essentielles.
                </EditableText>
                <EditableText 
                  id="mission.secondary" 
                  page="home" 
                  as="p" 
                  className="mission-text-regular"
                >
                  Depuis notre création, nous accompagnons chaque élève dans son
                  épanouissement personnel et sa réussite scolaire, de la
                  maternelle au collège.
                </EditableText>

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
                  <EditableImage
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
                <EditableText 
                  id="news.title" 
                  page="home" 
                  as="h2" 
                  className="section-title-creative"
                >
                  Actualités
                </EditableText>
                <EditableText 
                  id="news.description" 
                  page="home" 
                  as="p" 
                  className="section-description-creative"
                >
                  Découvrez la vie dynamique de notre école
                </EditableText>
              </div>
            </div>

            <div className="news-magazine-grid">
              <article className="news-featured">
                <div className="news-image">
                  <EditableImage
                    id="news.featured.image"
                    src="/images/news-featured.jpg"
                    alt="Actualité principale"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    page="home"
                  />
                  <div className="news-category">Événement</div>
                </div>
                <div className="news-content">
                  <time className="news-date">15 Mars 2024</time>
                  <h3 className="news-title">Journée Portes Ouvertes 2024</h3>
                  <p className="news-excerpt">
                    Venez découvrir notre établissement, rencontrer nos équipes
                    pédagogiques et visiter nos installations modernes.
                  </p>
                  <a href="/news/portes-ouvertes" className="news-link">
                    Lire la suite →
                  </a>
                </div>
              </article>

              <div className="news-secondary">
                {newsEvents.slice(1).map((item, index) => (
                  <article key={index} className="news-card-small">
                    <div className="news-meta">
                      <span className="news-category-small">{item.type}</span>
                      <time className="news-date-small">{item.date}</time>
                    </div>
                    <h4 className="news-title-small">{item.title}</h4>
                    <p className="news-excerpt-small">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="news-cta">
              <a href="/news" className="btn btn-secondary">
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

            <div className="testimonials-carousel">
              <div className="testimonials-track">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial-card-creative">
                    <div className="testimonial-content-creative">
                      <div className="testimonial-quote-creative">
                        <span className="quote-mark"></span>
                        <p>{testimonial.quote}</p>
                      </div>
                      <div className="testimonial-author-creative">
                        <div className="author-avatar">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="author-info">
                          <h4>{testimonial.author}</h4>
                          <p>{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Interactive Contact Section */}
        <section className="cta-creative">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <h2 className="cta-title">
                  Prêt à rejoindre notre communauté ?
                </h2>
                <p className="cta-description">
                  Découvrez comment Les Hirondelles peut accompagner votre
                  enfant vers l&apos;excellence et la réussite.
                </p>
              </div>
              <div className="cta-actions">
                <div className="cta-card">
                  <div className="cta-card-icon">📅</div>
                  <h3>Planifier une visite</h3>
                  <p>Découvrez nos installations</p>
                  <a href="/contact" className="btn btn-primary">
                    Réserver
                  </a>
                </div>
                <div className="cta-card">
                  <div className="cta-card-icon">📋</div>
                  <h3>Dossier d&apos;inscription</h3>
                  <p>Téléchargez notre brochure</p>
                  <a href="/brochure" className="btn btn-secondary">
                    Télécharger
                  </a>
                </div>
                <div className="cta-card">
                  <div className="cta-card-icon">💬</div>
                  <h3>Nous contacter</h3>
                  <p>Posez vos questions</p>
                  <a
                    href="/contact"
                    className="btn btn-secondary"
                  >
                    Discuter
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