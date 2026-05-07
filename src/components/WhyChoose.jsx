function WhyChoose() {
  return (
    <section id="why">
      <div className="why-inner">
        <div className="why-header reveal">
          <div className="section-badge">
            <span>Our Advantage</span>
          </div>
          <h2 className="section-h2">Why Choose <em>Wingsmark</em></h2>
        </div>
        <div className="why-grid">
          <div className="why-card reveal">
            <div className="why-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="why-title">Trusted &amp; Transparent</div>
            <div className="why-p">Every transaction backed by complete legal clarity and stakeholder-first values. Your investment is protected.</div>
          </div>
          <div className="why-card reveal reveal-delay-1">
            <div className="why-icon">
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div className="why-title">High-Return Focus</div>
            <div className="why-p">Land in Navi Mumbai and Mumbai 3.0 corridors offering some of India's strongest appreciation trajectories.</div>
          </div>
          <div className="why-card reveal reveal-delay-2">
            <div className="why-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <div className="why-title">Deep Local Expertise</div>
            <div className="why-p">Decades of on-ground knowledge across Navi Mumbai, Raigad, and the Mumbai Metropolitan Region.</div>
          </div>
          <div className="why-card reveal reveal-delay-3">
            <div className="why-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div className="why-title">Diverse Team, Unified Vision</div>
            <div className="why-p">Our team spans hospitality, legal, construction, finance, and real estate — 30+ years of combined excellence.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
