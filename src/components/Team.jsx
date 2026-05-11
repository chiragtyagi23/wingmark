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
            The Wingsmark Infraa comprises individuals from diverse backgrounds - Hospitality, Facility &amp; Payroll Management, Land Liaisoning,
            Legal Clearance, Real Estate Sales, Marketing, Distribution &amp; Construction - with a cumulative experience of over 30 years.
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
                A Strategic Leader with Deep Expertise in Real Estate Operations, Stakeholder Management, and Growth Strategy. Mehhul drives
                The Wingsmark Infraa's Operational Excellence and Long-Term Value Creation across all Business Verticals.
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
                The Founding Force behind The Wingsmark Infraa, Vijay brings Unparalleled Government Liaison Expertise and Deep Knowledge of
                Navi Mumbai's Land Ecosystem, Enabling Smooth, Dispute-Free Transactions for every Stakeholder.
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
                Our In-House Legal Counsel, Advocate Sathyam Acharya ensures every Transaction undergoes Rigorous Title Verification,
                Documentation Scrutiny and Regulatory Compliance - Safeguarding our Clients at every Stage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
