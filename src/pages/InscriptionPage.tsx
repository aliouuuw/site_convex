import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const InscriptionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Inscription - Rejoignez Les Hirondelles"
        description="Inscrivez votre enfant à Les Hirondelles, école privée d'excellence à Dakar. Découvrez notre processus d'inscription simple et transparent pour l'année scolaire 2024-2025."
        keywords="inscription, école privée, Dakar, processus, année scolaire, Les Hirondelles, admission"
        url="/inscription"
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
                  Inscription
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">Rejoignez</span>
                  <span className="block text-primary">Les Hirondelles</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Offrez à votre enfant une éducation d'excellence dans un environnement bienveillant et stimulant. Découvrez notre processus d'inscription simple et transparent.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-primary leading-none">📚</div>
                  <div>
                    <p className="text-lg text-gray-700 mb-3">
                      Les inscriptions pour l'année scolaire 2024-2025 sont ouvertes !
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      — Places limitées
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src="/images/inscription/students-learning.jpg"
                    alt="Élèves en classe"
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

      {/* Process Steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Processus d'Inscription</h2>
              <p className="section-description-creative">
                Un processus simple en quelques étapes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Prise de Contact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Contactez-nous par téléphone ou visitez notre établissement pour une première rencontre.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Dossier d'Inscription
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Remplissez le dossier d'inscription avec les documents requis.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Entretien
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rencontre avec l'équipe pédagogique pour faire connaissance avec votre enfant.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                ✓
              </div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Confirmation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Validation de l'inscription et intégration dans notre communauté éducative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Documents Requis</h2>
              <p className="section-description-creative">
                Liste des pièces à fournir pour l'inscription
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8">
              <h3 className="text-2xl font-semibold mb-6 color-black">
                Documents Généraux
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Formulaire d'inscription dûment rempli</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Copie de l'acte de naissance de l'enfant</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Copie des cartes d'identité des parents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Certificat médical récent</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Carnet de vaccination à jour</span>
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-semibold mb-6 color-black">
                Documents Scolaires
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Bulletins scolaires des 2 dernières années</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Certificat de scolarité (si nécessaire)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Lettre de recommandation (optionnel)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Photos d'identité (4 exemplaires)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tuition Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Frais de Scolarité</h2>
              <p className="section-description-creative">
                Informations sur les coûts et modalités de paiement
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center border-2 border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Préscolaire
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                125.000 FCFA
              </div>
              <p className="text-gray-600 mb-6">par trimestre</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Activités d'éveil</li>
                <li>Repas inclus</li>
                <li>Matériel pédagogique</li>
              </ul>
            </div>

            <div className="card p-8 text-center border-2 border-primary">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Primaire
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                150.000 FCFA
              </div>
              <p className="text-gray-600 mb-6">par trimestre</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Programme complet</li>
                <li>Activités sportives</li>
                <li>Suivi personnalisé</li>
              </ul>
            </div>

            <div className="card p-8 text-center border-2 border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                Collège
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                175.000 FCFA
              </div>
              <p className="text-gray-600 mb-6">par trimestre</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Préparation aux examens</li>
                <li>Laboratoires</li>
                <li>Orientation scolaire</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              * Les frais d'inscription (50.000 FCFA) sont à régler lors de la première inscription
            </p>
            <p className="text-sm text-gray-500">
              Possibilité de paiement échelonné - Nous contacter pour plus d'informations
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Commencer l'Aventure ?
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Contactez-nous dès aujourd'hui pour planifier une visite et découvrir comment nous pouvons accompagner votre enfant vers la réussite.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="btn btn-accent">
                Nous Contacter
              </Link>
              <a
                href="tel:+221123456789"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                Appeler Maintenant
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscriptionPage;
