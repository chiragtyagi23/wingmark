import { Link } from 'react-router-dom';
import { useState } from 'react';
import LeadModal from './LeadModal';

function ContactCTA() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section id="contact-cta">
      <div className="cta-inner">
        <div className="section-badge">
          <span>Get in Touch</span>
        </div>
        <h2 className="section-h2">Ready to <em>Invest</em> in Tomorrow?</h2>
        <p className="cta-p">
          Whether you're an Individual Investor, an NRI Looking to Invest in India's Fastest-Growing Region, or a Landowner Seeking the Right
          Partner - We're here to deliver Trust &amp; Value.
        </p>
        <div className="hero-btns">
          <button type="button" className="btn-gold" onClick={() => setModalOpen(true)}>
            Start a Conversation
          </button>
          <Link to="/land" className="btn-outline">
            View All Listings
          </Link>
          <LeadModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Post Your Enquiry"
            submitLabel="Submit"
            onSubmit={(data) => {
              console.log('[ContactCTA enquiry]', data);
              setModalOpen(false);
            }}
            context="Start a Conversation"
            variant="blue"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
