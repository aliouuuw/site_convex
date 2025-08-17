import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import SEO from "../components/SEO";

const AboutPage: React.FC = () => {
  const timelineEntries = useQuery(api.timeline.listTimelineEntries) || [];
  const leadershipTeam = useQuery(api.team.listTeamMembersByCategory, { category: "leadership" }) || [];
  const administrationTeam = useQuery(api.team.listTeamMembersByCategory, { category: "administration" }) || [];
  
  // Combine leadership and administration team members
  const allTeamMembers = [...leadershipTeam, ...administrationTeam];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Notre Histoire & Vision"
        description="Découvrez l'histoire de Les Hirondelles, école privée d'excellence à Dakar depuis 2003. Notre mission, nos valeurs et notre vision pour l'éducation au Sénégal."
        keywords="histoire, vision, mission, valeurs, école privée, Dakar, Sénégal, Les Hirondelles, éducation"
        url="/histoire"
      />
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
                <DisplayText 
                  id="about.badge" 
                  as="span" 
                  className="text-sm font-semibold text-primary tracking-wider uppercase"
                >
                  Histoire
                </DisplayText>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <DisplayText id="about.title" as="span" className="block text-gray-900">
                    Notre Histoire & Vision
                  </DisplayText>
                </h1>

                <div className="max-w-xl">
                  <DisplayText 
                    id="about.intro" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Depuis plus de deux décennies, nous cultivons l'excellence
                    éducative au cœur du Sénégal, formant les leaders de demain
                    avec passion et dévouement.
                  </DisplayText>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <DisplayText 
                        id="about.founded" 
                        as="span"
                      >
                        Fondée en 2003
                      </DisplayText>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <DisplayText 
                        id="about.location" 
                        as="span"
                      >
                        Dakar, Sénégal
                      </DisplayText>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-primary leading-none">"</div>
                  <div>
                    <DisplayText 
                      id="about.quote" 
                      as="p" 
                      className="text-lg italic text-gray-700 mb-3"
                    >
                      Former les citoyens de demain en alliant excellence
                      académique, valeurs humaines et ouverture sur le monde.
                    </DisplayText>
                    <DisplayText 
                      id="about.quote.author" 
                      as="div" 
                      className="text-sm font-semibold text-primary"
                    >
                      — Notre Mission Fondamentale
                    </DisplayText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <DisplayImage
                    id="about.hero.image"
                    src="/images/histoire/school-heritage.jpg"
                    alt="Héritage Les Hirondelles"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-accent"></div>
                <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="about.mission.title" 
                as="h2" 
                className="section-title-creative"
              >
                Notre Mission
              </DisplayText>
              <DisplayText 
                id="about.mission.description" 
                as="p" 
                className="section-description-creative"
              >
                Les valeurs qui guident notre approche éducative
              </DisplayText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <DisplayText 
                id="about.values.excellence.title" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Excellence Académique
              </DisplayText>
              <DisplayText 
                id="about.values.excellence.description" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Viser les plus hauts standards dans l'enseignement et
                l'apprentissage.
              </DisplayText>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <DisplayText 
                id="about.values.respect.title" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Respect & Intégrité
              </DisplayText>
              <DisplayText 
                id="about.values.respect.description" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Cultiver un environnement de respect mutuel, d'honnêteté et de
                responsabilité.
              </DisplayText>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <DisplayText 
                id="about.values.development.title" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Épanouissement Global
              </DisplayText>
              <DisplayText 
                id="about.values.development.description" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Favoriser le développement intellectuel, social, émotionnel et
                physique de chaque élève.
              </DisplayText>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="about.timeline.title" 
                as="h2" 
                className="section-title-creative"
              >
                Notre Parcours
              </DisplayText>
              <DisplayText 
                id="about.timeline.description" 
                as="p" 
                className="section-description-creative"
              >
                Une histoire d'engagement et de croissance continue
              </DisplayText>
            </div>
          </div>

          <div className="space-y-12">
            {timelineEntries.length === 0 ? (
              // Fallback to hardcoded content if no entries in database
              <>
                <div className="flex items-center gap-8">
                  <div className="text-4xl font-bold text-primary min-w-[120px]">
                    <DisplayText id="about.timeline.2003.year">2003</DisplayText>
                  </div>
                  <div className="flex-1">
                    <DisplayText 
                      id="about.timeline.2003.title" 
                      as="h3" 
                      className="text-xl font-semibold mb-2 color-black"
                    >
                      Fondation de L'Institution
                    </DisplayText>
                    <DisplayText 
                      id="about.timeline.2003.description" 
                      as="p" 
                      className="text-gray-600"
                    >
                      Création de Les Hirondelles avec la vision d'une éducation
                      d'excellence au Sénégal.
                    </DisplayText>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-4xl font-bold text-primary min-w-[120px]">
                    <DisplayText id="about.timeline.2008.year">2008</DisplayText>
                  </div>
                  <div className="flex-1">
                    <DisplayText 
                      id="about.timeline.2008.title" 
                      as="h3" 
                      className="text-xl font-semibold mb-2 color-black"
                    >
                      Première Promotion du Primaire
                    </DisplayText>
                    <DisplayText 
                      id="about.timeline.2008.description" 
                      as="p" 
                      className="text-gray-600"
                    >
                      Célébration de nos premiers diplômés du cycle primaire,
                      marquant une étape clé.
                    </DisplayText>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-4xl font-bold text-primary min-w-[120px]">
                    <DisplayText id="about.timeline.2015.year">2015</DisplayText>
                  </div>
                  <div className="flex-1">
                    <DisplayText 
                      id="about.timeline.2015.title" 
                      as="h3" 
                      className="text-xl font-semibold mb-2 color-black"
                    >
                      Expansion avec le Collège
                    </DisplayText>
                    <DisplayText 
                      id="about.timeline.2015.description" 
                      as="p" 
                      className="text-gray-600"
                    >
                      Ouverture du cycle collégial pour offrir un parcours éducatif
                      continu et cohérent.
                    </DisplayText>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-4xl font-bold text-accent min-w-[120px]">
                    <DisplayText id="about.timeline.today.year">Aujourd'hui</DisplayText>
                  </div>
                  <div className="flex-1">
                    <DisplayText 
                      id="about.timeline.today.title" 
                      as="h3" 
                      className="text-xl font-semibold mb-2 color-black"
                    >
                      Vers de Nouveaux Horizons
                    </DisplayText>
                    <DisplayText 
                      id="about.timeline.today.description" 
                      as="p" 
                      className="text-gray-600"
                    >
                      Fiers de notre héritage, nous continuons d'innover pour former
                      les leaders de demain.
                    </DisplayText>
                  </div>
                </div>
              </>
            ) : (
              timelineEntries.map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-8">
                  <div className={`text-4xl font-bold min-w-[120px] ${
                    index === timelineEntries.length - 1 ? 'text-accent' : 'text-primary'
                  }`}>
                    {entry.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 color-black">
                      {entry.title}
                    </h3>
                    <p className="text-gray-600">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="about.team.title" 
                as="h2" 
                className="section-title-creative"
              >
                Notre Équipe de Direction
              </DisplayText>
              <DisplayText 
                id="about.team.description" 
                as="p" 
                className="section-description-creative"
              >
                Des professionnels dévoués qui guident notre institution vers
                l'excellence
              </DisplayText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {allTeamMembers.length === 0 ? (
              // Fallback to hardcoded content if no team members in database
              <>
                <div className="card overflow-hidden">
                  <div className="relative h-72 w-full">
                    <img
                      src="/images/equipe/supervisor.jpg"
                      alt="Mme. NDIAYE Cheikh SY"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 color-black">
                      Mme. NDIAYE Cheikh SY
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      Déclarante Responsable
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Mme. NDIAYE, fondatrice de l'école, est dédiée à la gestion
                      administrative de l'école, favorisant un environnement
                      scolaire positif et inclusif pour tous.
                    </p>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="relative h-72 w-full">
                    <img
                      src="/images/equipe/director.jpg"
                      alt="Mme. Ndiaye Fatou Dabo"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 color-black">
                      Mme. Ndiaye Fatou Dabo
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      Directrice Générale
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Avec plus de 20 ans d'expérience dans l'éducation, Mme. Ndiaye
                      inspire notre vision stratégique et notre engagement envers
                      l'excellence.
                    </p>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="relative h-72 w-full">
                    <img
                      src="/images/equipe/pedagogical-lead.jpg"
                      alt="M. Aliou GOUDIABY"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 color-black">
                      M. Aliou GOUDIABY
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      Gestionnaire Pédagogique
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Passionné par l'innovation pédagogique, M. GOUDIABY veille à
                      la qualité de nos programmes et à l'épanouissement de chaque
                      élève.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              allTeamMembers.map((member) => (
                <div key={member._id} className="card overflow-hidden">
                  <div className="relative h-72 w-full">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <div className="text-6xl font-bold text-gray-600">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 color-black">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-4">
                      {member.role || "—"}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio || "—"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <DisplayText 
              id="about.cta.title" 
              as="h2" 
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Rejoignez Notre Communauté
            </DisplayText>
            <DisplayText 
              id="about.cta.description" 
              as="p" 
              className="text-xl text-gray-100 mb-8 leading-relaxed"
            >
              Découvrez comment Les Hirondelles peut contribuer à
              l'épanouissement et à la réussite de votre enfant.
            </DisplayText>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="btn btn-accent">
                <DisplayText id="about.cta.contact.button">
                  Nous Contacter
                </DisplayText>
              </Link>
              <Link
                to="/inscription"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                <DisplayText id="about.cta.inscription.button">
                  Processus d'inscription
                </DisplayText>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
