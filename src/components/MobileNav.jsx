import { Link, useLocation, useNavigate } from 'react-router-dom';

function MobileNav({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHash = (event, hash) => {
    event.preventDefault();
    onClose();
    const to = { pathname: '/', hash };
    if (location.pathname === '/') {
      navigate(to, { replace: true });
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
  };

  const linkClass =
    'font-serif text-[32px] font-normal text-white no-underline transition-colors duration-300 hover:text-gold';

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-7 bg-[rgba(14,56,94,0.98)] transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      id="mobileNav"
    >
      <button
        type="button"
        className="absolute right-[5vw] top-6 cursor-pointer border-none bg-transparent text-[32px] text-silver"
        onClick={onClose}
      >
        ✕
      </button>
      <a href="/#about" className={linkClass} onClick={(e) => goToHash(e, 'about')}>
        About
      </a>
      <a href="/#services" className={linkClass} onClick={(e) => goToHash(e, 'services')}>
        Services
      </a>
      <Link to="/land" className={linkClass} onClick={onClose}>
        Land
      </Link>
      <Link to="/plot" className={linkClass} onClick={onClose}>
        Plots
      </Link>
      <a href="/#investor" className={linkClass} onClick={(e) => goToHash(e, 'investor')}>
        Investors / NRI
      </a>
      <a href="/#team" className={linkClass} onClick={(e) => goToHash(e, 'team')}>
        Our Team
      </a>
      <a href="/#contact" className={linkClass} onClick={(e) => goToHash(e, 'contact')}>
        Contact
      </a>
    </div>
  );
}

export default MobileNav;
