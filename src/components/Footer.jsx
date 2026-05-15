import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHash = (event, hash) => {
    event.preventDefault();
    const to = { pathname: '/', hash };
    if (location.pathname === '/') {
      navigate(to, { replace: true });
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
  };

  const colLink =
    'text-[13px] text-white no-underline transition-all duration-300 hover:pl-1 hover:text-gold';

  return (
    <footer className="relative border-t-[3px] border-gold bg-gradient-to-b from-ink to-charcoal px-[5vw] pb-10 pt-20 text-white before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 border-b border-[rgba(97,98,99,0.15)] pb-16 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr] lg:gap-12">
        <div>
          <Link
            to="/"
            className="mb-0 flex min-w-0 max-w-full items-center gap-3 no-underline max-md:gap-2.5"
          >
            <div className="footer-brand-logo-wrap transition-[box-shadow] duration-300 hover:shadow-[0_4px_20px_rgba(247,198,27,0.3)]">
              <img
                src="/wingsmark-logo.png"
                alt="The Wingsmark Infraa"
                className="footer-brand-logo"
              />
            </div>
            <div className="min-w-0 flex flex-1 flex-col gap-0 leading-none">
              <span className="font-serif text-[14px] font-medium italic leading-none tracking-[0.18em] text-white max-md:text-[12px] max-md:tracking-[0.14em]">
                The
              </span>
              <span className="-mt-px font-serif text-[22px] font-semibold leading-[0.88] tracking-[0.04em] text-white max-md:text-lg">
                Wingsmark Infraa
              </span>
              <span className="mt-px text-[10.5px] font-bold uppercase leading-none tracking-[0.2em] text-gold max-md:text-[9px] max-md:tracking-[0.08em]">
                Land | Infrastructure | Growth
              </span>
            </div>
          </Link>
          <div className="my-4 h-0.5 w-12 bg-gradient-to-r from-gold to-transparent" />
          <p className="mb-4 max-w-[340px] leading-normal text-white">
            A Navi Mumbai based Real Estate LLP specializing in Land Acquisition, Development, and
            Investment. Building Trust, one Acre at a time.
          </p>
          <div className="text-[11px] uppercase tracking-[0.12em] text-white">
            LLP · Incorporated May 2026
          </div>
        </div>

        <div>
          <h5 className="mb-5 border-b border-[rgba(247,198,27,0.15)] pb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Company
          </h5>
          <ul className="flex list-none flex-col gap-3">
            <li>
              <a href="/#about" className={colLink} onClick={(e) => goToHash(e, 'about')}>
                About Us
              </a>
            </li>
            <li>
              <a href="/#services" className={colLink} onClick={(e) => goToHash(e, 'services')}>
                Our Services
              </a>
            </li>
            <li>
              <a href="/#team" className={colLink} onClick={(e) => goToHash(e, 'team')}>
                Leadership
              </a>
            </li>
            <li>
              <a href="/#locations" className={colLink} onClick={(e) => goToHash(e, 'locations')}>
                Locations
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-5 border-b border-[rgba(247,198,27,0.15)] pb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Investment
          </h5>
          <ul className="flex list-none flex-col gap-3">
            <li>
              <Link to="/land" className={colLink}>
                Land for Sale
              </Link>
            </li>
            <li>
              <Link to="/land" className={colLink}>
                Joint Ventures
              </Link>
            </li>
            <li>
              <a href="/#investor" className={colLink} onClick={(e) => goToHash(e, 'investor')}>
                NRI Investors
              </a>
            </li>
            <li>
              <a href="/#investor" className={colLink} onClick={(e) => goToHash(e, 'investor')}>
                Mumbai 3.0
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="mb-5 border-b border-[rgba(247,198,27,0.15)] pb-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Get in Touch
          </h5>
          <ul className="flex list-none flex-col gap-3.5">
            <li>
              <a
                href="tel:+919833791533"
                className="group flex items-start gap-2.5 text-[12.5px] leading-snug text-white no-underline transition-colors hover:text-gold"
              >
                <span className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(247,198,27,0.35)] bg-[rgba(247,198,27,0.08)] text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                  <Phone size={14} />
                </span>
                <span>
                  +91 98337 91533
                  <br />
                  +91 95525 10383
                </span>
              </a>
            </li>
            <li>
              <a
                href="mailto:info@thewingsmarkinfraa.com"
                className="group flex items-start gap-2.5 text-[12.5px] leading-snug text-white no-underline transition-colors hover:text-gold"
              >
                <span className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(247,198,27,0.35)] bg-[rgba(247,198,27,0.08)] text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                  <Mail size={14} />
                </span>
                <span>info@thewingsmarkinfraa.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.thewingsmarkinfraa.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-2.5 text-[12.5px] leading-snug text-white no-underline transition-colors hover:text-gold"
              >
                <span className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(247,198,27,0.35)] bg-[rgba(247,198,27,0.08)] text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                  <Globe size={14} />
                </span>
                <span>www.thewingsmarkinfraa.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=19.0188,73.019"
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-2.5 text-[12px] leading-snug text-white no-underline transition-colors hover:text-gold"
              >
                <span className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(247,198,27,0.35)] bg-[rgba(247,198,27,0.08)] text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                  <MapPin size={14} />
                </span>
                <span>
                  Shop 2, Sai Leela CHS,
                  <br />
                  New Sector 50, Seawoods,
                  <br />
                  Navi Mumbai - 400 706
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1280px] flex-col items-center gap-3 border-t border-[rgba(97,98,99,0.15)] pt-7 text-center">
        <p className="text-xs text-white">© 2026 The Wingsmark Infraa LLP. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a
            href="#"
            className="text-[11px] text-white no-underline transition-colors hover:text-gold"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-[11px] text-white no-underline transition-colors hover:text-gold"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Use
          </a>
          <a
            href="#"
            className="text-[11px] text-white no-underline transition-colors hover:text-gold"
            onClick={(e) => e.preventDefault()}
          >
            Disclaimer
          </a>
          <a
            href="#"
            className="text-[11px] text-white no-underline transition-colors hover:text-gold"
            onClick={(e) => e.preventDefault()}
          >
            RERA
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
