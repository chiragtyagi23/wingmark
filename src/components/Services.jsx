function Services() {
  return (
    <section id="services">
      <div className="services-inner">
        <div className="services-header reveal">
          <div className="section-badge">
            <span>What We Do</span>
          </div>
          <h2 className="section-h2">Core <em>Services</em></h2>
          <p className="section-p" style={{ margin: '0 auto', textAlign: 'center' }}>
            Comprehensive real estate solutions from acquisition through development, designed for maximum stakeholder value.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card reveal">
            <div className="service-num">01</div>
            <div className="service-icon">
              <svg viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <div className="service-cat">Core Service</div>
            <div className="service-title">Land Services</div>
            <ul className="service-list">
              <li>Strategic Land Acquisition across prime corridors</li>
              <li>Dispute Resolution with expert legal backing</li>
              <li>Complete Legal Clearance &amp; documentation</li>
            </ul>
          </div>
          <div className="service-card reveal reveal-delay-1">
            <div className="service-num">02</div>
            <div className="service-icon">
              <svg viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="service-cat">Core Service</div>
            <div className="service-title">Development</div>
            <ul className="service-list">
              <li>Bungalow &amp; Villa Plotting in Mumbai 3.0</li>
              <li>Redevelopment projects across Mumbai</li>
              <li>Infrastructure &amp; township planning</li>
            </ul>
          </div>
          <div className="service-card reveal reveal-delay-2">
            <div className="service-num">03</div>
            <div className="service-icon">
              <svg viewBox="0 0 24 24">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
            </div>
            <div className="service-cat">Core Service</div>
            <div className="service-title">New Projects</div>
            <ul className="service-list">
              <li>Tailored Sales Strategy for new developments</li>
              <li>Targeted Marketing &amp; brand positioning</li>
              <li>Wide Distribution &amp; investor networks</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
