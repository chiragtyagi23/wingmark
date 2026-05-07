function About() {
  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-visual reveal">
          <img
            className="about-img"
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
            alt="Infrastructure"
            loading="lazy"
          />
          <div className="about-img-frame" />
          <div className="about-accent">
            <div className="num">30+</div>
            <div className="lbl">Years of<br />Expertise</div>
          </div>
        </div>
        <div className="about-text reveal reveal-delay-2">
          <div className="section-badge">
            <span>Who We Are</span>
          </div>
          <h2 className="section-h2">Navi Mumbai's Premier <em>Land Enterprise</em></h2>
          <div className="gold-divider" />
          <p className="section-p">
            The Wingsmark Infraa is a Navi Mumbai based real estate enterprise specializing in land acquisition, land development &amp;
            offering sales &amp; marketing strategy for new developments. Our core strength is land liaisoning backed with the promise of high
            returns for our stakeholders.
          </p>
          <p className="section-p" style={{ marginTop: 16 }}>
            Founded by industry veterans, we focus on providing <strong style={{ color: 'var(--white)' }}>'Trust &amp; Value'</strong> through a very
            customer friendly approach, innovative ideas &amp; specialised services.
          </p>
          <div className="about-pillars">
            <div className="pillar">
              <div className="pillar-title">Land Acquisition</div>
              <div className="pillar-p">
                Strategic identification and acquisition of high-potential land parcels across Navi Mumbai and beyond.
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Development</div>
              <div className="pillar-p">Bungalow &amp; villa plotting, redevelopment, and infrastructure growth projects in Mumbai 3.0.</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Legal Clearance</div>
              <div className="pillar-p">
                Comprehensive dispute resolution and legal clearance services ensuring clean, secure transactions.
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Sales &amp; Marketing</div>
              <div className="pillar-p">Expert distribution and marketing strategies for new real estate developments.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
