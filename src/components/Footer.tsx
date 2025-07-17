import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo" style={{ marginBottom: "1.5rem" }}>
              {/* Logo */}
              <a href="/" className="flex items-center gap-3">
                <img
                  src="/images/logo.svg"
                  alt="Les Hirondelles"
                  width={30}
                  height={40}
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
                <a href="/about">À propos</a>
              </li>
              <li>
                <a href="/programs">Programmes</a>
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
              <li>Dakar, Sénégal</li>
              <li>+221 33 XXX XX XX</li>
              <li>contact@leshirondelles.sn</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
              <li>
                <a href="https://wa.me/22177XXXXXX">WhatsApp</a>
              </li>
            </ul>
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
