import React from "react";
import { FaPalette, FaRunning, FaUsers, FaMusic, FaLeaf, FaHeart, FaClock, FaGraduationCap, FaChild } from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import SEO from '../components/SEO';

const PreschoolPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Préscolaire - Les Hirondelles"
        description="Programme préscolaire Les Hirondelles à Dakar. Environnement bienveillant pour les 3-5 ans avec éveil artistique, développement moteur et socialisation."
        keywords="préscolaire, maternelle, 3-5 ans, éveil artistique, développement moteur, socialisation, Les Hirondelles, Dakar"
        url="/programs/preschool"
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
                  id="preschool.hero.label" 
                  page="preschool" 
                  as="span" 
                  className="text-sm font-semibold text-primary tracking-wider uppercase"
                >
                  Programmes / Préscolaire
                </DisplayText>
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <DisplayText 
                    id="preschool.hero.title" 
                    page="preschool" 
                    as="span" 
                    className="block text-gray-900"
                  >
                    Préscolaire
                  </DisplayText>
                  <DisplayText 
                    id="preschool.hero.age" 
                    page="preschool" 
                    as="span" 
                    className="block text-primary"
                  >
                    3-5 ans
                  </DisplayText>
                </h1>
                <div className="max-w-xl">
                  <DisplayText 
                    id="preschool.hero.desc" 
                    page="preschool" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Un environnement bienveillant et stimulant où chaque enfant développe sa personnalité, sa créativité et ses premiers apprentissages dans la joie et la sécurité.
                  </DisplayText>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <DisplayText 
                        id="preschool.hero.hours" 
                        page="preschool" 
                        as="span"
                      >
                        8h00 - 16h00
                      </DisplayText>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChild className="w-4 h-4" />
                      <DisplayText 
                        id="preschool.hero.classsize" 
                        page="preschool" 
                        as="span"
                      >
                        15 élèves/classe
                      </DisplayText>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <DisplayText 
                      id="preschool.hero.pedago.title" 
                      page="preschool" 
                      as="h3" 
                      className="font-semibold text-gray-900 mb-2"
                    >
                      Notre Approche Pédagogique
                    </DisplayText>
                    <DisplayText 
                      id="preschool.hero.pedago.desc" 
                      page="preschool" 
                      as="p" 
                      className="text-gray-700"
                    >
                      Basée sur le jeu et l'exploration, notre pédagogie respecte le rythme de chaque enfant tout en favorisant son épanouissement global.
                    </DisplayText>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <DisplayImage
                    id="preschool.hero.image"
                    page="preschool"
                    src="/images/programs/preschool-hero.jpg"
                    alt="Préscolaire Les Hirondelles"
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
      {/* Age Groups Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="preschool.agegroups.title" 
                page="preschool" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Classes
              </DisplayText>
              <DisplayText 
                id="preschool.agegroups.desc" 
                page="preschool" 
                as="p" 
                className="section-description-creative"
              >
                Trois niveaux adaptés au développement de chaque tranche d'âge
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <DisplayImage
                    id={`preschool.agegroup.${index}.image`}
                    page="preschool"
                    src={`/images/programs/preschool-${['small', 'medium', 'large'][index]}.jpg`}
                    alt={`Classe ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold">
                    <DisplayText 
                      id={`preschool.agegroup.${index}.age`} 
                      page="preschool" 
                      as="span"
                    >
                      {["3-4 ans", "4-5 ans", "5-6 ans"][index]}
                    </DisplayText>
                  </div>
                </div>
                <div className="p-6">
                  <DisplayText 
                    id={`preschool.agegroup.${index}.name`} 
                    page="preschool" 
                    as="h3" 
                    className="text-xl font-semibold mb-2 color-black"
                  >
                    {["Petite Section", "Moyenne Section", "Grande Section"][index]}
                  </DisplayText>
                  <DisplayText 
                    id={`preschool.agegroup.${index}.focus`} 
                    page="preschool" 
                    as="p" 
                    className="text-gray-600"
                  >
                    {["Adaptation et premiers apprentissages", "Développement de l'autonomie", "Préparation à l'primaire"][index]}
                  </DisplayText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Program Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="preschool.features.title" 
                page="preschool" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Activités
              </DisplayText>
              <DisplayText 
                id="preschool.features.desc" 
                page="preschool" 
                as="p" 
                className="section-description-creative"
              >
                Un programme riche et varié pour l'épanouissement de votre enfant
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaPalette className="w-6 h-6" />, key: 'artistique' },
              { icon: <FaRunning className="w-6 h-6" />, key: 'moteur' },
              { icon: <FaUsers className="w-6 h-6" />, key: 'social' },
              { icon: <FaMusic className="w-6 h-6" />, key: 'musical' },
              { icon: <FaLeaf className="w-6 h-6" />, key: 'nature' },
              { icon: <FaHeart className="w-6 h-6" />, key: 'bienetre' },
            ].map((feature, index) => (
              <div key={index} className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-accent mb-6">{feature.icon}</div>
                <DisplayText 
                  id={`preschool.feature.${feature.key}.title`} 
                  page="preschool" 
                  as="h3" 
                  className="text-xl font-semibold mb-4 color-black"
                >
                  {["Éveil Artistique", "Développement Moteur", "Socialisation", "Éveil Musical", "Découverte Nature", "Bien-être Émotionnel"][index]}
                </DisplayText>
                <DisplayText 
                  id={`preschool.feature.${feature.key}.desc`} 
                  page="preschool" 
                  as="p" 
                  className="text-gray-600 leading-relaxed"
                >
                  {[
                    "Développement de la créativité à travers l'art, le dessin et les activités manuelles.",
                    "Activités physiques adaptées pour développer la motricité fine et globale.",
                    "Apprentissage du vivre ensemble et développement des compétences sociales.",
                    "Initiation à la musique et au rythme pour stimuler l'expression artistique.",
                    "Exploration de l'environnement et sensibilisation à la nature.",
                    "Accompagnement bienveillant pour l'épanouissement émotionnel."
                  ][index]}
                </DisplayText>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Daily Schedule */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="preschool.schedule.title" 
                page="preschool" 
                as="h2" 
                className="section-title-creative"
              >
                Une Journée Type
              </DisplayText>
              <DisplayText 
                id="preschool.schedule.desc" 
                page="preschool" 
                as="p" 
                className="section-description-creative"
              >
                Un emploi du temps équilibré entre apprentissage, jeu et repos
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50">
                  <div className="text-primary font-semibold text-sm min-w-[100px]">
                    <DisplayText 
                      id={`preschool.schedule.${index}.time`} 
                      page="preschool" 
                      as="span"
                    >
                      {["8h00 - 8h30", "8h30 - 9h30", "9h30 - 10h00", "10h00 - 11h00"][index]}
                    </DisplayText>
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700">
                    <DisplayText 
                      id={`preschool.schedule.${index}.activity`} 
                      page="preschool" 
                      as="span"
                    >
                      {["Accueil et jeux libres", "Activités d'éveil et apprentissage", "Récréation et collation", "Ateliers créatifs"][index]}
                    </DisplayText>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[4, 5, 6, 7].map((index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50">
                  <div className="text-primary font-semibold text-sm min-w-[100px]">
                    <DisplayText 
                      id={`preschool.schedule.${index}.time`} 
                      page="preschool" 
                      as="span"
                    >
                      {["11h00 - 11h30", "11h30 - 12h00", "12h00 - 13h30", "13h30 - 14h30"][index - 4]}
                    </DisplayText>
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700">
                    <DisplayText 
                      id={`preschool.schedule.${index}.activity`} 
                      page="preschool" 
                      as="span"
                    >
                      {["Activités motrices", "Préparation au déjeuner", "Déjeuner et repos", "Activités calmes et lecture"][index - 4]}
                    </DisplayText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <DisplayText 
              id="preschool.cta.title" 
              page="preschool" 
              as="h2" 
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Offrez le Meilleur Départ à Votre Enfant
            </DisplayText>
            <DisplayText 
              id="preschool.cta.desc" 
              page="preschool" 
              as="p" 
              className="text-xl text-gray-100 mb-8 leading-relaxed"
            >
              Rejoignez notre communauté préscolaire et donnez à votre enfant les fondations solides pour son avenir éducatif.
            </DisplayText>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className="btn btn-accent">
                Planifier une Visite
              </a>
              <a
                href="/inscription"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                Dossier d'Inscription
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreschoolPage;