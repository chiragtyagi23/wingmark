import { LandPlot, Building2, TrendingUp } from 'lucide-react';

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
              <LandPlot size={28} strokeWidth={1.6} />
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
              <Building2 size={28} strokeWidth={1.6} />
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
              <TrendingUp size={28} strokeWidth={1.6} />
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
