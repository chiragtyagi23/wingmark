import { Scale } from 'lucide-react';

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
        <div className="team-grid team-grid--3">
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
                <span className="team-role">Founder</span>
                <span className="team-role">COO</span>
                <span className="team-role">Strategic Advisor</span>
                <span className="team-role">Designated Partner</span>
              </div>
              <div className="team-contact">
                <a href="tel:+918070888111">80708 88111</a>
                <a href="tel:+919930949066">99309 49066</a>
              </div>
              <div className="team-bio">
                A strategic leader with deep expertise in real estate operations, stakeholder management, and growth strategy. Mehhul drives
                The Wingsmark Infraa's operational excellence and long-term value creation across all business verticals.
              </div>
            </div>
          </div>
          <div className="team-card reveal reveal-delay-1">
            <div className="team-card-accent" style={{ background: 'linear-gradient(90deg, var(--royal), var(--steel))' }} />
            <div className="team-card-img">
              <div className="team-avatar team-avatar-photo">
                <img src="/vijay-founder.png" alt="Vijay C Gaaikwad" />
              </div>
            </div>
            <div className="team-card-body">
              <div className="team-name">Vijay C Gaaikwad</div>
              <div className="team-roles">
                <span className="team-role">Founder</span>
                <span className="team-role">Land Acquisition</span>
                <span className="team-role">Govt. Liaisoning</span>
                <span className="team-role">Designated Partner</span>
              </div>
              <div className="team-contact">
                <a href="tel:+919552510383">95525 10383</a>
              </div>
              <div className="team-bio">
                The founding force behind The Wingsmark Infraa, Vijay brings unparalleled government liaison expertise and deep knowledge of
                Navi Mumbai's land ecosystem, enabling smooth, dispute-free transactions for every stakeholder.
              </div>
            </div>
          </div>
          <div className="team-card reveal reveal-delay-2">
            <div className="team-card-accent" style={{ background: 'linear-gradient(90deg, var(--charcoal), var(--royal))' }} />
            <div className="team-card-img">
              <div className="team-avatar">
                <Scale size={36} />
              </div>
            </div>
            <div className="team-card-body">
              <div className="team-name">Adv. Sathyam Acharya</div>
              <div className="team-roles">
                <span className="team-role">Verification</span>
                <span className="team-role">Documentation</span>
                <span className="team-role">Legal Advisor</span>
              </div>
              <div className="team-contact">
                <a href="tel:+919819520866">98195 20866</a>
              </div>
              <div className="team-bio">
                Our in-house legal counsel, Advocate Sathyam Acharya ensures every transaction undergoes rigorous title verification,
                documentation scrutiny and regulatory compliance — safeguarding our clients at every stage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
