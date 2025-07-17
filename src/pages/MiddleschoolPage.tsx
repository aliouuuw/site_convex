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

const subjects = [
  {
    icon: <FaBook className="w-6 h-6" />,
    title: "Français",
    description:
      "Littérature, expression écrite et orale, analyse de textes et préparation au BFEM.",
  },
  {
    icon: <FaCalculator className="w-6 h-6" />,
    title: "Mathématiques",
    description:
      "Algèbre, géométrie, statistiques et résolution de problèmes complexes.",
  },
  {
    icon: <FaFlask className="w-6 h-6" />,
    title: "Sciences Physiques",
    description:
      "Physique et chimie avec expérimentations et méthode scientifique.",
  },
  {
    icon: <FaLeaf className="w-6 h-6" />,
    title: "Sciences Naturelles",
    description: "Biologie, géologie et éducation à l'environnement.",
  },
  {
    icon: <FaGlobe className="w-6 h-6" />,
    title: "Histoire-Géographie",
    description: "Étude des civilisations, géopolitique et éducation civique.",
  },
  {
    icon: <FaLanguage className="w-6 h-6" />,
    title: "Langues Vivantes",
    description:
      "Anglais, espagnol et arabe pour une ouverture internationale.",
  },
  {
    icon: <FaLaptop className="w-6 h-6" />,
    title: "Informatique",
    description: "Programmation, bureautique et culture numérique.",
  },
  {
    icon: <FaMusic className="w-6 h-6" />,
    title: "Arts & Culture",
    description: "Éducation artistique et découverte du patrimoine culturel.",
  },
];

const classLevels = [
  {
    name: "6ème",
    age: "11-12 ans",
    focus: "Adaptation au collège et méthodes de travail",
    image: "/images/programs/middle-6eme.jpg",
    highlights: ["Méthodologie", "Autonomie", "Découverte"],
  },
  {
    name: "5ème-4ème",
    age: "12-14 ans",
    focus: "Approfondissement et spécialisation progressive",
    image: "/images/programs/middle-5eme4eme.jpg",
    highlights: ["Approfondissement", "Projets", "Orientation"],
  },
  {
    name: "3ème",
    age: "14-15 ans",
    focus: "Préparation intensive au BFEM",
    image: "/images/programs/middle-3eme.jpg",
    highlights: ["BFEM", "Orientation", "Excellence"],
  },
];

const achievements = [
  {
    icon: <FaTrophy className="w-8 h-8" />,
    title: "95% de Réussite",
    description: "Au BFEM",
  },
  {
    icon: <FaAward className="w-8 h-8" />,
    title: "Mentions TB",
    description: "60% de nos élèves",
  },
  {
    icon: <FaLightbulb className="w-8 h-8" />,
    title: "Projets Innovants",
    description: "Concours nationaux",
  },
];

const extracurricular = [
  {
    category: "Clubs Scientifiques",
    activities: [
      "Club Robotique",
      "Olympiades de Maths",
      "Sciences Expérimentales",
    ],
  },
  {
    category: "Arts & Culture",
    activities: ["Théâtre", "Chorale", "Arts Plastiques"],
  },
  {
    category: "Sports",
    activities: ["Football", "Basketball", "Athlétisme"],
  },
  {
    category: "Langues",
    activities: ["Club Anglais", "Débats", "Échanges Culturels"],
  },
];

const weeklySchedule = [
  { subject: "Français", hours: "5h" },
  { subject: "Mathématiques", hours: "4h" },
  { subject: "Sciences Physiques", hours: "3h" },
  { subject: "Sciences Naturelles", hours: "2h" },
  { subject: "Histoire-Géographie", hours: "3h" },
  { subject: "Anglais", hours: "3h" },
  { subject: "Arabe", hours: "2h" },
  { subject: "Arts & Sport", hours: "4h" },
];

const MiddleschoolPage: React.FC = () => {
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
                  Programmes / Collège
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">Collège</span>
                  <span className="block text-primary">11-15 ans</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Excellence académique et préparation au BFEM dans un
                    environnement stimulant qui développe l&apos;esprit
                    critique, l&apos;autonomie et l&apos;ambition de nos futurs
                    leaders.
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span>8h00 - 17h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4" />
                      <span>25 élèves/classe</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Préparation au BFEM
                    </h3>
                    <p className="text-gray-700">
                      Programme intensif de préparation au Brevet de Fin
                      d&apos;Études Moyennes avec un accompagnement personnalisé
                      pour chaque élève.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src="/images/programs/middleschool-hero.jpg"
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
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-accent mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-gray-200">{achievement.description}</p>
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
              <h2 className="section-title-creative">Nos Classes</h2>
              <p className="section-description-creative">
                Un parcours structuré vers l&apos;excellence et la réussite au
                BFEM
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
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold">
                    {level.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 color-black">
                    {level.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{level.focus}</p>
                  <div className="space-y-2">
                    {level.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        <span>{highlight}</span>
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
              <h2 className="section-title-creative">Nos Matières</h2>
              <p className="section-description-creative">
                Un curriculum complet préparant aux études supérieures
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
                <h3 className="text-lg font-semibold mb-3 color-black">
                  {subject.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
              <h2 className="section-title-creative">
                Activités Extra-scolaires
              </h2>
              <p className="section-description-creative">
                Développement des talents et passions de chaque élève
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {extracurricular.map((category, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold mb-4 color-black text-center">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.activities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                      <span>{activity}</span>
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
              <h2 className="section-title-creative">Emploi du Temps</h2>
              <p className="section-description-creative">
                Répartition hebdomadaire des matières (26h de cours/semaine)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {weeklySchedule.slice(0, 4).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white"
                >
                  <div className="text-gray-700 font-medium">
                    {item.subject}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold">
                      {item.hours}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {weeklySchedule.slice(4).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white"
                >
                  <div className="text-gray-700 font-medium">
                    {item.subject}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent"></div>
                    <div className="text-primary font-semibold">
                      {item.hours}
                    </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Préparez Votre Enfant à l&apos;Excellence
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Offrez à votre adolescent une formation collégiale
              d&apos;exception qui le préparera aux défis du lycée et aux études
              supérieures.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className="btn btn-accent">
                Planifier une Visite
              </a>
              <a
                href="/inscription"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                Dossier d&apos;Inscription
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MiddleschoolPage;