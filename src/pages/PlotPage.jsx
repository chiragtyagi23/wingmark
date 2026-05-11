import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlotBanner from '../components/PlotBanner';
import AddToCartButton from '../components/AddToCartButton';
import { plotListings } from '../data';

function PlotPage() {
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const filtered = plotListings.filter(
    (plot) => activeType === 'all' || plot.plotType === activeType
  );

  return (
    <>
      <PlotBanner />

      <section id="plot-sale" className="land-page-section">
        <div className="land-inner">
          <div className="land-header">
            <div className="section-badge" style={{ justifyContent: 'center' }}>
              <span>Section 2 &amp; 3</span>
            </div>
            <h2 className="section-h2" style={{ textAlign: 'center' }}>
              PLOTS <em>FOR SALE &amp; JV</em>
            </h2>
            <p className="section-p" style={{ margin: '0 auto', textAlign: 'center' }}>
              Each plot listing carries a structured snapshot — Location, Sector, Area, Plot Number, Access Road, Stage, Price (or JV ratio) and a Validity window. Up to 5 images, 5 videos, 5 files and a Google location are available per plot.
            </p>
          </div>

          <div className="land-filters">
            <button
              className={`filter-btn ${activeType === 'all' ? 'active' : ''}`}
              onClick={() => setActiveType('all')}
            >
              All Plots
            </button>
            <button
              className={`filter-btn ${activeType === 'sale' ? 'active' : ''}`}
              onClick={() => setActiveType('sale')}
            >
              Plots for Sale
            </button>
            <button
              className={`filter-btn ${activeType === 'jv' ? 'active' : ''}`}
              onClick={() => setActiveType('jv')}
            >
              Plots for JV
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="land-empty">
              No plots match the current filter.
            </div>
          ) : (
            <div className="land-grid">
              {filtered.map((plot) => (
                <Link
                  key={plot.slug}
                  to={`/plot/${plot.slug}`}
                  className="land-card"
                  data-type={plot.plotType}
                >
                  <div className="land-card-thumb">
                    <img src={plot.img} alt={plot.title} loading="lazy" />
                    <div
                      className="land-card-type"
                      style={{
                        background: plot.plotType === 'jv' ? 'var(--steel)' : 'var(--gold)',
                        color: plot.plotType === 'jv' ? 'var(--white)' : 'var(--charcoal)',
                      }}
                    >
                      {plot.badge}
                    </div>
                    {plot.validityDays ? (
                      <div className="plot-validity-tag">
                        Validity: {plot.validityDays} days
                      </div>
                    ) : null}
                  </div>
                  <div className="land-card-body">
                    {plot.listingNumber && (
                      <div className="land-card-num">{plot.listingNumber}</div>
                    )}
                    <div className="land-name">{plot.title}</div>
                    <div className="land-loc">{plot.location}</div>
                    <div className="land-card-details">
                      <div className="land-card-detail-row">
                        <span>Area</span>
                        <strong>{plot.area}</strong>
                      </div>
                      {plot.plotNumber && (
                        <div className="land-card-detail-row">
                          <span>Plot Number</span>
                          <strong>{plot.plotNumber}</strong>
                        </div>
                      )}
                      {plot.accessRoad && (
                        <div className="land-card-detail-row">
                          <span>Road Facing</span>
                          <strong>{plot.accessRoad}</strong>
                        </div>
                      )}
                      {plot.stage && (
                        <div className="land-card-detail-row">
                          <span>Status</span>
                          <strong>{plot.stage}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="land-card-footer">
                    <div>
                      <div className="land-price-label">
                        {plot.plotType === 'jv' ? 'JV on Price' : 'Sale Price'}
                      </div>
                      <div className="land-price">
                        {plot.plotType === 'jv' ? plot.jvOnPrice : plot.salePrice}
                      </div>
                    </div>
                    <div className="land-card-actions">
                      <AddToCartButton
                        entry={{
                          id: `plot/${plot.slug}`,
                          type: 'plot',
                          slug: plot.slug,
                          listingNumber: plot.listingNumber,
                          title: plot.title,
                          location: plot.location,
                          price:
                            plot.plotType === 'jv'
                              ? plot.jvOnPrice
                              : plot.salePrice,
                          img: plot.img,
                        }}
                      />
                      <div className="land-enter">Enter ↵</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/#contact" className="btn-gold">
              Enquire About Plots
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/#contact" className="btn-outline">
              Submit Your Plot for Listing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlotPage;
