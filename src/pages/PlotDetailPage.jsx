import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation, ExternalLink } from 'lucide-react';
import { plotListings } from '../data';
import ShareBrochureButton from '../components/ShareBrochureButton';
import AddToCartButton from '../components/AddToCartButton';

function PlotDetailPage() {
  const { slug } = useParams();
  const plot = plotListings.find((item) => item.slug === slug);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);


  if (!plot) {
    return (
      <div className="land-detail-missing">
        <h2>Plot listing not found.</h2>
        <Link to="/plot" className="btn-gold">
          Back to All Plots
        </Link>
      </div>
    );
  }

  const isJv = plot.plotType === 'jv';
  const mapLink =
    plot.googleLocationUrl ||
    `https://www.google.com/maps/search/?api=1&query=${plot.location_geo.lat},${plot.location_geo.lng}`;
  const directionLink = `https://www.google.com/maps/dir/?api=1&destination=${plot.location_geo.lat},${plot.location_geo.lng}`;
  const gallery = plot.gallery?.length ? plot.gallery : [plot.img];

  const detailBlocks = [
    { label: 'Title', value: plot.title, wide: true },
    { label: 'Location', value: plot.location, wide: true },
    { label: 'Sector', value: plot.sector },
    { label: 'Area', value: plot.area },
    { label: 'Plot Number', value: plot.plotNumber },
    { label: 'Access Road', value: plot.accessRoad },
    { label: 'Stage', value: plot.stage, wide: true },
    isJv
      ? { label: 'JV Ratio', value: plot.jvRatio }
      : { label: 'Sale Price', value: plot.salePrice },
    isJv ? { label: 'JV on Price', value: plot.jvOnPrice } : null,
    plot.validityDays
      ? {
          label: 'Validity',
          value: `${plot.validityDays} days`,
          wide: true,
        }
      : null,
    plot.comments ? { label: 'Comments', value: plot.comments, wide: true, preline: true } : null,
  ].filter((b) => b && b.value);

  return (
    <>
      <div className="land-detail-hero">
        <div
          className="land-detail-hero-bg"
          style={{ backgroundImage: `url(${plot.img})` }}
        />
        <div className="land-detail-hero-overlay" />
        <div className="land-detail-hero-content">
          <div className="land-detail-hero-top">
            <Link to="/plot" className="land-detail-back">
              ← All Plots
            </Link>
          </div>
          <div className="land-detail-hero-tags">
            {plot.listingNumber && (
              <div className="land-detail-listing-num">{plot.listingNumber}</div>
            )}
            <div
              className="land-card-type"
              style={{
                background: isJv ? 'var(--steel)' : 'var(--gold)',
                color: isJv ? 'var(--white)' : 'var(--charcoal)',
                alignSelf: 'flex-start',
              }}
            >
              {plot.badge}
            </div>
            {plot.validityDays ? (
              <div className="plot-validity-pill">
                Validity · {plot.validityDays} days
              </div>
            ) : null}
          </div>
          <h1 className="land-detail-title">{plot.title}</h1>
          <div className="land-detail-loc">{plot.location}</div>
          <div className="land-detail-meta">
            <div>
              <div className="land-price-label">
                {isJv ? 'JV on Price' : 'Sale Price'}
              </div>
              <div className="land-price">
                {isJv ? plot.jvOnPrice : plot.salePrice}
              </div>
            </div>
            <div className="land-detail-area">{plot.area}</div>
          </div>
        </div>
      </div>

      <div className="land-detail-body">
        <section className="land-detail-section" id="details">
          <div className="land-detail-section-header">
            <h2 className="land-detail-h">Plot Snapshot</h2>
            <AddToCartButton
              entry={{
                id: `plot/${plot.slug}`,
                type: 'plot',
                slug: plot.slug,
                listingNumber: plot.listingNumber,
                title: plot.title,
                location: plot.location,
                price: isJv ? plot.jvOnPrice : plot.salePrice,
                img: plot.img,
              }}
              size="lg"
            />
          </div>
          <div className="listing-details-grid">
            {detailBlocks.map((block) => {
              const cls = [
                'listing-block',
                block.wide ? 'listing-block--wide' : '',
                block.accent ? 'listing-block--accent' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <div key={block.label} className={cls}>
                  <div className="listing-block-label">{block.label}</div>
                  <div className="listing-block-value">{block.value}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="land-detail-section" id="gallery">
          <h2 className="land-detail-h">Images <span className="land-detail-h-sub">(up to 5)</span></h2>
          {gallery.length > 0 && plot.gallery?.length ? (
            <div className="gallery-wrap">
              <div className="gallery-main">
                <img
                  src={gallery[galleryIndex]}
                  alt={`${plot.title} ${galleryIndex + 1}`}
                />
              </div>
              <div className="gallery-thumbs">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    className={`gallery-thumb ${i === galleryIndex ? 'active' : ''}`}
                    onClick={() => setGalleryIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="land-detail-empty">No images uploaded yet.</div>
          )}
        </section>

        <section className="land-detail-section" id="videos">
          <h2 className="land-detail-h">Videos <span className="land-detail-h-sub">(up to 5)</span></h2>
          {plot.media?.length > 0 ? (
            <div className="media-grid">
              {plot.media.map((item) => {
                const isMp4 = item.url?.toLowerCase().endsWith('.mp4');
                const videoSrc = isMp4
                  ? `${item.url}${item.url.includes('#') ? '' : '#t=0.5'}`
                  : item.url;
                return (
                  <div key={item.url} className="media-item">
                    <div className="media-frame">
                      {isMp4 ? (
                        <video src={videoSrc} controls preload="auto" playsInline />
                      ) : (
                        <iframe
                          src={item.url}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                    <div className="media-title">{item.title}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="land-detail-empty">No videos uploaded yet.</div>
          )}
        </section>

        <section className="land-detail-section" id="files">
          <h2 className="land-detail-h">Files <span className="land-detail-h-sub">(PDF / JPG · up to 5)</span></h2>
          {plot.files?.length > 0 ? (
            <ul className="files-list">
              {plot.files.map((file) => {
                const ext = (file.url?.split('.').pop() || 'pdf').toUpperCase();
                return (
                  <li key={file.name}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="file-row"
                    >
                      <div className="file-icon">{ext.length <= 4 ? ext : 'FILE'}</div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-action">Download</div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="land-detail-empty">No files uploaded yet.</div>
          )}
        </section>

        <section className="land-detail-section" id="location">
          <h2 className="land-detail-h">Google Location</h2>
          <div className="map-embed">
            <iframe
              src={`https://www.google.com/maps?q=${plot.location_geo.lat},${plot.location_geo.lng}&z=14&output=embed`}
              title={`${plot.title} location`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="map-meta">
            <div>
              <div className="map-address-label">Address</div>
              <div className="map-address">{plot.location_geo.address}</div>
            </div>
            <div className="map-actions">
              <a href={directionLink} target="_blank" rel="noreferrer" className="btn-gold">
                <Navigation size={14} />
                Get Direction
              </a>
              <a href={mapLink} target="_blank" rel="noreferrer" className="btn-outline">
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        <div className="land-detail-cta">
          <ShareBrochureButton listing={plot} type="plot" />
          <Link to="/#contact" className="btn-gold">
            Enquire About This Plot
          </Link>
          <Link to="/plot" className="btn-outline">
            Back to All Plots
          </Link>
        </div>
      </div>
    </>
  );
}

export default PlotDetailPage;
