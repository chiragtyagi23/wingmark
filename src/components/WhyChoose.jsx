import { ShieldCheck, IndianRupee, Globe2, Users } from 'lucide-react';

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
              <ShieldCheck size={30} strokeWidth={1.6} />
            </div>
            <div className="why-title">Trusted &amp; Transparent</div>
            <div className="why-p">Every transaction backed by complete legal clarity and stakeholder-first values.
            <br />Your investment is protected.</div>
          </div>
          <div className="why-card reveal reveal-delay-1">
            <div className="why-icon">
              <IndianRupee size={30} strokeWidth={1.6} />
            </div>
            <div className="why-title">High-Return Focus</div>
            <div className="why-p">Land in Navi Mumbai and Mumbai 3.0 corridors offering some of India's strongest appreciation trajectories.</div>
          </div>
          <div className="why-card reveal reveal-delay-2">
            <div className="why-icon">
              <Globe2 size={30} strokeWidth={1.6} />
            </div>
            <div className="why-title">In-Depth Market Knowledge</div>
            <div className="why-p">Decades of on-ground knowledge across Navi Mumbai, Raigad, and the Mumbai Metropolitan Region.</div>
          </div>
          <div className="why-card reveal reveal-delay-3">
            <div className="why-icon">
              <Users size={30} strokeWidth={1.6} />
            </div>
            <div className="why-title">Diverse Expertise</div>
            <div className="why-p">Our team spans Real Estate, Facility Management, Hospitality, Construction, and Legal - 30+ years of combined excellence.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
