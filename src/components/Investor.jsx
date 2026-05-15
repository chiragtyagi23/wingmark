import { useState } from 'react';
import LeadModal from './LeadModal';

function Investor() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="investor">
      <div className="investor-inner">
        <div className="investor-grid">
          <div className="investor-text reveal">
            <div className="section-badge">
              <span>Investors &amp; NRI</span>
            </div>
            <h2 className="section-h2">Your Gateway to <em>India's Growth</em> Story</h2>
            <div className="gold-divider" />
            <p className="section-p">
              Mumbai 3.0 represents a once-in-a-generation investment opportunity. As Navi Mumbai's infrastructure expands with the new
              international airport, NAINA townships, and metro connectivity, land values along these corridors are poised for significant appreciation.
            </p>

            <div className="invest-points">
              <div className="invest-point">
                <div className="invest-point-num">01</div>
                <div className="invest-point-content">
                  <h4>Airport Proximity Advantage</h4>
                  <p>Lands within the Navi Mumbai International Airport influence zone - historically proven to deliver exceptional returns.</p>
                </div>
              </div>
              <div className="invest-point">
                <div className="invest-point-num">02</div>
                <div className="invest-point-content">
                  <h4>Fully Liaisoned &amp; Legal</h4>
                  <p>All land transactions are government-cleared, legally vetted, and free from disputes before you invest.</p>
                </div>
              </div>
              <div className="invest-point">
                <div className="invest-point-num">03</div>
                <div className="invest-point-content">
                  <h4>NRI-Friendly Process</h4>
                  <p>End-to-end support for NRI investors - paperwork, FEMA compliance, remote transactions made simple.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <button type="button" className="btn-gold" onClick={() => setModalOpen(true)}>
                Schedule a Consultation
              </button>
            </div>

            <LeadModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Post Your Enquiry"
              submitLabel="Submit"
              onSubmit={(data) => { console.log('[Investor enquiry]', data); setModalOpen(false); }}
              context="Investor Consultation"
            />
          </div>

          <div className="investor-visual reveal reveal-delay-2">
            <div className="invest-cards-stack">
              <div className="invest-card">
                <div className="invest-card-label">Mumbai 3.0 Focus</div>
                <div className="invest-card-title">Navi Mumbai International Airport Corridor</div>
                <div className="invest-card-p">
                  The 12,000+ acre NAINA influence zone is India's most watched new-city development. Early investors stand to gain significantly as
                  infrastructure matures.
                </div>
                <div className="invest-card-tag">High Growth Zone</div>
              </div>
              <div className="invest-card">
                <div className="invest-card-label">Joint Ventures</div>
                <div className="invest-card-title">Partner With Us for Maximum Returns</div>
                <div className="invest-card-p">
                  We structure JV opportunities that allow landowners and investors to combine resources for superior project outcomes and shared high returns.
                </div>
                <div className="invest-card-tag">Open for Partnerships</div>
              </div>
              <div className="invest-card ">
                <div className="invest-card-label" >Limited Opportunity</div>
                <div className="invest-card-title">Early Mover Advantage</div>
                <div className="invest-card-p">
                  Prime land parcels in pre-development stages offer the highest appreciation. Connect now to get first access to our exclusive listings.
                </div>
                <div className="invest-card-tag">
                  Exclusive Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Investor;
