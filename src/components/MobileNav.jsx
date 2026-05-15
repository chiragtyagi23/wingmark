import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { type: 'hash', label: 'About', hash: 'about' },
  { type: 'hash', label: 'Services', hash: 'services' },
  { type: 'route', label: 'Land', to: '/land' },
  { type: 'route', label: 'Plots', to: '/plot' },
  { type: 'hash', label: 'Investors / NRI', hash: 'investor' },
  { type: 'hash', label: 'Our Team', hash: 'team' },
  { type: 'hash', label: 'Contact', hash: 'contact' },
];

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
    'block w-full py-5 font-serif text-[32px] font-normal text-white no-underline text-center transition-colors duration-300 hover:text-gold';

  const dividerClass = 'h-px w-full max-w-[min(72vw,280px)] shrink-0 bg-white/25';

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[rgba(14,56,94,0.98)] transition-opacity duration-300 ${
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
      <nav className="flex w-full max-w-[min(88vw,360px)] flex-col items-center px-6">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="flex w-full flex-col items-center">
            {item.type === 'route' ? (
              <Link to={item.to} className={linkClass} onClick={onClose}>
                {item.label}
              </Link>
            ) : (
              <a
                href={`/#${item.hash}`}
                className={linkClass}
                onClick={(e) => goToHash(e, item.hash)}
              >
                {item.label}
              </a>
            )}
            <div className={dividerClass} aria-hidden="true" />
          </div>
        ))}
      </nav>
    </div>
  );
}

export default MobileNav;
