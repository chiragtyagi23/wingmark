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
    'block w-full py-3.5 font-serif text-[clamp(26px,6.5vw,32px)] font-normal leading-tight text-white no-underline text-center transition-colors duration-300 hover:text-gold';

  const dividerClass = 'h-px w-full max-w-[min(72vw,280px)] shrink-0 bg-white/25';

  return (
    <div
      className={`fixed inset-0 z-[1050] flex flex-col bg-[rgba(14,56,94,0.98)] transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      id="mobileNav"
      aria-hidden={!open}
    >
      <button
        type="button"
        className="absolute right-[5vw] top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-white/20 bg-white/5 text-[28px] leading-none text-white transition-colors hover:border-gold hover:text-gold max-[1180px]:top-[calc(env(safe-area-inset-top,0px)+0.75rem)]"
        onClick={onClose}
        aria-label="Close menu"
      >
        ✕
      </button>

      <div
        className="mobile-nav-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] max-[900px]:pt-[calc(env(safe-area-inset-top,0px)+5.25rem)] max-[600px]:pt-[calc(env(safe-area-inset-top,0px)+5rem)] max-[380px]:pt-[calc(env(safe-area-inset-top,0px)+5.75rem)]"
      >
        <nav className="mx-auto flex w-full max-w-[min(88vw,360px)] flex-col items-center">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="flex w-full shrink-0 flex-col items-center">
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
    </div>
  );
}

export default MobileNav;
