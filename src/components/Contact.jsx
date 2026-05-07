function Contact({ formSubmitted, onFormSubmit }) {
  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="contact-grid">
          <div className="reveal">
            <div className="section-badge">
              <span>Contact Us</span>
            </div>
            <h2 className="section-h2">Let's Build <em>Together</em></h2>
            <div className="gold-divider" />
            <p className="section-p">
              Incorporated as a Limited Liability Partnership (LLP) in May 2026, The Wingsmark Infraa brings a fresh yet experienced approach to Navi
              Mumbai's real estate landscape.
            </p>

            <div className="contact-offices">
              <div className="office-card">
                <div className="office-city">Navi Mumbai</div>
                <div className="office-type">Headquarters</div>
                <div className="office-detail">Our main operations hub covering Kharghar, Panvel, and surrounding nodes.</div>
              </div>
              <div className="office-card">
                <div className="office-city">Mumbai</div>
                <div className="office-type">Mumbai Branch</div>
                <div className="office-detail">Serving Greater Mumbai redevelopment and new project sales &amp; marketing.</div>
              </div>
              <div className="office-card">
                <div className="office-city">Delhi</div>
                <div className="office-type">Delhi Branch</div>
                <div className="office-detail">North India operations and NRI investor liaison office.</div>
              </div>
              <div className="office-card">
                <div className="office-city">Gujarat</div>
                <div className="office-type">Coming Soon</div>
                <div className="office-detail">Upcoming branch to serve Gujarat-based investors and NRI community.</div>
              </div>
            </div>

            <div className="map-placeholder">
              <div className="map-pin">📍</div>
              <div className="map-label">Navi Mumbai Headquarters</div>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <div style={{ padding: 40, background: 'rgba(14,56,94,0.15)', border: '1px solid rgba(97,98,99,0.2)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'var(--white)', marginBottom: 8 }}>
                Send an Enquiry
              </h3>
              <p style={{ fontSize: 12, color: 'var(--dark-gray)', marginBottom: 32 }}>
                Our team will respond within 24 hours.
              </p>

              <div className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Enquiry Type</label>
                  <select>
                    <option value="">Select enquiry type</option>
                    <option>Land for Sale — Buyer</option>
                    <option>Joint Venture Opportunity</option>
                    <option>NRI / Investor Enquiry</option>
                    <option>Submit My Land for Sale</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location of Interest</label>
                  <select>
                    <option value="">Select location</option>
                    <option>Kharghar</option>
                    <option>Panvel</option>
                    <option>Khopoli</option>
                    <option>Pen</option>
                    <option>Karjat</option>
                    <option>Mumbai 3.0</option>
                    <option>Multiple Locations</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="Tell us about your requirement, budget, or timeline..." />
                </div>
                <button
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                  type="button"
                  onClick={onFormSubmit}
                  disabled={formSubmitted}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9" />
                  </svg>
                  {formSubmitted ? '✓ Enquiry Sent — We will be in touch shortly!' : 'Submit Enquiry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
