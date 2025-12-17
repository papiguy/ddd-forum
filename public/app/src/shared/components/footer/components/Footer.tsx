
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.sass';
import { branding, externalLinks } from '../../../../config/branding';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={branding.logo} alt={branding.name} className="footer-logo" />
        <span className="footer-copyright">© {currentYear} {branding.copyright}</span>
      </div>

      <div className="footer-mid">
        <div className="footer-column">
          <div className="footer-label">Play</div>
          <Link to="/" className="footer-link">Explore</Link>
        </div>

        <div className="footer-column">
          <div className="footer-label">Create</div>
          <a
            href={externalLinks.studio}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Studio
          </a>
        </div>

        <div className="footer-column">
          <div className="footer-label">Legal</div>
          <a
            href={externalLinks.terms}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          <a
            href={externalLinks.privacy}
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>

      <div className="footer-right">
        <a
          href={externalLinks.discord}
          className="footer-discord"
          target="_blank"
          rel="noopener noreferrer"
          title="Join our Discord"
        >
          Discord
        </a>
        <span className="footer-copyright">All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
