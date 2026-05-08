import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navLinks } from '../data';

function Navbar({ scrolled, activeSection, onMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (link) => {
    if (link.to) return location.pathname.startsWith(link.to);
    if (link.href) {
      const id = link.href.replace('/#', '');
      return location.pathname === '/' && activeSection === id;
    }
    return false;
  };

  const handleHashClick = (event, href) => {
    const id = href.replace('/#', '');
    if (location.pathname === '/') {
      event.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      event.preventDefault();
      navigate(`/#${id}`);
    }
  };

  return (
    <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-logo">
        <img className="logo-img" src="/wingsmark-logo.png" alt="The Wingsmark Infraa" />
        <div className="logo-text">
          <div className="brand">
            <span className="brand-the">The</span>
            <span className="brand-name">Wingsmark Infraa</span>
          </div>
          <div className="sub">Land Infrastructure Growth</div>
        </div>
      </Link>

      <ul className="nav-links">
        {navLinks.map((link) => {
          const active = isActive(link);
          const className = `${link.cta ? 'nav-cta' : ''} ${active ? 'active' : ''}`.trim();
          const style = { color: active && !link.cta ? 'var(--gold)' : '' };

          if (link.to) {
            return (
              <li key={link.to}>
                <Link to={link.to} className={className} style={style}>
                  {link.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={className}
                style={style}
                onClick={(e) => handleHashClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>

      <button className="hamburger" onClick={onMobileOpen} aria-label="Menu">
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}

export default Navbar;
