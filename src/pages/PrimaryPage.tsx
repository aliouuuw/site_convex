import React from "react";
import {
  FaBook,
  FaCalculator,
  FaGlobe,
  FaFlask,
  FaLanguage,
  FaLaptop,
  FaClock,
  FaGraduationCap,
  FaUsers,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import SEO from "../components/SEO";

const PrimaryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Primaire - Les Hirondelles"
        description="Programme primaire Les Hirondelles à Dakar. Fondations solides pour l'apprentissage académique avec français, mathématiques, sciences et langues étrangères."
        keywords="primaire, école primaire, 6-11 ans, français, mathématiques, sciences, langues étrangères, Les Hirondelles, Dakar"
        url="/programs/primary"
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
                  id="primary.hero.label" 
                  page="primary" 
                  as="span" 
                  className="text-sm font-semibold text-primary tracking-wider uppercase"
                >
                  Programmes / Primaire
                </DisplayText>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <DisplayText 
                    id="primary.hero.title" 
                    page="primary" 
                    as="span" 
                    className="block text-gray-900"
                  >
                    Primaire
                  </DisplayText>
                  <DisplayText 
                    id="primary.hero.age" 
                    page="primary" 
                    as="span" 
                    className="block text-primary"
                  >
                    6-11 ans
                  </DisplayText>
                </h1>

                <div className="max-w-xl">
                  <DisplayText 
                    id="primary.hero.desc" 
                    page="primary" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Des fondations solides pour l'apprentissage académique avec un programme riche qui développe la curiosité intellectuelle et l'autonomie de chaque élève.
                  </DisplayText>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <DisplayText 
                        id="primary.hero.hours" 
                        page="primary" 
                        as="span"
                      >
                        8h00 - 16h30
                      </DisplayText>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <DisplayText 
                        id="primary.hero.classsize" 
                        page="primary" 
                        as="span"
                      >
                        20 élèves/classe
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
                      id="primary.hero.excellence.title" 
                      page="primary" 
                      as="h3" 
                      className="font-semibold text-gray-900 mb-2"
                    >
                      Excellence Académique
                    </DisplayText>
                    <DisplayText 
                      id="primary.hero.excellence.desc" 
                      page="primary" 
                      as="p" 
                      className="text-gray-700"
                    >
                      Notre programme suit les standards internationaux tout en intégrant la culture sénégalaise pour une éducation complète et équilibrée.
                    </DisplayText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <DisplayImage
                    id="primary.hero.image"
                    page="primary"
                    src="/images/programs/primary-hero.jpg"
                    alt="Primaire Les Hirondelles"
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

      {/* Achievements Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FaTrophy className="w-8 h-8" />, key: "reussite" },
              { icon: <FaChartLine className="w-8 h-8" />, key: "niveau" },
              { icon: <FaUsers className="w-8 h-8" />, key: "suivi" },
            ].map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-accent mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <DisplayText 
                  id={`primary.achievement.${achievement.key}.title`} 
                  page="primary" 
                  as="h3" 
                  className="text-2xl font-bold mb-2"
                >
                  {["98% de Réussite", "Niveau Supérieur", "20 Élèves/Classe"][index]}
                </DisplayText>
                <DisplayText 
                  id={`primary.achievement.${achievement.key}.desc`} 
                  page="primary" 
                  as="p" 
                  className="text-gray-200"
                >
                  {["Taux de passage en 6ème", "Aux évaluations nationales", "Suivi personnalisé"][index]}
                </DisplayText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Levels Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="primary.levels.title" 
                page="primary" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Niveaux
              </DisplayText>
              <DisplayText 
                id="primary.levels.desc" 
                page="primary" 
                as="p" 
                className="section-description-creative"
              >
                Trois cycles adaptés au développement de chaque élève
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <DisplayImage
                    id={`primary.level.${index}.image`}
                    page="primary"
                    src={`/images/programs/primary-${['cp', 'ce', 'cm'][index]}.jpg`}
                    alt={`Niveau ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold">
                    <DisplayText 
                      id={`primary.level.${index}.age`} 
                      page="primary" 
                      as="span"
                    >
                      {["6-7 ans", "7-9 ans", "9-11 ans"][index]}
                    </DisplayText>
                  </div>
                </div>
                <div className="p-6">
                  <DisplayText 
                    id={`primary.level.${index}.name`} 
                    page="primary" 
                    as="h3" 
                    className="text-xl font-semibold mb-2 color-black"
                  >
                    {["CP", "CE1-CE2", "CM1-CM2"][index]}
                  </DisplayText>
                  <DisplayText 
                    id={`primary.level.${index}.focus`} 
                    page="primary" 
                    as="p" 
                    className="text-gray-600"
                  >
                    {["Apprentissage de la lecture et de l'écriture", "Consolidation des apprentissages fondamentaux", "Préparation au collège"][index]}
                  </DisplayText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="primary.subjects.title" 
                page="primary" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Matières
              </DisplayText>
              <DisplayText 
                id="primary.subjects.desc" 
                page="primary" 
                as="p" 
                className="section-description-creative"
              >
                Un programme complet et équilibré
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaBook className="w-6 h-6" />, key: "francais" },
              { icon: <FaCalculator className="w-6 h-6" />, key: "maths" },
              { icon: <FaFlask className="w-6 h-6" />, key: "sciences" },
              { icon: <FaGlobe className="w-6 h-6" />, key: "histgeo" },
              { icon: <FaLanguage className="w-6 h-6" />, key: "langues" },
              { icon: <FaLaptop className="w-6 h-6" />, key: "info" },
            ].map((subject, index) => (
              <div key={index} className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-accent mb-6">{subject.icon}</div>
                <DisplayText 
                  id={`primary.subject.${subject.key}.title`} 
                  page="primary" 
                  as="h3" 
                  className="text-xl font-semibold mb-4 color-black"
                >
                  {["Français", "Mathématiques", "Sciences", "Histoire-Géographie", "Langues Étrangères", "Informatique"][index]}
                </DisplayText>
                <DisplayText 
                  id={`primary.subject.${subject.key}.desc`} 
                  page="primary" 
                  as="p" 
                  className="text-gray-600 leading-relaxed"
                >
                  {[
                    "Maîtrise de la langue française : lecture, écriture, expression orale et littérature.",
                    "Développement du raisonnement logique et des compétences numériques.",
                    "Découverte du monde scientifique à travers l'expérimentation et l'observation.",
                    "Exploration du monde et de l'histoire pour développer la culture générale.",
                    "Initiation à l'anglais et autres langues pour une ouverture internationale.",
                    "Apprentissage des outils numériques et initiation à la programmation.",
                  ][index]}
                </DisplayText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="primary.schedule.title" 
                page="primary" 
                as="h2" 
                className="section-title-creative"
              >
                Emploi du Temps Hebdomadaire
              </DisplayText>
              <DisplayText 
                id="primary.schedule.desc" 
                page="primary" 
                as="p" 
                className="section-description-creative"
              >
                Un programme équilibré entre les matières fondamentales et les activités
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="card p-6 text-center">
                <DisplayText 
                  id={`primary.schedule.${index}.subject`} 
                  page="primary" 
                  as="h3" 
                  className="font-semibold text-gray-900 mb-2"
                >
                  {["Français", "Mathématiques", "Sciences", "Histoire-Géographie", "Anglais", "Arts & Sport", "Informatique"][index]}
                </DisplayText>
                <DisplayText 
                  id={`primary.schedule.${index}.hours`} 
                  page="primary" 
                  as="p" 
                  className="text-primary font-bold text-lg"
                >
                  {["8h", "6h", "3h", "3h", "2h", "4h", "1h"][index]}
                </DisplayText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <DisplayText 
              id="primary.cta.title" 
              page="primary" 
              as="h2" 
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Construisez l'Avenir de Votre Enfant
            </DisplayText>
            <DisplayText 
              id="primary.cta.desc" 
              page="primary" 
              as="p" 
              className="text-xl text-gray-100 mb-8 leading-relaxed"
            >
              Offrez à votre enfant une éducation primaire d'excellence qui le préparera aux défis de demain avec confiance et compétence.
            </DisplayText>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className="btn btn-accent">Planifier une Visite</a>
              <a href="/inscription" className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]">Dossier d'Inscription</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrimaryPage;