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
              src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80"
              alt="Kharghar"
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
              src="https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=600&q=80"
              alt="Panvel"
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
              src="https://images.unsplash.com/photo-1598270553906-e4537ca1ff88?w=900&q=80&auto=format&fit=crop"
              alt="Khopoli"
              loading="lazy"
            />
            <div className="loc-card-overlay">
              <div className="loc-name">Khopoli</div>
              <div className="loc-tag">Industrial Corridor</div>
              <div className="loc-card-body">
                <p>Growing industrial and leisure destination with high land appreciation potential.</p>
              </div>
            </div>
          </div>
          <div className="loc-card reveal">
            <img
              src="https://images.unsplash.com/photo-1451440063999-77a8b2960d2b?w=900&q=80&auto=format&fit=crop"
              alt="Pen"
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
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80"
              alt="Karjat"
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
          <div className="loc-card reveal reveal-delay-2" style={{ background: 'linear-gradient(135deg, var(--royal), var(--charcoal))' }}>
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80"
              alt="Mumbai 3.0"
              loading="lazy"
              style={{ opacity: 0.5 }}
            />
            <div
              className="loc-card-overlay"
              style={{ background: 'linear-gradient(to top, rgba(14,56,94,0.97) 0%, rgba(154,7,4,0.2) 100%)' }}
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
