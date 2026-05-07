import { Link } from 'react-router-dom';

function ContactCTA() {
  return (
    <section id="contact-cta">
      <div className="cta-inner">
        <div className="section-badge">
          <span>Get in Touch</span>
        </div>
        <h2 className="section-h2">Ready to <em>Invest</em> in Tomorrow?</h2>
        <p className="cta-p">
          Whether you're an individual investor, an NRI looking to invest in India's fastest-growing region, or a landowner seeking the right
          partner — we're here to deliver Trust &amp; Value.
        </p>
        <div className="hero-btns">
          <a href="#contact" className="btn-gold">Start a Conversation</a>
          <Link to="/land" className="btn-outline">View All Listings</Link>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;
