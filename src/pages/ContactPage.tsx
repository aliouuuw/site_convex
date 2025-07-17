import React from 'react';

const ContactPage: React.FC = () => {
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
                  Contact
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">Contactez-nous</span>
                </h1>

                <div className="max-w-xl">
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    Nous sommes là pour répondre à toutes vos questions concernant l'éducation de votre enfant. N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border-l-4 border-accent">
                <div className="flex items-start gap-4">
                  <div className="text-2xl text-accent mt-1">🕒</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Horaires d'ouverture
                    </h3>
                    <div className="space-y-1 text-gray-700">
                      <div className="flex justify-between">
                        <span>Lundi - Vendredi:</span>
                        <span className="font-medium">8h00 - 17h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Samedi:</span>
                        <span className="font-medium">8h00 - 12h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimanche:</span>
                        <span className="font-medium">Fermé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative">
                <div className="relative h-[500px] w-full">
                  <img
                    src="/images/contact/contact-hero.jpg"
                    alt="Contact Les Hirondelles"
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

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Nos Coordonnées</h2>
              <p className="section-description-creative">
                Plusieurs moyens de nous joindre pour votre commodité
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-primary mb-6 flex justify-center text-2xl">📞</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Téléphone
              </h3>
              <div className="space-y-2 mb-4 text-center">
                <p className="text-gray-700 font-medium">+221 33 XXX XX XX</p>
                <p className="text-gray-700 font-medium">+221 77 XXX XX XX</p>
              </div>
              <p className="text-sm text-gray-500">Lundi - Vendredi: 8h00 - 17h00</p>
            </div>

            <div className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-primary mb-6 flex justify-center text-2xl">✉️</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Email
              </h3>
              <div className="space-y-2 mb-4 text-center">
                <p className="text-gray-700 font-medium">contact@leshirondelles.sn</p>
                <p className="text-gray-700 font-medium">inscription@leshirondelles.sn</p>
              </div>
              <p className="text-sm text-gray-500">Réponse sous 24h</p>
            </div>

            <div className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-primary mb-6 flex justify-center text-2xl">📍</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                Adresse
              </h3>
              <div className="space-y-2 mb-4 text-center">
                <p className="text-gray-700 font-medium">Avenue Cheikh Anta Diop</p>
                <p className="text-gray-700 font-medium">Dakar, Sénégal</p>
              </div>
              <p className="text-sm text-gray-500">Face à l'Université Cheikh Anta Diop</p>
            </div>

            <div className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-primary mb-6 flex justify-center text-2xl">💬</div>
              <h3 className="text-xl font-semibold mb-4 color-black">
                WhatsApp
              </h3>
              <div className="space-y-2 mb-4 text-center">
                <p className="text-gray-700 font-medium">+221 77 XXX XX XX</p>
              </div>
              <p className="text-sm text-gray-500">Disponible 24h/7j</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 color-black">
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600">
                  Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                      placeholder="+221 XX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de l'enfant
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Nom de votre enfant"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="admission">Demande d'admission</option>
                    <option value="information">Demande d'information</option>
                    <option value="visite">Planifier une visite</option>
                    <option value="rdv">Prendre rendez-vous</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  ✈️ Envoyer le message
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div>
                <h3 className="text-2xl font-bold mb-4 color-black">
                  Notre Localisation
                </h3>
                <div className="bg-gray-300 h-64 flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p>Carte interactive</p>
                    <p className="text-sm">Avenue Cheikh Anta Diop, Dakar</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Face à l'Université Cheikh Anta Diop, près de la station Total
                </p>
              </div>

              {/* Department Contacts */}
              <div>
                <h3 className="text-2xl font-bold mb-6 color-black">
                  Contacts par Service
                </h3>
                <div className="space-y-4">
                  <div className="card p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Direction Générale</h4>
                    <p className="text-gray-700 mb-1">Mme. Aïssatou Diop</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>direction@leshirondelles.sn</p>
                      <p>+221 33 XXX XX XX</p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Admission</h4>
                    <p className="text-gray-700 mb-1">Service des Inscriptions</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>inscription@leshirondelles.sn</p>
                      <p>+221 77 XXX XX XX</p>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Vie Scolaire</h4>
                    <p className="text-gray-700 mb-1">Mme. Fatoumata Sarr</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>viescolaire@leshirondelles.sn</p>
                      <p>+221 77 XXX XX XX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="section-header-creative mb-16">
            <div>
              <h2 className="section-title-creative">Suivez-nous</h2>
              <p className="section-description-creative">
                Restez connectés avec notre communauté scolaire
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="#"
              className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="text-primary mb-6 flex justify-center group-hover:text-accent transition-colors text-3xl">
                📘
              </div>
              <h3 className="text-xl font-semibold mb-2 color-black">
                Facebook
              </h3>
              <p className="text-gray-600">@LesHirondellesSN</p>
            </a>

            <a
              href="#"
              className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="text-primary mb-6 flex justify-center group-hover:text-accent transition-colors text-3xl">
                📷
              </div>
              <h3 className="text-xl font-semibold mb-2 color-black">
                Instagram
              </h3>
              <p className="text-gray-600">@leshirondelles_sn</p>
            </a>

            <a
              href="#"
              className="card p-8 text-center transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="text-primary mb-6 flex justify-center group-hover:text-accent transition-colors text-3xl">
                💼
              </div>
              <h3 className="text-xl font-semibold mb-2 color-black">
                LinkedIn
              </h3>
              <p className="text-gray-600">Institution Les Hirondelles</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Rejoindre Notre Famille ?
            </h2>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Contactez-nous dès aujourd'hui pour découvrir comment Les Hirondelles peut accompagner votre enfant vers l'excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="tel:+22133XXXXXX"
                className="btn btn-accent flex items-center gap-2"
              >
                📞 Appeler Maintenant
              </a>
              <a
                href="https://wa.me/22177XXXXXX"
                className="flex items-center gap-2 font-family-poppins font-medium text-[0.875rem] px-[2rem] py-[1rem] tracking-[0.025em] text-white border-1 border-white hover:underline transition-all duration-300 translate-y-0 hover:translate-y-[-1px]"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
