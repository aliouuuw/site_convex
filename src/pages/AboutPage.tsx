import React from "react";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      {/* Hero Section */}
      <section className="relative bg-white text-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-accent"></div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  À propos
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">Notre Histoire</span>
                  <span className="block text-primary">& Vision</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Depuis plus de deux décennies, nous cultivons l'excellence
                    éducative au cœur du Sénégal, formant les leaders de demain
                    avec passion et dévouement.
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>Fondée en 2003</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <span>Dakar, Sénégal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-primary leading-none">"</div>
                  <div>
                    <p className="text-lg italic text-gray-700 mb-3">
                      Former les citoyens de demain en alliant excellence
                      académique, valeurs humaines et ouverture sur le monde.
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      — Notre Mission Fondamentale
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
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
              <h2 className="section-title-creative">Notre Mission</h2>
              <p className="section-description-creative">
                Les valeurs qui guident notre approche éducative
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Excellence Académique
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Viser les plus hauts standards dans l'enseignement et
                l'apprentissage.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Respect & Intégrité
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cultiver un environnement de respect mutuel, d'honnêteté et de
                responsabilité.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Épanouissement Global
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Favoriser le développement intellectuel, social, émotionnel et
                physique de chaque élève.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Notre Parcours</h2>
              <p className="section-description-creative">
                Une histoire d'engagement et de croissance continue
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex items-center gap-8">
              <div className="text-4xl font-bold text-primary min-w-[120px]">
                2003
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 color-black">
                  Fondation de L'Institution
                </h3>
                <p className="text-gray-600">
                  Création de Les Hirondelles avec la vision d'une éducation
                  d'excellence au Sénégal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-4xl font-bold text-primary min-w-[120px]">
                2008
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 color-black">
                  Première Promotion du Primaire
                </h3>
                <p className="text-gray-600">
                  Célébration de nos premiers diplômés du cycle primaire,
                  marquant une étape clé.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-4xl font-bold text-primary min-w-[120px]">
                2015
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 color-black">
                  Expansion avec le Collège
                </h3>
                <p className="text-gray-600">
                  Ouverture du cycle collégial pour offrir un parcours éducatif
                  continu et cohérent.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-4xl font-bold text-accent min-w-[120px]">
                Aujourd'hui
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 color-black">
                  Vers de Nouveaux Horizons
                </h3>
                <p className="text-gray-600">
                  Fiers de notre héritage, nous continuons d'innover pour former
                  les leaders de demain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">
                Notre Équipe de Direction
              </h2>
              <p className="section-description-creative">
                Des professionnels dévoués qui guident notre institution vers
                l'excellence
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez Notre Communauté
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Découvrez comment Les Hirondelles peut contribuer à
              l'épanouissement et à la réussite de votre enfant.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="btn btn-accent">
                Nous Contacter
              </Link>
              <Link
                to="/inscription"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                Processus d'inscription
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
