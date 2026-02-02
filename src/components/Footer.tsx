import React from "react";
import { useLocation } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import NewsletterSignup from "./NewsletterSignup";
import { useSiteSettings, getSocialLinks } from "../hooks/useSiteSettings";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const { settings, isLoading } = useSiteSettings();
  
  // Hide footer on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // Get social links from settings
  const socials = settings ? getSocialLinks(settings) : [];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo" style={{ marginBottom: "1.5rem" }}>
              {/* Logo */}
              <a href="/" className="flex items-center gap-3">
                <OptimizedImage
                  src="/images/logo.svg"
                  alt="Les Hirondelles"
                  width={30}
                  height={40}
                  className="w-[30px] h-[40px]"
                  wrapperClassName="w-[30px] h-[40px]"
                  loading="eager"
                  priority
                />
                <span className="font-semibold text-lg">Les Hirondelles</span>
              </a>
            </div>
            <p style={{ color: "var(--gray-400)", lineHeight: "1.6" }}>
              Excellence éducative depuis plus de 20 ans.
            </p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="/histoire">À propos</a>
              </li>
              <li>
                <a href="#programs">Programmes</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/inscription">Inscription</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-links">
              {isLoading ? (
                <li>Chargement...</li>
              ) : settings ? (
                <>
                  {(settings.city || settings.country) && (
                    <li>{[settings.city, settings.country].filter(Boolean).join(", ")}</li>
                  )}
                  {settings.phoneMain && (
                    <li>
                      <a href={`tel:${settings.phoneMain.replace(/\s/g, "")}`}>
                        {settings.phoneMain}
                      </a>
                    </li>
                  )}
                  {settings.emailGeneral && (
                    <li>
                      <a href={`mailto:${settings.emailGeneral}`}>
                        {settings.emailGeneral}
                      </a>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>Dakar, Sénégal</li>
                  <li>+221 33 XXX XX XX</li>
                  <li>contact@leshirondelles.sn</li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <ul className="footer-links">
              {isLoading ? (
                <li>Chargement...</li>
              ) : socials.length > 0 ? (
                socials.map((social, index) => (
                  <li key={social.name + index}>
                    <a href={social.url || "#"} target="_blank" rel="noopener noreferrer">
                      {social.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#">Facebook</a></li>
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">LinkedIn</a></li>
                </>
              )}
              {settings?.whatsAppUrl && (
                <li>
                  <a href={settings.whatsAppUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Newsletter</h4>
            <p style={{ color: "var(--gray-400)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Recevez nos actualités
            </p>
            <NewsletterSignup variant="footer" source="footer" />
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {year} Institution Les Hirondelles. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
