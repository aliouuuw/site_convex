import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";

const Navigation = () => {
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isDesktopAboutOpen, setIsDesktopAboutOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check for edit mode from URL
  useEffect(() => {
    const checkEditMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setIsEditMode(urlParams.get('edit') === 'true');
    };

    checkEditMode();
    window.addEventListener('popstate', checkEditMode);
    return () => window.removeEventListener('popstate', checkEditMode);
  }, []);

  const programLinks = [
    { name: "Préscolaire", href: "/programs/preschool", age: "3-5 ans" },
    { name: "Primaire", href: "/programs/primary", age: "6-10 ans" },
    { name: "Collège", href: "/programs/middleschool", age: "11-15 ans" },
  ];

  const aboutLinks = [
    {
      name: "Notre Histoire",
      href: "/histoire",
      description: "Découvrez notre parcours et nos valeurs",
    },
    {
      name: "Notre Équipe",
      href: "/equipe",
      description: "Rencontrez nos enseignants",
    },
    {
      name: "Journal de l'école",
      href: "/journal",
      description: "Actualités et vie scolaire",
    },
    {
      name: "Galerie",
      href: "/gallery",
      description: "Aperçu de nos activités",
    },
    // {
    //   name: "Installations",
    //   href: "/facilities",
    //   description: "Nos infrastructures modernes",
    // },
    // {
    //   name: "Témoignages",
    //   href: "/testimonials",
    //   description: "Ce que disent nos parents",
    // },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              alt="Les Hirondelles"
              width={30}
              height={40}
            />
            <span className="font-semibold text-lg">Les Hirondelles</span>
            {isEditMode && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                ÉDITION
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/"
              className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
            >
              Accueil
            </NavLink>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDesktopAboutOpen(true)}
              onMouseLeave={() => setIsDesktopAboutOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2 focus:outline-none">
                À propos
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDesktopAboutOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* About Dropdown Content */}
              <div
                className={`absolute top-full left-0 mt-2 w-[300px] bg-white border border-gray-200 shadow-lg transition-all duration-200 ${
                  isDesktopAboutOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="px-4 py-2">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:bg-gray-50 focus:text-blue-600"
                    >
                      <div className="flex flex-col h-[45px]">
                        <span className="font-medium text-gray-900 group-hover:text-[#00538d]">
                          {link.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {link.description}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-[#00538d] transition-colors opacity-0 group-hover:opacity-100 group-focus:opacity-100"
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
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Dropdown for Programs */}
            <div
              className="relative"
              onMouseEnter={() => setIsDesktopDropdownOpen(true)}
              onMouseLeave={() => setIsDesktopDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors py-2 focus:outline-none">
                Programmes
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDesktopDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Content */}
              <div
                className={`absolute top-full left-0 mt-2 w-[300px] bg-white border border-gray-200 shadow-lg transition-all duration-200 ${
                  isDesktopDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="px-4 py-2">
                  {programLinks.map((program) => (
                    <Link
                      key={program.href}
                      to={program.href}
                      className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:bg-gray-50 focus:text-blue-600"
                    >
                      <div className="flex flex-col h-[45px]">
                        <span className="font-medium text-gray-900 group-hover:text-[#00538d]">
                          {program.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {program.age}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover:text-[#00538d] transition-colors opacity-0 group-hover:opacity-100 group-focus:opacity-100"
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
                  ))}
                </div>
              </div>
            </div>

            <NavLink
              to="/contact"
              className="text-gray-600 hover:text-gray-900 hover:underline transition-colors"
            >
              Contact
            </NavLink>
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link
              to="/inscription"
              className="hidden lg:inline-flex btn btn-primary"
            >
              Inscription
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </NavLink>

              {/* Mobile About Dropdown */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 pr-8"
                >
                  <div className="flex items-center gap-2">
                    <span>À propos</span>
                  </div>
                  <FaChevronUp
                    className={`w-4 h-4 transition-transform duration-200 text-[#00538d] ${
                      isAboutOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile About Dropdown Content */}
                {isAboutOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {aboutLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-slate-100/50 px-2 transition-colors"
                        onClick={() => {
                          setIsAboutOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <span className="block font-medium">
                              {link.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {link.description}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Programs Dropdown - Click Only */}
              <div className="px-4 py-2">
                <button
                  onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 pr-8"
                >
                  <div className="flex items-center gap-2">
                    <span>Programmes</span>
                  </div>
                  <FaChevronUp
                    className={`w-4 h-4 transition-transform duration-200 text-[#00538d] ${
                      isProgramsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile Dropdown Content - Click Only */}
                {isProgramsOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {programLinks.map((program) => (
                      <Link
                        key={program.href}
                        to={program.href}
                        className="block py-2 text-gray-600 hover:text-gray-900 hover:bg-slate-100/50 px-2 transition-colors"
                        onClick={() => {
                          setIsProgramsOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Individual program icons */}
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <span className="block font-medium">
                              {program.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {program.age}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </NavLink>

              <Link
                to="/inscription"
                className="mx-4 btn btn-primary text-center hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
