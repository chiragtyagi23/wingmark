import { Link } from 'react-router-dom';
import StatsBar from './StatsBar';

function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-grid-overlay" />
      <div className="hero-content">
        <div className="hero-badge">
          <span>Navi Mumbai · Mumbai 3.0 · Est. 2026</span>
        </div>
        <h1 className="hero-h1">
          <em>Trust &amp; Value</em>
          <br />
          <strong>in Every Acre.</strong>
        </h1>
        <p className="hero-tagline">Premium Land Acquisition · Infrastructure Growth · High-Return Investments</p>
        <div className="hero-btns">
          <Link to="/land" className="btn-gold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Explore Land Opportunities
          </Link>
          <a href="#investor" className="btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            Investor / NRI Section
          </a>
          <a href="#contact" className="btn-ghost">
            Contact Us
          </a>
        </div>
      </div>
      <div className="hero-stats">
        <StatsBar />
      </div>
    </section>
  );
}

export default Hero;
