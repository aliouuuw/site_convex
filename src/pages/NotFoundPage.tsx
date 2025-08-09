import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <SEO 
        title="Page Introuvable - Les Hirondelles"
        description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Veuillez vérifier l'URL ou retourner à l'accueil."
        url="/404"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          {/* 404 Number */}
          <div className="text-8xl md:text-9xl font-bold text-primary mb-8">
            404
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Page Introuvable
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              Veuillez vérifier l'URL ou retourner à l'accueil.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="btn btn-primary"
            >
              Retour à l'Accueil
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline"
            >
              Nous Contacter
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 text-gray-400">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-gray-300"></div>
              <span className="text-sm">Les Hirondelles</span>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
