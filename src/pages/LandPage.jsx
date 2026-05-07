import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LandBanner from '../components/LandBanner';
import { landListings, landCategories } from '../data';

function LandPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const showcaseImages = useMemo(
    () => [
      'https://source.unsplash.com/zSflp4Mq_l0/1600x900',
      'https://source.unsplash.com/otyhxFfvF_U/1600x900',
      'https://source.unsplash.com/T2W_XxVgcdI/1600x900',
      'https://source.unsplash.com/oFweDg39ldw/1600x900',
      'https://cdn.pixabay.com/photo/2016/10/14/00/38/real-estate-1739189_1280.jpg',
      'https://source.unsplash.com/mYXDtOxxuJo/1600x900',
      'https://source.unsplash.com/9dJifyLKAUE/1600x900',
      'https://source.unsplash.com/SRoA10H6hmc/1600x900',
      'https://source.unsplash.com/GBc_0a6MUEM/1600x900',
      'https://source.unsplash.com/8O_LpUb46_g/1600x900',
    ],
    []
  );

  const showcaseVideos = useMemo(
    () => [
      { title: 'Land Media 01', url: 'https://www.youtube.com/embed/_yhE9Wo-OtQ' },
      { title: 'Land Media 02', url: 'https://www.youtube.com/embed/MMotsPLv8zU' },
      { title: 'Land Media 03', url: 'https://www.youtube.com/embed/4jnzf1yj48M' },
      { title: 'Land Media 04', url: 'https://www.youtube.com/embed/cvXvxseapcU' },
      { title: 'Land Media 05', url: 'https://www.youtube.com/embed/VKAKbueezMk' },
    ],
    []
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setShowcaseIndex((i) => (i + 1) % showcaseImages.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [showcaseImages.length]);

  const filtered = landListings.filter((listing) => {
    const categoryOk = activeCategory === 'all' || listing.category === activeCategory;
    const typeOk = activeType === 'all' || listing.type === activeType;
    return categoryOk && typeOk;
  });

  return (
    <>
      <LandBanner />

      <section className="land-showcase">
        <div className="land-showcase-inner">
          <div className="land-showcase-top">
            <div>
              <div className="section-badge">
                <span>Land Snapshot</span>
              </div>
              <h2 className="section-h2">
                Discover land that matches your <em>vision</em>
              </h2>
              <p className="section-p">
                Quick highlights, curated visuals, and media to help you evaluate opportunities faster.
              </p>
            </div>
          </div>

          <div className="land-promo-cards">
            <div className="land-promo-card">
              <div className="land-promo-img" style={{ backgroundImage: 'url(/land-promo-1.png)' }} />
              <div className="land-promo-body">
                <div className="land-promo-line">Prime land with strong future potential.</div>
                <div className="land-promo-sub">Perfect blend of location and opportunity.</div>
              </div>
            </div>
            <div className="land-promo-card">
              <div className="land-promo-img" style={{ backgroundImage: 'url(/land-promo-2.png)' }} />
              <div className="land-promo-body">
                <div className="land-promo-line">Scenic land crafted for premium development.</div>
                <div className="land-promo-sub">A valuable asset in a fast-growing region.</div>
              </div>
            </div>
          </div>

          <div className="land-showcase-grid">
            <div className="land-showcase-gallery">
              <div className="land-showcase-gallery-main">
                <img src={showcaseImages[showcaseIndex]} alt={`Gallery ${showcaseIndex + 1}`} />
                <button
                  className="land-showcase-arrow prev"
                  onClick={() => setShowcaseIndex((i) => (i - 1 + showcaseImages.length) % showcaseImages.length)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="land-showcase-arrow next"
                  onClick={() => setShowcaseIndex((i) => (i + 1) % showcaseImages.length)}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
              <div className="land-showcase-thumbs">
                {showcaseImages.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    className={`land-showcase-thumb ${i === showcaseIndex ? 'active' : ''}`}
                    onClick={() => setShowcaseIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="land-showcase-side">
              <div className="land-showcase-box">
                <h3 className="land-showcase-h3">Description</h3>
                <textarea
                  className="land-showcase-textarea"
                  placeholder="Type full content here… (This is a draft box; we can connect it to saving later)"
                  rows={8}
                />
              </div>
              <div className="land-showcase-box">
                <h3 className="land-showcase-h3">Google Location</h3>
                <div className="land-showcase-map">
                  <iframe
                    src="https://www.google.com/maps?q=19.0227,73.2045&z=13&output=embed"
                    title="Land page location"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://maps.app.goo.gl/ueeHTgaq7vpVfhjx6"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}
                >
                  Open exact location in Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="land-showcase-media">
            <div className="section-badge">
              <span>Media</span>
            </div>
            <h2 className="section-h2">
              On-ground <em>videos</em>
            </h2>
            <div className="media-grid">
              {showcaseVideos.map((item) => (
                <div key={item.url} className="media-item">
                  <div className="media-frame">
                    <iframe
                      src={item.url}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="media-title">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="land" className="land-page-section">
        <div className="land-inner">
          <div className="land-header">
            <div className="section-badge" style={{ justifyContent: 'center' }}>
              <span>Featured Listings</span>
            </div>
            <h2 className="section-h2" style={{ textAlign: 'center' }}>
              Premium Land <em>Opportunities</em>
            </h2>
            <p className="section-p" style={{ margin: '0 auto', textAlign: 'center' }}>
              Carefully curated land parcels across Navi Mumbai's highest-growth corridors. Each listing is legally cleared, government liaisoned, and investment-ready.
            </p>
          </div>

          <div className="land-filters">
            <button
              className={`filter-btn ${activeType === 'all' ? 'active' : ''}`}
              onClick={() => setActiveType('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${activeType === 'sale' ? 'active' : ''}`}
              onClick={() => setActiveType('sale')}
            >
              Land for Sale
            </button>
            <button
              className={`filter-btn ${activeType === 'jv' ? 'active' : ''}`}
              onClick={() => setActiveType('jv')}
            >
              Joint Venture
            </button>
            <button
              className={`filter-btn ${activeType === 'plot' ? 'active' : ''}`}
              onClick={() => setActiveType('plot')}
            >
              Villa Plotting
            </button>
          </div>

          <div className="land-categories">
            {landCategories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="land-empty">
              No listings match the current filters. Try a different category.
            </div>
          ) : (
            <div className="land-grid">
              {filtered.map((listing) => (
                <Link
                  key={listing.slug}
                  to={`/land/${listing.slug}`}
                  className="land-card"
                  data-type={listing.type}
                >
                  <div className="land-card-thumb">
                    <img src={listing.img} alt={listing.name} loading="lazy" />
                    <div
                      className="land-card-type"
                      style={{
                        background: listing.type === 'jv' ? 'var(--steel)' : listing.type === 'plot' ? 'var(--red)' : 'var(--gold)',
                        color: listing.type === 'jv' ? 'var(--white)' : listing.type === 'plot' ? 'var(--white)' : 'var(--charcoal)',
                      }}
                    >
                      {listing.badge}
                    </div>
                  </div>
                  <div className="land-card-body">
                    <div className="land-loc">{listing.loc}</div>
                    <div className="land-name">{listing.name}</div>
                    <div className="land-area">{listing.area}</div>
                    {listing.snapshot?.length > 0 && (
                      <ul className="land-snapshot">
                        {listing.snapshot.slice(0, 2).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="land-card-footer">
                    <div>
                      <div className="land-price-label">{listing.label}</div>
                      <div className="land-price">{listing.price}</div>
                    </div>
                    <div className="land-arrow">
                      <svg viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12,5 19,12 12,19" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/#contact" className="btn-gold">
              Enquire About Listings
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/#contact" className="btn-outline">
              Submit Your Land for Listing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandPage;
