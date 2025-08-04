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
import { useContent } from "../components/ContentProvider";

const MiddleschoolPage: React.FC = () => {
  const { get, isLoading } = useContent();

  const subjects = [
    { icon: <FaBook className="w-6 h-6" />, key: "francais" },
    { icon: <FaCalculator className="w-6 h-6" />, key: "maths" },
    { icon: <FaFlask className="w-6 h-6" />, key: "physique" },
    { icon: <FaLeaf className="w-6 h-6" />, key: "svt" },
    { icon: <FaGlobe className="w-6 h-6" />, key: "histgeo" },
    { icon: <FaLanguage className="w-6 h-6" />, key: "langues" },
    { icon: <FaLaptop className="w-6 h-6" />, key: "info" },
    { icon: <FaMusic className="w-6 h-6" />, key: "arts" },
  ].map((s, i) => ({
    ...s,
    title: get(
      `middleschool.subject.${s.key}.title`,
      [
        "Français",
        "Mathématiques",
        "Sciences Physiques",
        "Sciences Naturelles",
        "Histoire-Géographie",
        "Langues Vivantes",
        "Informatique",
        "Arts & Culture",
      ][i]
    ),
    description: get(
      `middleschool.subject.${s.key}.desc`,
      [
        "Littérature, expression écrite et orale, analyse de textes et préparation au BFEM.",
        "Algèbre, géométrie, statistiques et résolution de problèmes complexes.",
        "Physique et chimie avec expérimentations et méthode scientifique.",
        "Biologie, géologie et éducation à l'environnement.",
        "Étude des civilisations, géopolitique et éducation civique.",
        "Anglais, espagnol et arabe pour une ouverture internationale.",
        "Programmation, bureautique et culture numérique.",
        "Éducation artistique et découverte du patrimoine culturel.",
      ][i]
    ),
  }));

  const classLevels = [0, 1, 2].map((i) => ({
    name: get(`middleschool.level.${i}.name`, ["6ème", "5ème-4ème", "3ème"][i]),
    age: get(`middleschool.level.${i}.age`, ["11-12 ans", "12-14 ans", "14-15 ans"][i]),
    focus: get(
      `middleschool.level.${i}.focus`,
      [
        "Adaptation au collège et méthodes de travail",
        "Approfondissement et spécialisation progressive",
        "Préparation intensive au BFEM",
      ][i]
    ),
    image: get(
      `middleschool.level.${i}.image`,
      [
        "/images/programs/middle-6eme.jpg",
        "/images/programs/middle-5eme4eme.jpg",
        "/images/programs/middle-3eme.jpg",
      ][i]
    ),
    highlights: get(
      `middleschool.level.${i}.highlights`,
      ["Méthodologie,Autonomie,Découverte", "Approfondissement,Projets,Orientation", "BFEM,Orientation,Excellence"][i]
    ).split(","),
  }));

  const achievements = [
    { icon: <FaTrophy className="w-8 h-8" />, key: "reussite" },
    { icon: <FaAward className="w-8 h-8" />, key: "mentions" },
    { icon: <FaLightbulb className="w-8 h-8" />, key: "projets" },
  ].map((a, i) => ({
    ...a,
    title: get(
      `middleschool.achievement.${a.key}.title`,
      ["95% de Réussite", "Mentions TB", "Projets Innovants"][i]
    ),
    description: get(
      `middleschool.achievement.${a.key}.desc`,
      ["Au BFEM", "60% de nos élèves", "Concours nationaux"][i]
    ),
  }));

  const extracurricular = [0, 1, 2, 3].map((i) => ({
    category: get(
      `middleschool.extra.${i}.category`,
      ["Clubs Scientifiques", "Arts & Culture", "Sports", "Langues"][i]
    ),
    activities: get(
      `middleschool.extra.${i}.activities`,
      [
        "Club Robotique,Olympiades de Maths,Sciences Expérimentales",
        "Théâtre,Chorale,Arts Plastiques",
        "Football,Basketball,Athlétisme",
        "Club Anglais,Débats,Échanges Culturels",
      ][i]
    ).split(","),
  }));

  const weeklySchedule = Array.from({ length: 8 }).map((_, i) => ({
    subject: get(
      `middleschool.schedule.${i}.subject`,
      ["Français", "Mathématiques", "Sciences Physiques", "Sciences Naturelles", "Histoire-Géographie", "Anglais", "Arabe", "Arts & Sport"][i] || ""
    ),
    hours: get(
      `middleschool.schedule.${i}.hours`,
      ["5h", "4h", "3h", "2h", "3h", "3h", "2h", "4h"][i] || ""
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
                <span
                  className="text-sm font-semibold text-primary tracking-wider uppercase"
                  data-live-edit-id="middleschool.hero.label"
                >
                  {get("middleschool.hero.label", "Programmes / Collège")}
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span
                    className="block text-gray-900"
                    data-live-edit-id="middleschool.hero.title"
                  >
                    {get("middleschool.hero.title", "Collège")}
                  </span>
                  <span
                    className="block text-primary"
                    data-live-edit-id="middleschool.hero.age"
                  >
                    {get("middleschool.hero.age", "11-15 ans")}
                  </span>
                </h1>

                <div className="max-w-xl">
                  <p
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                    data-live-edit-id="middleschool.hero.desc"
                  >
                    {get(
                      "middleschool.hero.desc",
                      "Excellence académique et préparation au BFEM dans un environnement stimulant qui développe l'esprit critique, l'autonomie et l'ambition de nos futurs leaders."
                    )}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span data-live-edit-id="middleschool.hero.hours">
                        {get("middleschool.hero.hours", "8h00 - 17h00")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span
                        data-live-edit-id="middleschool.hero.classsize"
                      >{`${get("middleschool.hero.classsize", "25 élèves/classe")}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3
                      className="font-semibold text-gray-900 mb-2"
                      data-live-edit-id="middleschool.hero.bfem.title"
                    >
                      {get("middleschool.hero.bfem.title", "Préparation au BFEM")}
                    </h3>
                    <p
                      className="text-gray-700"
                      data-live-edit-id="middleschool.hero.bfem.desc"
                    >
                      {get(
                        "middleschool.hero.bfem.desc",
                        "Programme intensif de préparation au Brevet de Fin d'Études Moyennes avec un accompagnement personnalisé pour chaque élève."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src={get(
                      "middleschool.hero.image",
                      "/images/programs/middleschool-hero.jpg"
                    )}
                    alt="Collège Les Hirondelles"
                    className="object-cover w-full h-full"
                    data-live-edit-id="middleschool.hero.image"
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
                <h3
                  className="text-2xl font-bold mb-2"
                  data-live-edit-id={`middleschool.achievement.${achievement.key}.title`}
                >
                  {achievement.title}
                </h3>
                <p
                  className="text-gray-200"
                  data-live-edit-id={`middleschool.achievement.${achievement.key}.desc`}
                >
                  {achievement.description}
                </p>
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
              <h2
                className="section-title-creative"
                data-live-edit-id="middleschool.levels.title"
              >
                {get("middleschool.levels.title", "Nos Classes")}
              </h2>
              <p
                className="section-description-creative"
                data-live-edit-id="middleschool.levels.desc"
              >
                {get(
                  "middleschool.levels.desc",
                  "Un parcours structuré vers l'excellence et la réussite au BFEM"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classLevels.map((level, index) => (
              <div
                key={index}
                className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={level.image}
                    alt={level.name}
                    className="object-cover w-full h-full"
                    data-live-edit-id={`middleschool.level.${index}.image`}
                  />
                  <div
                    className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold"
                    data-live-edit-id={`middleschool.level.${index}.age`}
                  >
                    {level.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2 color-black"
                    data-live-edit-id={`middleschool.level.${index}.name`}
                  >
                    {level.name}
                  </h3>
                  <p
                    className="text-gray-600 mb-4"
                    data-live-edit-id={`middleschool.level.${index}.focus`}
                  >
                    {level.focus}
                  </p>
                  <div className="space-y-2">
                    {level.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span
                          data-live-edit-id={`middleschool.level.${index}.highlight.${i}`}
                        >
                          {highlight}
                        </span>
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
              <h2
                className="section-title-creative"
                data-live-edit-id="middleschool.subjects.title"
              >
                {get("middleschool.subjects.title", "Nos Matières")}
              </h2>
              <p
                className="section-description-creative"
                data-live-edit-id="middleschool.subjects.desc"
              >
                {get(
                  "middleschool.subjects.desc",
                  "Un curriculum complet préparant aux études supérieures"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="card p-6 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="text-primary mb-4">{subject.icon}</div>
                <h3
                  className="text-lg font-semibold mb-3 color-black"
                  data-live-edit-id={`middleschool.subject.${subject.key}.title`}
                >
                  {subject.title}
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  data-live-edit-id={`middleschool.subject.${subject.key}.desc`}
                >
                  {subject.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extracurricular Activities */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2
                className="section-title-creative"
                data-live-edit-id="middleschool.extra.title"
              >
                {get("middleschool.extra.title", "Activités Extra-scolaires")}
              </h2>
              <p
                className="section-description-creative"
                data-live-edit-id="middleschool.extra.desc"
              >
                {get(
                  "middleschool.extra.desc",
                  "Développement des talents et passions de chaque élève"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {extracurricular.map((category, index) => (
              <div key={index} className="card p-6">
                <h3
                  className="text-lg font-semibold mb-4 color-black text-center"
                  data-live-edit-id={`middleschool.extra.${index}.category`}
                >
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.activities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                      <span data-live-edit-id={`middleschool.extra.${index}.activity.${i}`}>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2
                className="section-title-creative"
                data-live-edit-id="middleschool.schedule.title"
              >
                {get("middleschool.schedule.title", "Emploi du Temps")}
              </h2>
              <p
                className="section-description-creative"
                data-live-edit-id="middleschool.schedule.desc"
              >
                {get(
                  "middleschool.schedule.desc",
                  "Répartition hebdomadaire des matières (26h de cours/semaine)"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {weeklySchedule.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white">
                  <div className="text-gray-700 font-medium" data-live-edit-id={`middleschool.schedule.${index}.subject`}>{item.subject}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold" data-live-edit-id={`middleschool.schedule.${index}.hours`}>{item.hours}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {weeklySchedule.slice(4).map((item, index) => (
                <div key={index + 4} className="flex items-center justify-between p-4 bg-white">
                  <div className="text-gray-700 font-medium" data-live-edit-id={`middleschool.schedule.${index + 4}.subject`}>{item.subject}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold" data-live-edit-id={`middleschool.schedule.${index + 4}.hours`}>{item.hours}</div>
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
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              data-live-edit-id="middleschool.cta.title"
            >
              {get("middleschool.cta.title", "Préparez Votre Enfant à l'Excellence")}
            </h2>
            <p
              className="text-xl text-gray-100 mb-8 leading-relaxed"
              data-live-edit-id="middleschool.cta.desc"
            >
              {get(
                "middleschool.cta.desc",
                "Offrez à votre adolescent une formation collégiale d'exception qui le préparera aux défis du lycée et aux études supérieures."
              )}
            </p>
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

export default MiddleschoolPage;