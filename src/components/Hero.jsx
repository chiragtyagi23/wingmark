import { useState } from 'react';
import { Link } from 'react-router-dom';

const HERO_BG_REMOTE =
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&q=80';
/** Local fallback if the remote hero image fails (network, referrer, or CDN). */
const HERO_BG_LOCAL = '/land-promo-1.png';

const btnGold =
  'relative inline-flex cursor-pointer items-center gap-2 overflow-hidden border-none bg-gold px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal no-underline transition-all duration-300 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))] before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:transition-transform before:duration-500 before:content-[\'\'] hover:-translate-y-0.5 hover:bg-[#e0b015] hover:shadow-[0_8px_30px_rgba(247,198,27,0.3)] hover:before:translate-x-full';

const btnOutline =
  'inline-flex cursor-pointer items-center gap-2 border border-white/40 bg-transparent px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold';

const btnGhost =
  'inline-flex cursor-pointer items-center gap-2 border border-white/25 bg-transparent px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-silver no-underline transition-all duration-300 hover:border-steel hover:bg-steel/30 hover:text-white';

function Hero() {
  const [heroBgSrc, setHeroBgSrc] = useState(HERO_BG_REMOTE);

  return (
    <section
      id="hero"
      className="relative flex min-h-[720px] h-screen flex-col items-center justify-center overflow-hidden pt-[200px] max-[1180px]:pt-[104px] max-[900px]:pt-[88px] max-[600px]:pt-[82px] max-[380px]:pt-[76px] max-[768px]:min-h-[640px]"
    >
      <img
        src={heroBgSrc}
        alt=""
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
        fetchPriority="high"
        onError={() => {
          setHeroBgSrc((current) => (current !== HERO_BG_LOCAL ? HERO_BG_LOCAL : current));
        }}
        className="anim-hero-zoom pointer-events-none absolute inset-0 z-0 block h-full w-full max-w-none min-h-full min-w-full object-cover object-center"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(160deg,rgba(14,56,94,0.85)_0%,rgba(10,26,47,0.78)_55%,rgba(247,198,27,0.15)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[length:80px_80px] bg-[linear-gradient(rgba(247,198,27,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(247,198,27,0.04)_1px,transparent_1px)]"
        aria-hidden
      />
      <div className="relative z-[3] w-full max-w-[880px] px-6 py-6 text-center">
        <div className="anim-fade-down-delay-2 mb-7 inline-flex items-center gap-2 rounded-sm border border-[rgba(247,198,27,0.35)] bg-[rgba(247,198,27,0.12)] px-[18px] py-[7px] text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
          <span className="anim-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
          <span>Navi Mumbai · Mumbai 3.0 · Est. 2026</span>
        </div>
        <h1 className="anim-fade-down-delay-4 mb-2 font-serif text-[clamp(42px,7vw,88px)] font-medium leading-[1.06] text-white">
          <em className="italic text-gold">Trust &amp; Value</em>
          <br />
        </h1>
        <h3 className="font-serif text-[clamp(24px,4vw,48px)] font-light leading-tight text-white">
          <strong className="block font-extralight">in Every Acre.</strong>
        </h3>
        <p className="anim-fade-down-delay-6 mx-auto my-5 mb-8 max-w-2xl text-[clamp(12px,1.5vw,15px)] font-normal uppercase tracking-[0.16em] text-silver max-[480px]:mb-5">
          Premium Land Acquisition · Infrastructure Growth · High-Return Investments
        </p>
        <div className="anim-fade-down-delay-8 flex flex-wrap justify-center gap-4">
          <Link to="/land" className={btnGold}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Explore Land Opportunities
          </Link>
          <a href="#investor" className={btnOutline}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            Investor / NRI Section
          </a>
          <a href="#contact" className={btnGhost}>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
