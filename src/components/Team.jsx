function Team() {
  return (
    <section id="team">
      <div className="team-inner">
        <div className="team-header reveal">
          <div className="section-badge">
            <span>Our Leadership</span>
          </div>
          <h2 className="section-h2">The <em>Founders</em></h2>
          <div className="gold-divider center" />
          <p className="team-intro">
            The Wingsmark Infraa comprises individuals from diverse backgrounds — hospitality, facility &amp; payroll management, land liaisoning,
            legal clearance, real estate sales, marketing, distribution &amp; construction — with a cumulative experience of over 30 years.
          </p>
        </div>
        <div className="team-grid">
          <div className="team-card reveal">
            <div className="team-card-accent" />
            <div className="team-card-img">
              <div className="team-avatar team-avatar-photo">
                <img src="/mehhul-badani.png" alt="Mehhul Badani" />
              </div>
            </div>
            <div className="team-card-body">
              <div className="team-name">Mehhul Badani</div>
              <div className="team-roles">
                <span className="team-role">COO</span>
                <span className="team-role">Strategic Advisor</span>
                <span className="team-role">Designated Partner</span>
              </div>
              <div className="team-bio">
                A strategic leader with deep expertise in real estate operations, stakeholder management, and growth strategy. Mehhul drives
                The Wingsmark Infraa's operational excellence and long-term value creation across all business verticals.
              </div>
            </div>
          </div>
          <div className="team-card reveal reveal-delay-2">
            <div className="team-card-accent" style={{ background: 'linear-gradient(90deg, var(--royal), var(--steel))' }} />
            <div className="team-card-img" style={{ background: 'linear-gradient(135deg, #0a2840, var(--charcoal))' }}>
              <div className="team-avatar">
                <span>VG</span>
              </div>
            </div>
            <div className="team-card-body">
              <div className="team-name">Vijay C Gaaikwad</div>
              <div className="team-roles">
                <span className="team-role">Founder</span>
                <span className="team-role">
                  Govt. Liaising
                </span>
                <span className="team-role">Designated Partner</span>
              </div>
              <div className="team-bio">
                The founding force behind The Wingsmark Infraa, Vijay brings unparalleled government liaison expertise and deep knowledge of
                Navi Mumbai's land ecosystem, enabling smooth, dispute-free transactions for every stakeholder.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
