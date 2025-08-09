import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import DisplayText from '../components/DisplayText';
import DisplayImage from '../components/DisplayImage';
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
                  <DisplayText id="inscription.title" page="inscription" as="span" className="block text-gray-900">
                    Rejoignez
                  </DisplayText>
                  <span className="block text-primary">Les Hirondelles</span>
                </h1>

                <div className="max-w-xl">
                  <DisplayText 
                    id="inscription.description" 
                    page="inscription" 
                    as="p" 
                    className="text-xl text-gray-600 leading-relaxed mb-6"
                  >
                    Offrez à votre enfant une éducation d'excellence dans un environnement bienveillant et stimulant. Découvrez notre processus d'inscription simple et transparent.
                  </DisplayText>
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
                  <DisplayImage
                    id="inscription.hero.image"
                    page="inscription"
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
              <DisplayText 
                id="inscription.process.title" 
                page="inscription" 
                as="h2" 
                className="section-title-creative"
              >
                Processus d'Inscription
              </DisplayText>
              <DisplayText 
                id="inscription.process.description" 
                page="inscription" 
                as="p" 
                className="section-description-creative"
              >
                Un processus simple en quelques étapes
              </DisplayText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <DisplayText 
                id="inscription.steps.step1.title" 
                page="inscription" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Prise de Contact
              </DisplayText>
              <DisplayText 
                id="inscription.steps.step1.description" 
                page="inscription" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Contactez-nous par téléphone ou visitez notre établissement pour une première rencontre.
              </DisplayText>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <DisplayText 
                id="inscription.steps.step2.title" 
                page="inscription" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Dossier de Candidature
              </DisplayText>
              <DisplayText 
                id="inscription.steps.step2.description" 
                page="inscription" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Remplissez le formulaire d'inscription et fournissez les documents requis.
              </DisplayText>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <DisplayText 
                id="inscription.steps.step3.title" 
                page="inscription" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Entretien & Évaluation
              </DisplayText>
              <DisplayText 
                id="inscription.steps.step3.description" 
                page="inscription" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Rencontre avec la direction et évaluation du niveau de l'élève.
              </DisplayText>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <DisplayText 
                id="inscription.steps.step4.title" 
                page="inscription" 
                as="h3" 
                className="text-xl font-semibold mb-4 color-black"
              >
                Confirmation & Inscription
              </DisplayText>
              <DisplayText 
                id="inscription.steps.step4.description" 
                page="inscription" 
                as="p" 
                className="text-gray-600 leading-relaxed"
              >
                Validation de l'inscription et paiement des frais de scolarité.
              </DisplayText>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <DisplayText 
                id="inscription.requirements.title" 
                page="inscription" 
                as="h2" 
                className="section-title-creative"
              >
                Documents Requis
              </DisplayText>
              <DisplayText 
                id="inscription.requirements.description" 
                page="inscription" 
                as="p" 
                className="section-description-creative"
              >
                Liste des documents nécessaires pour l'inscription
              </DisplayText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Documents d'Identité
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Extrait d'acte de naissance</li>
                <li>• Carte d'identité nationale</li>
                <li>• Photos d'identité (4 exemplaires)</li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Documents Scolaires
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Certificat de scolarité</li>
                <li>• Bulletins de notes</li>
                <li>• Certificat de fin d'année</li>
              </ul>
            </div>

            <div className="card p-8">
              <div className="text-4xl mb-4">💉</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Documents Médicaux
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Carnet de vaccination</li>
                <li>• Certificat médical</li>
                <li>• Groupe sanguin</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Rejoindre Les Hirondelles ?
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Contactez-nous dès aujourd'hui pour commencer le processus d'inscription de votre enfant.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/contact" className="btn btn-accent">
                Nous Contacter
              </Link>
              <Link
                to="/contact"
                className="font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                Planifier une visite
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscriptionPage;
