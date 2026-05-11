import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navigation, ExternalLink } from 'lucide-react';
import { landListings } from '../data';
import ShareBrochureButton from '../components/ShareBrochureButton';
import { recordVisit } from '../hooks/useVisitedListings';

function LandDetailPage() {
  const { slug } = useParams();
  const listing = landListings.find((item) => item.slug === slug);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  useEffect(() => {
    if (!listing) return;
    recordVisit({
      id: `land/${listing.slug}`,
      type: 'land',
      slug: listing.slug,
      listingNumber: listing.listingNumber,
      title: listing.name,
      location: listing.loc,
      price: listing.price,
      img: listing.img,
    });
  }, [listing]);

  if (!listing) {
    return (
      <div className="land-detail-missing">
        <h2>Listing not found.</h2>
        <Link to="/land" className="btn-gold">
          Back to All Listings
        </Link>
      </div>
    );
  }

  const mapLink = listing.googleLocationUrl ?? `https://www.google.com/maps/search/?api=1&query=${listing.location.lat},${listing.location.lng}`;
  const directionLink = `https://www.google.com/maps/dir/?api=1&destination=${listing.location.lat},${listing.location.lng}`;
  const gallery = listing.gallery?.length ? listing.gallery : [listing.img];

  const formatMultiline = (val) => {
    if (val == null || val === '') return '';
    if (Array.isArray(val)) {
      return val
        .map((s) => String(s).replace(/^\s*[•\u2022\-–]\s*/, '').trim())
        .filter(Boolean)
        .map((s) => `• ${s}`)
        .join('\n');
    }
    return String(val);
  };

  // Split a paragraph into bullet points on commas and periods, while
  // preserving acronyms like "N.A.", abbreviations like "Mr.", numeric
  // figures like "1,000", and dotted segments inside words.
  const splitToBullets = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return formatMultiline(val);
    const text = String(val)
      // protect common patterns so we don't split inside them
      .replace(/(\d),(\d)/g, '$1<KEEPCOMMA>$2')
      .replace(/\b([A-Z])\.(?=[A-Z]\.)/g, '$1<KEEPDOT>')
      .replace(/\b(Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|etc|approx|aka|i\.e|e\.g)\./gi,
        '$1<KEEPDOT>');
    const parts = text
      .split(/[,.]+(?:\s+|$)/)
      .map((s) =>
        s
          .replace(/<KEEPCOMMA>/g, ',')
          .replace(/<KEEPDOT>/g, '.')
          .replace(/^[\s\-–—•]+|[\s\-–—•]+$/g, '')
          .trim()
      )
      .filter(Boolean);
    if (parts.length <= 1) return parts[0] || String(val).trim();
    return parts.map((s) => `• ${s}`).join('\n');
  };

  const commentsText = listing.comments ?? listing.specialComments;

  const detailBlocks = [
    { label: 'Title', value: listing.name, wide: true, preline: true },
    { label: 'Location', value: listing.loc, wide: true, preline: true },
    { label: 'Nearest train station', value: listing.nearestStation, preline: true },
    { label: 'Total Area', value: listing.area },
    { label: 'Suitable for', value: listing.suitableFor, wide: true, preline: true },
    { label: 'Opportunity', value: splitToBullets(listing.opportunity), wide: true, preline: true },
    { label: 'Key points', value: formatMultiline(listing.keyPoints), wide: true, preline: true },
    { label: 'Special Features', value: formatMultiline(listing.specialFeatures), wide: true, preline: true },
    { label: 'Comments', value: formatMultiline(commentsText), wide: true, accent: true, preline: true },
    { label: 'Price', value: listing.price },
    { label: 'Status', value: listing.status, wide: true, preline: true },
  ].filter((block) => block.value);

  return (
    <>
      <div className="land-detail-hero">
        <div
          className="land-detail-hero-bg"
          style={{ backgroundImage: `url(${listing.img})` }}
        />
        <div className="land-detail-hero-overlay" />
        <div className="land-detail-hero-content">
          <div className="land-detail-hero-top">
            <Link to="/land" className="land-detail-back">
              ← Land Deals
            </Link>
          </div>
          <div className="land-detail-hero-tags">
            {listing.listingNumber && (
              <div className="land-detail-listing-num">{listing.listingNumber}</div>
            )}
            <div
              className="land-card-type"
              style={{
                background: listing.type === 'jv' ? 'var(--steel)' : listing.type === 'plot' ? 'var(--royal)' : 'var(--gold)',
                color: listing.type === 'jv' ? 'var(--gold)' : listing.type === 'plot' ? 'var(--gold)' : 'var(--charcoal)',
                alignSelf: 'flex-start',
              }}
            >
              {listing.badge}
            </div>
          </div>
          <h1 className="land-detail-title">{listing.name}</h1>
          <div className="land-detail-loc">{listing.loc}</div>
          <div className="land-detail-meta">
            <div>
              <div className="land-price-label">{listing.label}</div>
              <div className="land-price">{listing.price}</div>
            </div>
            <div className="land-detail-area">{listing.area}</div>
          </div>
        </div>
      </div>

      <div className="land-detail-body">
        <section className="land-detail-section" id="details">
          <h2 className="land-detail-h">Listing Details</h2>

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
                  <div
                    className={[
                      'listing-block-value',
                      block.preline ? 'listing-block-value--preline' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {block.value}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="land-detail-section" id="gallery">
          <h2 className="land-detail-h">Images</h2>
          {gallery.length > 0 ? (
            <div className="gallery-wrap">
              <div className="gallery-main">
                <img src={gallery[galleryIndex]} alt={`${listing.name} ${galleryIndex + 1}`} />
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
          <h2 className="land-detail-h">Videos</h2>
          {listing.media?.length > 0 ? (
            <div className="media-grid">
              {listing.media.map((item) => {
                const isMp4 = item.url?.toLowerCase().endsWith('.mp4');
                const videoSrc = isMp4
                  ? `${item.url}${item.url.includes('#') ? '' : '#t=0.5'}`
                  : item.url;
                return (
                  <div key={item.url} className="media-item">
                    <div className="media-frame">
                      {isMp4 ? (
                        <video
                          src={videoSrc}
                          controls
                          preload="auto"
                          playsInline
                        />
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
          <h2 className="land-detail-h">Files (PDF / JPG)</h2>
          {listing.files?.length > 0 ? (
            <ul className="files-list">
              {listing.files.map((file) => {
                const ext = (file.url?.split('.').pop() || 'pdf').toUpperCase();
                return (
                  <li key={file.name}>
                    <a href={file.url} target="_blank" rel="noreferrer" className="file-row">
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
            {listing.locationImage ? (
              <img
                src={listing.locationImage}
                alt={`${listing.name} location preview`}
                loading="lazy"
              />
            ) : (
              <iframe
                src={`https://www.google.com/maps?q=${listing.location.lat},${listing.location.lng}&z=14&output=embed`}
                title={`${listing.name} location`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
          <div className="map-meta">
            <div>
              <div className="map-address-label">Address</div>
              <div className="map-address">{listing.location.address}</div>
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
          <ShareBrochureButton listing={listing} type="land" />
          <Link to="/#contact" className="btn-gold">
            Enquire About This Listing
          </Link>
          <Link to="/land" className="btn-outline">
            Back to Land Deals
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandDetailPage;
