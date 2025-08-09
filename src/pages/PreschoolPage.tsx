import React from "react";
import { FaPalette, FaRunning, FaUsers, FaMusic, FaLeaf, FaHeart, FaClock, FaGraduationCap, FaChild } from "react-icons/fa";
import { useContent } from '../components/ContentProvider';
import SEO from '../components/SEO';

const PreschoolPage: React.FC = () => {
  const { get, isLoading } = useContent();

  // Age groups and features from Convex (or fallback)
  const ageGroups = [0,1,2].map(i => ({
    name: get(`preschool.agegroup.${i}.name`, ["Petite Section","Moyenne Section","Grande Section"][i]),
    age: get(`preschool.agegroup.${i}.age`, ["3-4 ans","4-5 ans","5-6 ans"][i]),
    focus: get(`preschool.agegroup.${i}.focus`, ["Adaptation et premiers apprentissages","Développement de l'autonomie","Préparation à l'primaire"][i]),
    image: get(`preschool.agegroup.${i}.image`, ["/images/programs/preschool-small.jpg","/images/programs/preschool-medium.jpg","/images/programs/preschool-large.jpg"][i]),
  }));
  const programFeatures = [
    { icon: <FaPalette className="w-6 h-6" />, key: 'artistique' },
    { icon: <FaRunning className="w-6 h-6" />, key: 'moteur' },
    { icon: <FaUsers className="w-6 h-6" />, key: 'social' },
    { icon: <FaMusic className="w-6 h-6" />, key: 'musical' },
    { icon: <FaLeaf className="w-6 h-6" />, key: 'nature' },
    { icon: <FaHeart className="w-6 h-6" />, key: 'bienetre' },
  ].map((f, i) => ({
    ...f,
    title: get(`preschool.feature.${f.key}.title`, [
      "Éveil Artistique","Développement Moteur","Socialisation","Éveil Musical","Découverte Nature","Bien-être Émotionnel"
    ][i]),
    description: get(`preschool.feature.${f.key}.desc`, [
      "Développement de la créativité à travers l'art, le dessin et les activités manuelles.",
      "Activités physiques adaptées pour développer la motricité fine et globale.",
      "Apprentissage du vivre ensemble et développement des compétences sociales.",
      "Initiation à la musique et au rythme pour stimuler l'expression artistique.",
      "Exploration de l'environnement et sensibilisation à la nature.",
      "Accompagnement bienveillant pour l'épanouissement émotionnel."
    ][i]),
  }));
  const dailySchedule = Array.from({length: 8}).map((_,i) => ({
    time: get(`preschool.schedule.${i}.time`, [
      "8h00 - 8h30","8h30 - 9h30","9h30 - 10h00","10h00 - 11h00","11h00 - 11h30","11h30 - 12h00","12h00 - 13h30","13h30 - 14h30"
    ][i]||''),
    activity: get(`preschool.schedule.${i}.activity`, [
      "Accueil et jeux libres","Activités d'éveil et apprentissage","Récréation et collation","Ateliers créatifs","Activités motrices","Préparation au déjeuner","Déjeuner et repos","Activités calmes et lecture"
    ][i]||'')
  }));

  if (isLoading) return <div>Chargement...</div>;

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
                <span className="text-sm font-semibold text-primary tracking-wider uppercase" data-live-edit-id="preschool.hero.label">
                  {get('preschool.hero.label', 'Programmes / Préscolaire')}
                </span>
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight" data-live-edit-id="preschool.hero.title">
                  <span className="block text-gray-900">{get('preschool.hero.title', 'Préscolaire')}</span>
                  <span className="block text-primary">{get('preschool.hero.age', '3-5 ans')}</span>
                </h1>
                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6" data-live-edit-id="preschool.hero.desc">
                    {get('preschool.hero.desc', 'Un environnement bienveillant et stimulant où chaque enfant développe sa personnalité, sa créativité et ses premiers apprentissages dans la joie et la sécurité.')}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4" />
                      <span data-live-edit-id="preschool.hero.hours">{get('preschool.hero.hours', '8h00 - 16h00')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaChild className="w-4 h-4" />
                      <span data-live-edit-id="preschool.hero.classsize">{get('preschool.hero.classsize', '15 élèves/classe')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <FaGraduationCap className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2" data-live-edit-id="preschool.hero.pedago.title">{get('preschool.hero.pedago.title', 'Notre Approche Pédagogique')}</h3>
                    <p className="text-gray-700" data-live-edit-id="preschool.hero.pedago.desc">{get('preschool.hero.pedago.desc', 'Basée sur le jeu et l\'exploration, notre pédagogie respecte le rythme de chaque enfant tout en favorisant son épanouissement global.')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src={get('preschool.hero.image', '/images/programs/preschool-hero.jpg')}
                    alt="Préscolaire Les Hirondelles"
                    className="object-cover w-full h-full"
                    data-live-edit-id="preschool.hero.image"
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
              <h2 className="section-title-creative" data-live-edit-id="preschool.agegroups.title">{get('preschool.agegroups.title', 'Nos Classes')}</h2>
              <p className="section-description-creative" data-live-edit-id="preschool.agegroups.desc">{get('preschool.agegroups.desc', 'Trois niveaux adaptés au développement de chaque tranche d\'âge')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <div key={index} className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="object-cover w-full h-full"
                    data-live-edit-id={`preschool.agegroup.${index}.image`}
                  />
                  <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-sm font-semibold" data-live-edit-id={`preschool.agegroup.${index}.age`}>
                    {group.age}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 color-black" data-live-edit-id={`preschool.agegroup.${index}.name`}>{group.name}</h3>
                  <p className="text-gray-600" data-live-edit-id={`preschool.agegroup.${index}.focus`}>{group.focus}</p>
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
              <h2 className="section-title-creative" data-live-edit-id="preschool.features.title">{get('preschool.features.title', 'Nos Activités')}</h2>
              <p className="section-description-creative" data-live-edit-id="preschool.features.desc">{get('preschool.features.desc', 'Un programme riche et varié pour l\'épanouissement de votre enfant')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programFeatures.map((feature, index) => (
              <div key={index} className="card p-8 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-accent mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 color-black" data-live-edit-id={`preschool.feature.${feature.key}.title`}>{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed" data-live-edit-id={`preschool.feature.${feature.key}.desc`}>{feature.description}</p>
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
              <h2 className="section-title-creative" data-live-edit-id="preschool.schedule.title">{get('preschool.schedule.title', 'Une Journée Type')}</h2>
              <p className="section-description-creative" data-live-edit-id="preschool.schedule.desc">{get('preschool.schedule.desc', 'Un emploi du temps équilibré entre apprentissage, jeu et repos')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {dailySchedule.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50">
                  <div className="text-primary font-semibold text-sm min-w-[100px]" data-live-edit-id={`preschool.schedule.${index}.time`}>
                    {item.time}
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700" data-live-edit-id={`preschool.schedule.${index}.activity`}>{item.activity}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {dailySchedule.slice(4).map((item, index) => (
                <div key={index+4} className="flex items-center gap-4 p-4 bg-gray-50">
                  <div className="text-primary font-semibold text-sm min-w-[100px]" data-live-edit-id={`preschool.schedule.${index+4}.time`}>
                    {item.time}
                  </div>
                  <div className="w-2 h-2 bg-accent"></div>
                  <div className="text-gray-700" data-live-edit-id={`preschool.schedule.${index+4}.activity`}>{item.activity}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6" data-live-edit-id="preschool.cta.title">
              {get('preschool.cta.title', 'Offrez le Meilleur Départ à Votre Enfant')}
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed" data-live-edit-id="preschool.cta.desc">
              {get('preschool.cta.desc', 'Rejoignez notre communauté préscolaire et donnez à votre enfant les fondations solides pour son avenir éducatif.')}
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

export default PreschoolPage;