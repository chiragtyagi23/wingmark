import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHash = (event, hash) => {
    event.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${hash}`);
    }
  };

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <img className="logo-img" src="/wingsmark-logo.png" alt="The Wingsmark Infraa" />
            <div className="logo-text">
              <div className="brand">The Wingsmark Infraa</div>
              <div className="sub">Land · Infrastructure · Growth</div>
            </div>
          </Link>
          <p>
            A Navi Mumbai based real estate LLP specializing in land acquisition, development, and investment. Building trust, one acre at a time.
          </p>
          <div style={{ fontSize: 11, color: 'var(--dark-gray)', letterSpacing: '0.1em' }}>LLP · Incorporated May 2026</div>
        </div>

        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="/#about" onClick={(e) => goToHash(e, 'about')}>About Us</a></li>
            <li><a href="/#services" onClick={(e) => goToHash(e, 'services')}>Our Services</a></li>
            <li><a href="/#team" onClick={(e) => goToHash(e, 'team')}>Leadership</a></li>
            <li><a href="/#locations" onClick={(e) => goToHash(e, 'locations')}>Locations</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Investment</h5>
          <ul>
            <li><Link to="/land">Land for Sale</Link></li>
            <li><Link to="/land">Joint Ventures</Link></li>
            <li><a href="/#investor" onClick={(e) => goToHash(e, 'investor')}>NRI Investors</a></li>
            <li><a href="/#investor" onClick={(e) => goToHash(e, 'investor')}>Mumbai 3.0</a></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h5>Get in Touch</h5>
          <ul className="footer-contact-list">
            <li>
              <a href="tel:+918070888111" className="footer-contact-row">
                <span className="footer-contact-ico"><Phone size={14} /></span>
                <span>
                  +91 80708 88111
                  <br />
                  +91 99309 49066
                </span>
              </a>
            </li>
            <li>
              <a href="mailto:mehul@thewingsmarkinfraa.com" className="footer-contact-row">
                <span className="footer-contact-ico"><Mail size={14} /></span>
                <span>mehul@thewingsmarkinfraa.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.thewingsmarkinfraa.com"
                target="_blank"
                rel="noreferrer"
                className="footer-contact-row"
              >
                <span className="footer-contact-ico"><Globe size={14} /></span>
                <span>www.thewingsmarkinfraa.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=19.0188,73.019"
                target="_blank"
                rel="noreferrer"
                className="footer-contact-row footer-contact-row--addr"
              >
                <span className="footer-contact-ico"><MapPin size={14} /></span>
                <span>
                  Shop 2, Sai Leela CHS,
                  <br />
                  New Sector 50, Seawoods,
                  <br />
                  Navi Mumbai – 400 706
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 The Wingsmark Infraa LLP. All rights reserved. · <a href="#">Privacy Policy</a>
        </p>
        <div className="footer-legal">
          <a href="#">Terms of Use</a>
          <a href="#">Disclaimer</a>
          <a href="#">RERA</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
