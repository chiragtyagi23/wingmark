function Locations() {
  return (
    <section id="locations">
      <div className="locations-inner">
        <div className="locations-header reveal">
          <div>
            <div className="section-badge">
              <span>Our Footprint</span>
            </div>
            <h2 className="section-h2">Regions of <em>Expertise</em></h2>
          </div>
          <a href="#contact" className="btn-outline" style={{ flexShrink: 0 }}>
            Explore All Locations
          </a>
        </div>
        <div className="loc-grid">
          <div className="loc-card reveal">
            <img
              src="/footprint-kharghar.png"
              alt="Kharghar — Utsav Chowk, Navi Mumbai"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Kharghar</div>
              <div className="loc-tag">Navi Mumbai</div>
              <div className="loc-card-body">
                <p>Rapidly developing node with strong infrastructure, green spaces and premium residential demand.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal reveal-delay-1">
            <img
              src="/footprint-panvel.png"
              alt="Panvel — regional connectivity and gateway growth"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Panvel</div>
              <div className="loc-tag">Navi Mumbai Gateway</div>
              <div className="loc-card-body">
                <p>Strategic hub adjacent to NAINA and upcoming Navi Mumbai International Airport.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal reveal-delay-2">
            <img
              src="/footprint-khopoli.png"
              alt="Khopoli — industrial corridor and logistics belt"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Khopoli</div>
              <div className="loc-tag">Industrial corridor</div>
              <div className="loc-card-body">
                <p>Industrial corridor from Khopoli with strong logistics, manufacturing adjacency, and land upside.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal">
            <img
              src="/footprint-pen.png"
              alt="Pen — Western Ghats and Raigad district"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Pen</div>
              <div className="loc-tag">Raigad District</div>
              <div className="loc-card-body">
                <p>Emerging investment zone with significant agricultural and residential land potential.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal reveal-delay-1">
            <img
              src="/footprint-karjat.png"
              alt="Karjat — resort and villa destination"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Karjat</div>
              <div className="loc-tag">Nature &amp; Growth</div>
              <div className="loc-card-body">
                <p>Premium resort and villa destination with expanding connectivity and eco-tourism potential.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal reveal-delay-2">
            <img
              src="/footprint-mumbai30.png"
              alt="Mumbai 3.0 — next-generation metropolitan growth"
              loading="lazy"
            />
            <div
              className="loc-card-overlay"
              style={{ background: 'linear-gradient(to top, rgba(14,56,94,0.97) 0%, rgba(247,198,27,0.22) 100%)' }}
            >
              <div className="loc-name">Mumbai 3.0</div>
              <div className="loc-tag">⭐ Priority Focus Area</div>
              <div className="loc-card-body">
                <p>The next evolution of Mumbai's urban expansion — the highest growth potential corridor of our era.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Locations;
