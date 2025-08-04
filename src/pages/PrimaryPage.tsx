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
import { useContent } from "../components/ContentProvider";

const PrimaryPage: React.FC = () => {
  const { get, isLoading } = useContent();

  const subjects = [
    { icon: <FaBook className="w-6 h-6" />, key: "francais" },
    { icon: <FaCalculator className="w-6 h-6" />, key: "maths" },
    { icon: <FaFlask className="w-6 h-6" />, key: "sciences" },
    { icon: <FaGlobe className="w-6 h-6" />, key: "histgeo" },
    { icon: <FaLanguage className="w-6 h-6" />, key: "langues" },
    { icon: <FaLaptop className="w-6 h-6" />, key: "info" },
  ].map((s, i) => ({
    ...s,
    title: get(
      `primary.subject.${s.key}.title`,
      [
        "Français",
        "Mathématiques",
        "Sciences",
        "Histoire-Géographie",
        "Langues Étrangères",
        "Informatique",
      ][i]
    ),
    description: get(
      `primary.subject.${s.key}.desc`,
      [
        "Maîtrise de la langue française : lecture, écriture, expression orale et littérature.",
        "Développement du raisonnement logique et des compétences numériques.",
        "Découverte du monde scientifique à travers l'expérimentation et l'observation.",
        "Exploration du monde et de l'histoire pour développer la culture générale.",
        "Initiation à l'anglais et autres langues pour une ouverture internationale.",
        "Apprentissage des outils numériques et initiation à la programmation.",
      ][i]
    ),
  }));

  const classLevels = [0, 1, 2].map((i) => ({
    name: get(`primary.level.${i}.name`, ["CP", "CE1-CE2", "CM1-CM2"][i]),
    age: get(`primary.level.${i}.age`, ["6-7 ans", "7-9 ans", "9-11 ans"][i]),
    focus: get(
      `primary.level.${i}.focus`,
      ["Apprentissage de la lecture et de l'écriture", "Consolidation des apprentissages fondamentaux", "Préparation au collège"][i]
    ),
    image: get(
      `primary.level.${i}.image`,
      [
        "/images/programs/primary-cp.jpg",
        "/images/programs/primary-ce.jpg",
        "/images/programs/primary-cm.jpg",
      ][i]
    ),
    highlights: get(
      `primary.level.${i}.highlights`,
      ["Lecture,Écriture,Calcul de base", "Grammaire,Multiplication,Sciences", "Rédaction,Géométrie,Histoire"][i]
    )
      .split(","),
  }));

  const achievements = [
    { icon: <FaTrophy className="w-8 h-8" />, key: "reussite" },
    { icon: <FaChartLine className="w-8 h-8" />, key: "niveau" },
    { icon: <FaUsers className="w-8 h-8" />, key: "suivi" },
  ].map((a, i) => ({
    ...a,
    title: get(
      `primary.achievement.${a.key}.title`,
      ["98% de Réussite", "Niveau Supérieur", "20 Élèves/Classe"][i]
    ),
    description: get(
      `primary.achievement.${a.key}.desc`,
      ["Taux de passage en 6ème", "Aux évaluations nationales", "Suivi personnalisé"][i]
    ),
  }));

  const weeklySchedule = Array.from({ length: 7 }).map((_, i) => ({
    subject: get(
      `primary.schedule.${i}.subject`,
      ["Français", "Mathématiques", "Sciences", "Histoire-Géographie", "Anglais", "Arts & Sport", "Informatique"][i] || ""
    ),
    hours: get(
      `primary.schedule.${i}.hours`,
      ["8h", "6h", "3h", "3h", "2h", "4h", "1h"][i] || ""
    ),
  }));

  if (isLoading) return <div>Chargement...</div>;

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
                <span className="text-sm font-semibold text-primary tracking-wider uppercase" data-live-edit-id="primary.hero.label">
                  {get('primary.hero.label', 'Programmes / Primaire')}
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900" data-live-edit-id="primary.hero.title">{get('primary.hero.title', 'Primaire')}</span>
                  <span className="block text-primary" data-live-edit-id="primary.hero.age">{get('primary.hero.age', '6-11 ans')}</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6" data-live-edit-id="primary.hero.desc">
                    {get('primary.hero.desc', "Des fondations solides pour l'apprentissage académique avec un programme riche qui développe la curiosité intellectuelle et l'autonomie de chaque élève.")}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span data-live-edit-id="primary.hero.hours">{get('primary.hero.hours', '8h00 - 16h30')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span data-live-edit-id="primary.hero.classsize">{get('primary.hero.classsize', '20 élèves/classe')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2" data-live-edit-id="primary.hero.excellence.title">{get('primary.hero.excellence.title', 'Excellence Académique')}</h3>
                    <p className="text-gray-700" data-live-edit-id="primary.hero.excellence.desc">{get('primary.hero.excellence.desc', 'Notre programme suit les standards internationaux tout en intégrant la culture sénégalaise pour une éducation complète et équilibrée.')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src={get('primary.hero.image', '/images/programs/primary-hero.jpg')}
                    alt="Primaire Les Hirondelles"
                    className="object-cover w-full h-full"
                    data-live-edit-id="primary.hero.image"
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
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-accent mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2" data-live-edit-id={`primary.achievement.${achievement.key}.title`}>{achievement.title}</h3>
                <p className="text-gray-200" data-live-edit-id={`primary.achievement.${achievement.key}.desc`}>{achievement.description}</p>
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
              <h2 className="section-title-creative" data-live-edit-id="primary.levels.title">{get('primary.levels.title', 'Nos Classes')}</h2>
              <p className="section-description-creative" data-live-edit-id="primary.levels.desc">{get('primary.levels.desc', 'Un parcours progressif adapté à chaque étape du développement')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classLevels.map((level, index) => (
              <div key={index} className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <img
                    src={level.image}
                    alt={level.name}
                    className="object-cover w-full h-full"
                    data-live-edit-id={`primary.level.${index}.image`}
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold" data-live-edit-id={`primary.level.${index}.age`}>
                    {level.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 color-black" data-live-edit-id={`primary.level.${index}.name`}>{level.name}</h3>
                  <p className="text-gray-600 mb-4" data-live-edit-id={`primary.level.${index}.focus`}>{level.focus}</p>
                  <div className="space-y-2">
                    {level.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span data-live-edit-id={`primary.level.${index}.highlight.${i}`}>{highlight}</span>
                      </div>
                    ))}
                  </div>
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
              <h2 className="section-title-creative" data-live-edit-id="primary.subjects.title">{get('primary.subjects.title', 'Nos Matières')}</h2>
              <p className="section-description-creative" data-live-edit-id="primary.subjects.desc">{get('primary.subjects.desc', 'Un curriculum complet pour développer toutes les compétences')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-primary mb-6">{subject.icon}</div>
                <h3 className="text-xl font-semibold mb-4 color-black" data-live-edit-id={`primary.subject.${subject.key}.title`}>{subject.title}</h3>
                <p className="text-gray-600 leading-relaxed" data-live-edit-id={`primary.subject.${subject.key}.desc`}>{subject.description}</p>
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
              <h2 className="section-title-creative" data-live-edit-id="primary.schedule.title">{get('primary.schedule.title', 'Emploi du Temps')}</h2>
              <p className="section-description-creative" data-live-edit-id="primary.schedule.desc">{get('primary.schedule.desc', 'Répartition hebdomadaire des matières (27h de cours/semaine)')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {weeklySchedule.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="text-gray-700 font-medium" data-live-edit-id={`primary.schedule.${index}.subject`}>{item.subject}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold" data-live-edit-id={`primary.schedule.${index}.hours`}>{item.hours}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {weeklySchedule.slice(4).map((item, index) => (
                <div key={index + 4} className="flex items-center justify-between p-4 bg-gray-50">
                  <div className="text-gray-700 font-medium" data-live-edit-id={`primary.schedule.${index + 4}.subject`}>{item.subject}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold" data-live-edit-id={`primary.schedule.${index + 4}.hours`}>{item.hours}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-live-edit-id="primary.cta.title">{get('primary.cta.title', "Construisez l'Avenir de Votre Enfant")}</h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed" data-live-edit-id="primary.cta.desc">{get('primary.cta.desc', "Offrez à votre enfant une éducation primaire d'excellence qui le préparera aux défis de demain avec confiance et compétence.")}</p>
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