import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LandBanner from '../components/LandBanner';
import AddToCartButton from '../components/AddToCartButton';
import landListings from '../api/land.json';
import ListingTextValue from '../components/ListingTextValue';
import { locationPreview } from '../utils/listingTextFormat';
import landCategories from '../api/land-categories.json';

function LandPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const categories = landCategories;
  const filtered = landListings.filter((listing) => {
    const categoryOk = activeCategory === 'all' || listing.category === activeCategory;
    const typeOk = activeType === 'all' || listing.type === activeType;
    return categoryOk && typeOk;
  });

  return (
    <>
      <LandBanner />

      <section id="land" className="land-page-section">
        <div className="land-inner">
          <div className="land-header">
            <div className="section-badge" style={{ justifyContent: 'center' }}>
              <span>Section 1</span>
            </div>
            <h2 className="section-h2" style={{ textAlign: 'center' }}>
              LAND <em>DEALS</em>
            </h2>
            <p className="section-p" style={{ margin: '0 auto', textAlign: 'center' }}>
              Curated land parcels across Navi Mumbai's highest-growth corridors. Each listing carries title clarity, government liaison, and structured fields covering location, area, suitability, opportunity, price and status.
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
            {categories.map((cat) => (
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
                        background: listing.type === 'jv' ? 'var(--steel)' : listing.type === 'plot' ? 'var(--royal)' : 'var(--gold)',
                        color: listing.type === 'jv' ? 'var(--gold)' : listing.type === 'plot' ? 'var(--gold)' : 'var(--charcoal)',
                      }}
                    >
                      {listing.badge}
                    </div>
                  </div>
                  <div className="land-card-body">
                    {listing.listingNumber && (
                      <div className="land-card-num">{listing.listingNumber}</div>
                    )}
                    <div className="land-name">{listing.name}</div>
                    <div className="land-loc">
                      <span className="land-loc-label">Location</span>
                      <ListingTextValue
                        value={listing.loc}
                        listClassName="land-loc-list"
                        className="land-loc-text"
                      />
                    </div>
                    <div className="land-card-details">
                      <div className="land-card-detail-row">
                        <span>Total Area</span>
                        <strong>{listing.area}</strong>
                      </div>
                      {listing.suitableFor && (
                        <div className="land-card-detail-row">
                          <span>Suitable For</span>
                          <strong>{listing.suitableFor}</strong>
                        </div>
                      )}
                      {listing.opportunity && (
                        <div className="land-card-detail-row">
                          <span>Opportunity</span>
                          <strong>{listing.opportunity}</strong>
                        </div>
                      )}
                      {listing.status && (
                        <div className="land-card-detail-row">
                          <span>Status</span>
                          <strong>{listing.status}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="land-card-footer">
                    <div>
                      <div className="land-price-label">{listing.label}</div>
                      <div className="land-price">{listing.price}</div>
                    </div>
                    <div className="land-card-actions">
                      <AddToCartButton
                        entry={{
                          id: `land/${listing.slug}`,
                          type: 'land',
                          slug: listing.slug,
                          listingNumber: listing.listingNumber,
                          title: listing.name,
                          location: listing.loc,
                          price: listing.price,
                          img: listing.img,
                        }}
                      />
                      <div className="land-enter">Details ↵</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/#contact" className="mb-2.5 btn-gold">
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
