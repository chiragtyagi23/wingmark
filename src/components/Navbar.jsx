import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import navLinks from '../api/nav-links.json';

function Navbar({ scrolled, activeSection, onMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (link) => {
    if (link.to) return location.pathname.startsWith(link.to);
    if (link.href) {
      const id = link.href.replace(/^\/?#/, '');
      return location.pathname === '/' && activeSection === id;
    }
    return false;
  };

  const handleHashClick = (event, href) => {
    const id = href.replace(/^\/?#/, '');
    event.preventDefault();
    const to = { pathname: '/', hash: id };
    if (location.pathname === '/') {
      navigate(to, { replace: true });
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
  };

  return (
    <nav
      id="mainNav"
      className={clsx(
        'fixed inset-x-0 top-0 z-[1000] flex items-center justify-between gap-6 border-b px-[4vw] backdrop-blur-[18px] transition-all duration-300 ease-out lg:gap-8',
        scrolled
          ? 'h-[110px] border-[rgba(247,198,27,0.45)] bg-[rgba(250,247,240,0.98)] shadow-[0_2px_10px_rgba(10,26,47,0.08)] max-[1180px]:h-[88px] max-[900px]:h-[74px] max-[600px]:h-[68px] max-[380px]:h-16'
          : 'h-[140px] border-[rgba(247,198,27,0.12)] bg-[rgba(248,244,236,0.94)] max-[1180px]:h-[104px] max-[900px]:h-[88px] max-[600px]:h-[82px] max-[380px]:h-[76px]'
      )}
    >
      <Link
        to="/"
        className="group flex shrink-0 items-center gap-3 no-underline lg:gap-3"
      >
        <img
          className={clsx(
            'block w-auto shrink-0 object-contain transition-all duration-300 [filter:drop-shadow(0_2px_4px_rgba(10,26,47,0.18))] group-hover:scale-[1.04]',
            scrolled
              ? 'h-[110px] max-[1180px]:h-20 max-[900px]:h-[60px] max-[600px]:h-[74px] max-[380px]:h-[88px]'
              : 'h-[200px] max-[1180px]:h-24 max-[900px]:h-[72px] max-[600px]:h-[66px] max-[380px]:h-[110px]'
          )}
          src="/wingsmark-logo.png"
          alt="The Wingsmark Infraa"
        />
        <div className="leading-tight">
          <div className="flex flex-col font-serif leading-[0.95] text-charcoal">
            <span className="text-[13px] font-medium italic tracking-[0.18em] text-[#6a543a] max-[900px]:text-[10px] max-[600px]:text-[9px] max-[380px]:text-xs">
              The
            </span>
            <span className="whitespace-nowrap text-[22px] font-semibold tracking-[0.04em] max-[1180px]:text-lg max-[900px]:text-lg max-[600px]:text-base max-[380px]:text-lg">
              Wingsmark Infraa
            </span>
          </div>
          <div className="mt-1 whitespace-nowrap text-[9.5px] font-medium uppercase tracking-[0.22em] text-[#b88a04] max-[1180px]:text-[10px] max-[900px]:text-[8px] max-[600px]:text-[7.5px] max-[380px]:text-[8px]">
            Land Infrastructure Growth
          </div>
        </div>
      </Link>

      <ul className="ml-auto flex max-[1180px]:hidden list-none items-center gap-6 shrink-0 lg:gap-6">
        {navLinks.map((link) => {
          const active = isActive(link);

          const linkClassName = clsx(
            'relative whitespace-nowrap transition-colors duration-300',
            !link.cta &&
              'py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-gold hover:after:w-full',
            !link.cta && active && 'text-gold after:w-full',
            link.cta &&
              'rounded-sm bg-gold px-[22px] py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-charcoal transition hover:-translate-y-px hover:bg-[#e0b015]'
          );

          if (link.to) {
            return (
              <li key={link.to}>
                <Link to={link.to} className={linkClassName}>
                  {link.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={linkClassName}
                onClick={(e) => handleHashClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="hidden max-[1180px]:flex flex-col gap-1.5 border-none bg-transparent p-1 cursor-pointer"
        onClick={onMobileOpen}
        aria-label="Menu"
      >
        <span className="block h-0.5 w-6 bg-charcoal transition-all" />
        <span className="block h-0.5 w-6 bg-charcoal transition-all" />
        <span className="block h-0.5 w-6 bg-charcoal transition-all" />
      </button>
    </nav>
  );
}

export default Navbar;
