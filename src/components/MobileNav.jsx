import { Link, useLocation, useNavigate } from 'react-router-dom';

function MobileNav({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHash = (event, hash) => {
    event.preventDefault();
    onClose();
    if (location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `/#${hash}`);
    } else {
      navigate(`/#${hash}`);
    }
  };

  return (
    <div className={`mobile-nav ${open ? 'open' : ''}`} id="mobileNav">
      <button className="mobile-close" onClick={onClose}>
        ✕
      </button>
      <a href="/#about" onClick={(e) => goToHash(e, 'about')}>
        About
      </a>
      <a href="/#services" onClick={(e) => goToHash(e, 'services')}>
        Services
      </a>
      <Link to="/land" onClick={onClose}>
        Land
      </Link>
      <Link to="/plot" onClick={onClose}>
        Plots
      </Link>
      <a href="/#investor" onClick={(e) => goToHash(e, 'investor')}>
        Investors / NRI
      </a>
      <a href="/#team" onClick={(e) => goToHash(e, 'team')}>
        Our Team
      </a>
      <a href="/#contact" onClick={(e) => goToHash(e, 'contact')}>
        Contact
      </a>
    </div>
  );
}

export default MobileNav;
