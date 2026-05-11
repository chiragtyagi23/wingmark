import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { generateCompanyProfilePdf } from '../utils/generateCompanyProfile';

function About() {
  const [busy, setBusy] = useState(false);

  const handleDownloadProfile = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await generateCompanyProfilePdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'The Wingsmark Infraa - Company Profile.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err) {
      console.error('[Company profile PDF]', err);
      alert('Could not generate the company profile. Please try again.');
    } finally {
      setBusy(false);
    }
  };

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
            The Wingsmark Infraa is a Navi Mumbai based Real Estate Advisory specializing in land acquisition, land development &amp;
            offering sales &amp; marketing strategy for new developments. Our core strength is land liaisoning backed with the promise of high
            returns for our stake holders.
          </p>
          <p className="section-p" style={{ marginTop: 16 }}>
            Founded by industry veterans, we focus on providing <strong style={{ color: 'var(--white)' }}>'Trust &amp; Value'</strong> through a very
            customer friendly approach, innovative ideas &amp; specialised services.
          </p>
          <div className="about-pillars">
            <div className="pillar">
              <div className="pillar-title">Land</div>
              <div className="pillar-p">
                Acquisition, Dispute Resolution &amp; Legal Clearance
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Development</div>
              <div className="pillar-p">Bungalow &amp; Villa plotting in Mumbai 3.0, Redevelopment in Mumbai</div>
            </div>
            <div className="pillar">
              <div className="pillar-title">New Projects</div>
              <div className="pillar-p">
                Sales Strategy, Marketing &amp; Distribution
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-title">Corporate Identity</div>
              <div className="pillar-p">Incorporated as a Limited Liability Partnership (LLP) in May 2026</div>
            </div>
          </div>
          <button
            type="button"
            className="btn-gold"
            style={{ marginTop: 28, gap: 8 }}
            onClick={handleDownloadProfile}
            disabled={busy}
          >
            {busy ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
            {busy ? 'Preparing...' : 'Download Company Profile'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
