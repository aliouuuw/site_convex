import React from "react";
import {
  FaBook,
  FaCalculator,
  FaFlask,
  FaGlobe,
  FaLanguage,
  FaLaptop,
  FaMusic,
  FaClock,
  FaGraduationCap,
  FaUsers,
  FaTrophy,
  FaAward,
  FaLightbulb,
  FaLeaf,
} from "react-icons/fa";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
import SEO from "../components/SEO";

const MiddleschoolPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Collège - Les Hirondelles"
        description="Programme collège Les Hirondelles à Dakar. Préparation à l'excellence académique et personnelle avec préparation BFEM, clubs et activités, orientation."
        keywords="collège, 11-15 ans, BFEM, préparation, orientation, clubs, activités, Les Hirondelles, Dakar"
        url="/programs/middleschool"
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
                  id="middleschool.hero.label" 
                  page="middleschool" 
                  as="span" 
                  className="text-sm font-semibold text-primary tracking-wider uppercase"
                >
                  Programmes / Collège
                </DisplayText>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <DisplayText 
                    id="middleschool.hero.title" 
                    page="middleschool" 
                    as="span" 
                    className="block text-gray-900"
                  >
                    Collège
                  </DisplayText>
                  <DisplayText 
                    id="middleschool.hero.age" 
                    page="middleschool" 
                    as="span" 
                    className="block text-primary"
                  >
                    11-15 ans
                  </DisplayText>
                </h1>

                <div className="max-w-xl">
                  <DisplayText 
                    id="middleschool.hero.desc" 
                    page="middleschool" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Excellence académique et préparation au BFEM dans un environnement stimulant qui développe l'esprit critique, l'autonomie et l'ambition de nos futurs leaders.
                  </DisplayText>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <DisplayText 
                        id="middleschool.hero.hours" 
                        page="middleschool" 
                        as="span"
                      >
                        8h00 - 17h00
                      </DisplayText>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <DisplayText 
                        id="middleschool.hero.classsize" 
                        page="middleschool" 
                        as="span"
                      >
                        25 élèves/classe
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
                      id="middleschool.hero.excellence.title" 
                      page="middleschool" 
                      as="h3" 
                      className="font-semibold text-gray-900 mb-2"
                    >
                      Excellence Académique
                    </DisplayText>
                    <DisplayText 
                      id="middleschool.hero.excellence.desc" 
                      page="middleschool" 
                      as="p" 
                      className="text-gray-700"
                    >
                      Notre programme prépare les élèves au BFEM avec rigueur tout en développant leur esprit critique et leur autonomie.
                    </DisplayText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <DisplayImage
                    id="middleschool.hero.image"
                    page="middleschool"
                    src="/images/programs/middle-hero.jpg"
                    alt="Collège Les Hirondelles"
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
              { icon: <FaAward className="w-8 h-8" />, key: "mentions" },
              { icon: <FaLightbulb className="w-8 h-8" />, key: "projets" },
            ].map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-accent mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <DisplayText 
                  id={`middleschool.achievement.${achievement.key}.title`} 
                  page="middleschool" 
                  as="h3" 
                  className="text-2xl font-bold mb-2"
                >
                  {["95% de Réussite", "Mentions TB", "Projets Innovants"][index]}
                </DisplayText>
                <DisplayText 
                  id={`middleschool.achievement.${achievement.key}.desc`} 
                  page="middleschool" 
                  as="p" 
                  className="text-gray-200"
                >
                  {["Au BFEM", "60% de nos élèves", "Concours nationaux"][index]}
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
                id="middleschool.levels.title" 
                page="middleschool" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Niveaux
              </DisplayText>
              <DisplayText 
                id="middleschool.levels.desc" 
                page="middleschool" 
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
                    id={`middleschool.level.${index}.image`}
                    page="middleschool"
                    src={`/images/programs/middle-${['6eme', '5eme4eme', '3eme'][index]}.jpg`}
                    alt={`Niveau ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold">
                    <DisplayText 
                      id={`middleschool.level.${index}.age`} 
                      page="middleschool" 
                      as="span"
                    >
                      {["11-12 ans", "12-14 ans", "14-15 ans"][index]}
                    </DisplayText>
                  </div>
                </div>
                <div className="p-6">
                  <DisplayText 
                    id={`middleschool.level.${index}.name`} 
                    page="middleschool" 
                    as="h3" 
                    className="text-xl font-semibold mb-2 color-black"
                  >
                    {["6ème", "5ème-4ème", "3ème"][index]}
                  </DisplayText>
                  <DisplayText 
                    id={`middleschool.level.${index}.focus`} 
                    page="middleschool" 
                    as="p" 
                    className="text-gray-600"
                  >
                    {["Adaptation au collège et méthodes de travail", "Approfondissement et spécialisation progressive", "Préparation intensive au BFEM"][index]}
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
                id="middleschool.subjects.title" 
                page="middleschool" 
                as="h2" 
                className="section-title-creative"
              >
                Nos Matières
              </DisplayText>
              <DisplayText 
                id="middleschool.subjects.desc" 
                page="middleschool" 
                as="p" 
                className="section-description-creative"
              >
                Un programme complet et équilibré
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaBook className="w-6 h-6" />, key: "francais" },
              { icon: <FaCalculator className="w-6 h-6" />, key: "maths" },
              { icon: <FaFlask className="w-6 h-6" />, key: "physique" },
              { icon: <FaLeaf className="w-6 h-6" />, key: "svt" },
              { icon: <FaGlobe className="w-6 h-6" />, key: "histgeo" },
              { icon: <FaLanguage className="w-6 h-6" />, key: "langues" },
              { icon: <FaLaptop className="w-6 h-6" />, key: "info" },
              { icon: <FaMusic className="w-6 h-6" />, key: "arts" },
            ].map((subject, index) => (
              <div key={index} className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-accent mb-6">{subject.icon}</div>
                <DisplayText 
                  id={`middleschool.subject.${subject.key}.title`} 
                  page="middleschool" 
                  as="h3" 
                  className="text-xl font-semibold mb-4 color-black"
                >
                  {["Français", "Mathématiques", "Sciences Physiques", "Sciences Naturelles", "Histoire-Géographie", "Langues Vivantes", "Informatique", "Arts & Culture"][index]}
                </DisplayText>
                <DisplayText 
                  id={`middleschool.subject.${subject.key}.desc`} 
                  page="middleschool" 
                  as="p" 
                  className="text-gray-600 leading-relaxed"
                >
                  {[
                    "Littérature, expression écrite et orale, analyse de textes et préparation au BFEM.",
                    "Algèbre, géométrie, statistiques et résolution de problèmes complexes.",
                    "Physique et chimie avec expérimentations et méthode scientifique.",
                    "Biologie, géologie et éducation à l'environnement.",
                    "Étude des civilisations, géopolitique et éducation civique.",
                    "Anglais, espagnol et arabe pour une ouverture internationale.",
                    "Programmation, bureautique et culture numérique.",
                    "Éducation artistique et découverte du patrimoine culturel.",
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
                id="middleschool.schedule.title" 
                page="middleschool" 
                as="h2" 
                className="section-title-creative"
              >
                Emploi du Temps Hebdomadaire
              </DisplayText>
              <DisplayText 
                id="middleschool.schedule.desc" 
                page="middleschool" 
                as="p" 
                className="section-description-creative"
              >
                Un programme équilibré entre les matières fondamentales et les activités
              </DisplayText>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="card p-6 text-center">
                <DisplayText 
                  id={`middleschool.schedule.${index}.subject`} 
                  page="middleschool" 
                  as="h3" 
                  className="font-semibold text-gray-900 mb-2"
                >
                  {["Français", "Mathématiques", "Sciences Physiques", "Sciences Naturelles", "Histoire-Géographie", "Anglais", "Arabe", "Arts & Sport"][index]}
                </DisplayText>
                <DisplayText 
                  id={`middleschool.schedule.${index}.hours`} 
                  page="middleschool" 
                  as="p" 
                  className="text-primary font-bold text-lg"
                >
                  {["5h", "4h", "3h", "2h", "3h", "3h", "2h", "4h"][index]}
                </DisplayText>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MiddleschoolPage;