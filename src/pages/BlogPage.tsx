import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const formatDate = (timestamp: number | string) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("fr-FR", options);
};

const BlogPage: React.FC = () => {
  const blogPosts = useQuery(api.blog.listPublishedBlogPosts, { limit: 50 });
  const featuredPosts = blogPosts?.filter((post: any) => post.featured) || [];
  const regularPosts = blogPosts?.filter((post: any) => !post.featured) || [];
  const featuredPost = featuredPosts[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-20">
      <main>
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
                    Journal
                  </span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="block text-gray-900">
                      Journal de l&apos;école
                    </span>
                  </h1>

                  <div className="max-w-xl">
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Actualités, événements et vie scolaire à Les Hirondelles.
                      Découvrez les moments forts de notre communauté éducative.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="relative h-[400px] w-full">
                    <img
                      src="/images/blog/blog-hero.jpg"
                      alt="Blog Les Hirondelles"
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

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="section-header-creative mb-16">
                <div>
                  <h2 className="section-title-creative">À la Une</h2>
                  <p className="section-description-creative">
                    Notre article vedette de la semaine
                  </p>
                </div>
              </div>

              <div className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featuredPost.coverImage || "/images/blog/default-blog.jpg"}
                      alt={featuredPost.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/images/blog/default-blog.jpg";
                      }}
                    />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {featuredPost.category || "Non classé"}
                      </span>
                      <time className="text-gray-500 text-sm">
                        {formatDate(featuredPost.publishedAt)}
                      </time>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt || 'Aucun résumé disponible'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        Par {featuredPost.author || "Auteur inconnu"}
                      </span>
                      <Link
                        to={`/journal/${featuredPost.slug}`}
                        className="btn btn-primary"
                      >
                        Lire la suite
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="section-header-creative mb-16">
              <div>
                <h2 className="section-title-creative">
                  Toutes les Actualités
                </h2>
                <p className="section-description-creative">
                  Restez informés de toute l&apos;actualité de notre
                  établissement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post: any) => (
                <article
                  key={post._id}
                  className="card overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className="card-image">
                    <img
                      src={post.coverImage || "/images/blog/default-blog.jpg"}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/blog/default-blog.jpg";
                      }}
                    />
                  </div>
                  <div className="card-content p-6">
                    <div className="card-meta mb-4">
                      <span className="card-tag">{post.category || "Non classé"}</span>
                      <time className="text-gray-500 text-sm">
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <h3 className="card-title mb-3">{post.title}</h3>
                    <p className="card-description mb-4">{post.excerpt || post.contentHtml?.substring(0, 150) + '...'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        Par {post.author || "Auteur inconnu"}
                      </span>
                      <Link
                        to={`/journal/${post.slug}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1"
                      >
                        Lire la suite
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center">
              <div className="bg-gray-50 p-12 border-l-4 border-accent">
                <div className="flex items-start gap-4 justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                      Restez informé
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Inscrivez-vous à notre newsletter pour recevoir les
                      dernières actualités de l&apos;école directement dans
                      votre boîte mail.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        S&apos;inscrire
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
