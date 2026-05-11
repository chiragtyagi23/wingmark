import { useEffect, useState } from 'react';
import { MapPin, Send, RefreshCw, Navigation } from 'lucide-react';

const HQ_ADDRESS =
  'Shop 2, Sai Leela CHS, New Sector 50, Seawoods, Navi Mumbai – 400 706';
const HQ_GEO = { lat: 19.0188, lng: 73.019 };
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${HQ_GEO.lat},${HQ_GEO.lng}`;

function makeChallenge() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

function Contact({ formSubmitted, onFormSubmit }) {
  const [challenge, setChallenge] = useState(makeChallenge);
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (formSubmitted) {
      setCaptcha('');
      setError('');
    }
  }, [formSubmitted]);

  const refreshCaptcha = () => {
    setChallenge(makeChallenge());
    setCaptcha('');
    setError('');
  };

  const handleSubmit = () => {
    if (parseInt(captcha, 10) !== challenge.answer) {
      setError('Captcha answer is incorrect. Please try again.');
      refreshCaptcha();
      return;
    }
    setError('');
    onFormSubmit?.();
  };

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
                <div className="office-detail">Our main operations hub at Seawoods, serving Nerul, Kharghar, Panvel and surrounding nodes.</div>
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

            <div className="map-with-direction">
              <div className="map-placeholder">
                <MapPin className="map-pin-icon" size={36} />
                <div className="map-label">Navi Mumbai Headquarters</div>
                <div className="map-address-sub">{HQ_ADDRESS}</div>
              </div>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-direction"
              >
                <Navigation size={16} />
                Get Direction
              </a>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <div className="contact-form-panel">
              <h3 className="contact-form-title">Send an Enquiry</h3>
              <p className="contact-form-sub">Our team will respond within 24 hours.</p>

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

                <div className="form-group captcha-group">
                  <label>
                    Verify you're human
                    <button
                      type="button"
                      className="captcha-refresh"
                      onClick={refreshCaptcha}
                      aria-label="Refresh captcha"
                    >
                      <RefreshCw size={12} />
                      New question
                    </button>
                  </label>
                  <div className="captcha-row">
                    <div className="captcha-question">
                      {challenge.a} <span>+</span> {challenge.b} <span>=</span>
                    </div>
                    <input
                      type="number"
                      placeholder="?"
                      className="captcha-input"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      aria-label="Captcha answer"
                    />
                  </div>
                  {error && <div className="captcha-error">{error}</div>}
                </div>

                <button
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                  type="button"
                  onClick={handleSubmit}
                  disabled={formSubmitted}
                >
                  <Send size={14} />
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
