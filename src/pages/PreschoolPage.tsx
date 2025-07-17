import React from "react";
import {
  FaPalette,
  FaRunning,
  FaUsers,
  FaMusic,
  FaLeaf,
  FaHeart,
  FaClock,
  FaGraduationCap,
  FaChild,
} from "react-icons/fa";

const programFeatures = [
  {
    icon: <FaPalette className="w-6 h-6" />,
    title: "Éveil Artistique",
    description:
      "Développement de la créativité à travers l'art, le dessin et les activités manuelles.",
  },
  {
    icon: <FaRunning className="w-6 h-6" />,
    title: "Développement Moteur",
    description:
      "Activités physiques adaptées pour développer la motricité fine et globale.",
  },
  {
    icon: <FaUsers className="w-6 h-6" />,
    title: "Socialisation",
    description:
      "Apprentissage du vivre ensemble et développement des compétences sociales.",
  },
  {
    icon: <FaMusic className="w-6 h-6" />,
    title: "Éveil Musical",
    description:
      "Initiation à la musique et au rythme pour stimuler l'expression artistique.",
  },
  {
    icon: <FaLeaf className="w-6 h-6" />,
    title: "Découverte Nature",
    description:
      "Exploration de l'environnement et sensibilisation à la nature.",
  },
  {
    icon: <FaHeart className="w-6 h-6" />,
    title: "Bien-être Émotionnel",
    description:
      "Accompagnement bienveillant pour l'épanouissement émotionnel.",
  },
];

const dailySchedule = [
  { time: "8h00 - 8h30", activity: "Accueil et jeux libres" },
  { time: "8h30 - 9h30", activity: "Activités d'éveil et apprentissage" },
  { time: "9h30 - 10h00", activity: "Récréation et collation" },
  { time: "10h00 - 11h00", activity: "Ateliers créatifs" },
  { time: "11h00 - 11h30", activity: "Activités motrices" },
  { time: "11h30 - 12h00", activity: "Préparation au déjeuner" },
  { time: "12h00 - 13h30", activity: "Déjeuner et repos" },
  { time: "13h30 - 14h30", activity: "Activités calmes et lecture" },
  { time: "14h30 - 15h30", activity: "Jeux éducatifs" },
  { time: "15h30 - 16h00", activity: "Goûter et préparation sortie" },
];

const ageGroups = [
  {
    name: "Petite Section",
    age: "3-4 ans",
    focus: "Adaptation et premiers apprentissages",
    image: "/images/programs/preschool-small.jpg",
  },
  {
    name: "Moyenne Section",
    age: "4-5 ans",
    focus: "Développement de l'autonomie",
    image: "/images/programs/preschool-medium.jpg",
  },
  {
    name: "Grande Section",
    age: "5-6 ans",
    focus: "Préparation à l'primaire",
    image: "/images/programs/preschool-large.jpg",
  },
];

const PreschoolPage: React.FC = () => {
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
                  Programmes / Préscolaire
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">Préscolaire</span>
                  <span className="block text-primary">3-5 ans</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Un environnement bienveillant et stimulant où chaque enfant
                    développe sa personnalité, sa créativité et ses premiers
                    apprentissages dans la joie et la sécurité.
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span>8h00 - 16h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChild className="w-4 h-4" />
                      <span>15 élèves/classe</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Notre Approche Pédagogique
                    </h3>
                    <p className="text-gray-700">
                      Basée sur le jeu et l&apos;exploration, notre pédagogie
                      respecte le rythme de chaque enfant tout en favorisant son
                      épanouissement global.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
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
              <h2 className="section-title-creative">Nos Classes</h2>
              <p className="section-description-creative">
                Trois niveaux adaptés au développement de chaque tranche
                d&apos;âge
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <div
                key={index}
                className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold">
                    {group.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 color-black">
                    {group.name}
                  </h3>
                  <p className="text-gray-600">{group.focus}</p>
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
              <h2 className="section-title-creative">Nos Activités</h2>
              <p className="section-description-creative">
                Un programme riche et varié pour l&apos;épanouissement de votre
                enfant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programFeatures.map((feature, index) => (
              <div
                key={index}
                className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="text-accent mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 color-black">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
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
              <h2 className="section-title-creative">Une Journée Type</h2>
              <p className="section-description-creative">
                Un emploi du temps équilibré entre apprentissage, jeu et repos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {dailySchedule.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50"
                >
                  <div className="text-primary font-semibold text-sm min-w-[100px]">
                    {item.time}
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700">{item.activity}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {dailySchedule.slice(5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50"
                >
                  <div className="text-primary font-semibold text-sm min-w-[100px]">
                    {item.time}
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700">{item.activity}</div>
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
              Offrez le Meilleur Départ à Votre Enfant
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Rejoignez notre communauté préscolaire et donnez à votre enfant
              les fondations solides pour son avenir éducatif.
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

export default PreschoolPage;