import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import OptimizedImage from '../components/OptimizedImage';
import SEO from "../components/SEO";

const EquipePage: React.FC = () => {
  // Fetch team members by category
  const leadershipTeam = useQuery(api.team.listTeamMembersByCategory, { category: "leadership" }) || [];
  const administrationTeam = useQuery(api.team.listTeamMembersByCategory, { category: "administration" }) || [];
  const teachersTeam = useQuery(api.team.listTeamMembersByCategory, { category: "teachers" }) || [];
  const staffTeam = useQuery(api.team.listTeamMembersByCategory, { category: "staff" }) || [];
  const otherTeam = useQuery(api.team.listTeamMembersByCategory, { category: "other" }) || [];

  // Helper function to render team member card
  const renderTeamMemberCard = (member: any) => {
    const getCategoryBadgeColor = (category: string) => {
      switch (category) {
        case 'leadership': return 'bg-blue-100 text-blue-800';
        case 'administration': return 'bg-purple-100 text-purple-800';
        case 'teachers': return 'bg-green-100 text-green-800';
        case 'staff': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getCategoryLabel = (category: string) => {
      switch (category) {
        case 'leadership': return 'Direction';
        case 'administration': return 'Administration';
        case 'teachers': return 'Enseignant';
        case 'staff': return 'Personnel';
        default: return 'Autre';
      }
    };

    return (
      <div
        key={member._id}
        className="team-card-container bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="relative h-64">
          {member.photo ? (
            <OptimizedImage
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover"
              wrapperClassName="w-full h-full"
              fallbackContent={
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-4xl font-bold text-gray-400">
                    {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                </div>
              }
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-400">
                {member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </div>
          )}
          {/* Category badge */}
          {member.category && (
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(member.category)}`}>
                <DisplayText id={`equipe.category.${member.category}.label`}>
                  {getCategoryLabel(member.category)}
                </DisplayText>
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {member.name}
          </h3>
          <p className="text-primary font-semibold mb-4">
            {member.role ? (
              member.role
            ) : (
              <DisplayText id="equipe.member.role.fallback">Membre de l'équipe</DisplayText>
            )}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {member.bio ? (
              member.bio
            ) : (
              <DisplayText id="equipe.member.bio.fallback">
                Aucune biographie disponible pour le moment.
              </DisplayText>
            )}
          </p>
        </div>
      </div>
    );
  };

  // Helper function to render team section
  const renderTeamSection = (titleId: string, descriptionId: string, members: any[], category: string) => {
    if (members.length === 0) return null;
    
    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case 'leadership': return 'from-blue-500 to-blue-600';
        case 'administration': return 'from-purple-500 to-purple-600';
        case 'teachers': return 'from-green-500 to-green-600';
        case 'staff': return 'from-orange-500 to-orange-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };
    
    return (
      <section className={`py-24 ${category === 'leadership' ? 'bg-white' : category === 'administration' ? 'bg-gray-50' : category === 'teachers' ? 'bg-white' : category === 'staff' ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className={`w-1 h-8 bg-gradient-to-b ${getCategoryColor(category)} rounded-full`}></div>
                <DisplayText 
                  id={titleId} 
                  as="h2" 
                  className="section-title-creative"
                >
                  {category === 'leadership' ? 'Direction & Leadership' :
                   category === 'administration' ? 'Administration' :
                   category === 'teachers' ? 'Corps Enseignant' :
                   category === 'staff' ? 'Personnel de Soutien' : 'Autres Membres'}
                </DisplayText>
                <div className={`w-1 h-8 bg-gradient-to-b ${getCategoryColor(category)} rounded-full`}></div>
              </div>
              <DisplayText 
                id={descriptionId} 
                as="p" 
                className="section-description-creative"
              >
                {category === 'leadership' ? 'Notre équipe de direction qui guide notre institution vers l\'excellence' :
                 category === 'administration' ? 'L\'équipe administrative qui assure le bon fonctionnement de notre école' :
                 category === 'teachers' ? 'Nos enseignants passionnés qui transmettent le savoir avec dévouement' :
                 category === 'staff' ? 'Notre équipe de soutien qui contribue au bien-être de notre communauté' :
                 'Autres membres de notre équipe qui enrichissent notre communauté'}
              </DisplayText>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {members.map(renderTeamMemberCard)}
          </div>
        </div>
      </section>
    );
  };

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
                  <DisplayText id="equipe.badge">
                    Équipe
                  </DisplayText>
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

      {/* Leadership Team Section */}
      {renderTeamSection(
        "equipe.sections.leadership.title",
        "equipe.sections.leadership.description",
        leadershipTeam,
        "leadership"
      )}

      {/* Administration Team Section */}
      {renderTeamSection(
        "equipe.sections.administration.title",
        "equipe.sections.administration.description",
        administrationTeam,
        "administration"
      )}

      {/* Teachers Team Section */}
      {renderTeamSection(
        "equipe.sections.teachers.title",
        "equipe.sections.teachers.description",
        teachersTeam,
        "teachers"
      )}

      {/* Staff Team Section */}
      {renderTeamSection(
        "equipe.sections.staff.title",
        "equipe.sections.staff.description",
        staffTeam,
        "staff"
      )}

      {/* Other Team Section */}
      {renderTeamSection(
        "equipe.sections.other.title",
        "equipe.sections.other.description",
        otherTeam,
        "other"
      )}

      {/* Empty State */}
      {leadershipTeam.length === 0 && 
       administrationTeam.length === 0 && 
       teachersTeam.length === 0 && 
       staffTeam.length === 0 && 
       otherTeam.length === 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center py-12">
              <DisplayText 
                id="equipe.empty.message" 
                as="p" 
                className="text-gray-500"
              >
                Aucun membre d'équipe disponible pour le moment.
              </DisplayText>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <DisplayText 
              id="equipe.cta.title" 
              as="h2" 
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Rejoignez Notre Aventure Éducative
            </DisplayText>
            <DisplayText 
              id="equipe.cta.description" 
              as="p" 
              className="text-xl text-gray-100 mb-8 leading-relaxed"
            >
              Contactez-nous pour rencontrer notre équipe et découvrir notre philosophie.
            </DisplayText>
            <a href="/contact" className="btn btn-accent">
              <DisplayText id="equipe.cta.button">
                Nous Contacter
              </DisplayText>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EquipePage;
