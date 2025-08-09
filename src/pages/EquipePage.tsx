import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import SEO from "../components/SEO";

const EquipePage: React.FC = () => {
  const teamMembers = useQuery(api.team.listTeamMembers);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Notre Équipe - Les Hirondelles"
        description="Découvrez les visages et les parcours de ceux qui guident et inspirent notre communauté éducative à Les Hirondelles. Équipe dévouée et expérimentée."
        keywords="équipe, enseignants, personnel, direction, communauté éducative, Les Hirondelles, Dakar"
        url="/equipe"
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
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  Équipe
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <DisplayText id="equipe.title" as="span" className="block text-gray-900">
                    Notre Équipe
                  </DisplayText>
                </h1>

                <div className="max-w-xl">
                  <DisplayText 
                    id="equipe.description" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Découvrez notre équipe pédagogique dévouée et expérimentée qui accompagne chaque élève vers l'excellence.
                  </DisplayText>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-primary leading-none">👥</div>
                  <div>
                    <DisplayText 
                      id="equipe.values.title" 
                      as="h3" 
                      className="font-semibold text-gray-900 mb-2"
                    >
                      Nos Valeurs
                    </DisplayText>
                    <DisplayText 
                      id="equipe.values.description" 
                      as="p" 
                      className="text-gray-700"
                    >
                      Passion, expertise et bienveillance au service de l'éducation de vos enfants.
                    </DisplayText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <DisplayImage
                    id="equipe.hero.image"
                    src="/images/equipe/team-hero.jpg"
                    alt="Équipe Les Hirondelles"
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

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Notre Équipe</h2>
              <p className="section-description-creative">
                Une équipe dévouée prête à accompagner chaque élève.
              </p>
            </div>
          </div>

          {teamMembers === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun membre d'équipe disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="team-card-container bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="relative h-64">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-4xl font-bold text-gray-400">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4">
                      {member.role || "Membre de l'équipe"}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {member.bio || "Aucune biographie disponible pour le moment."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Rejoignez Notre Aventure Éducative
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Contactez-nous pour rencontrer notre équipe et découvrir notre philosophie.
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

export default EquipePage;
