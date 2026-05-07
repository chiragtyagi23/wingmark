import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { landListings, WHATSAPP_NUMBER } from '../data';
import ShareButton from '../components/ShareButton';

function LandDetailPage() {
  const { slug } = useParams();
  const listing = landListings.find((item) => item.slug === slug);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

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
  const gallery = listing.gallery?.length ? listing.gallery : [listing.img];

  const shareMessage = [
    `*${listing.name}*`,
    `Location: ${listing.loc}`,
    `${listing.area}`,
    `${listing.label}: ${listing.price}`,
    listing.status ? `Status: ${listing.status}` : null,
    '',
    listing.snapshot?.length ? listing.snapshot.map((line) => `• ${line}`).join('\n') : null,
  ]
    .filter(Boolean)
    .join('\n');

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
              ← All Listings
            </Link>
            <ShareButton
              title={listing.name}
              message={shareMessage}
              label="Share"
              phone={WHATSAPP_NUMBER}
              image={listing.img}
            />
          </div>
          <div
            className="land-card-type"
            style={{
              background: listing.type === 'jv' ? 'var(--steel)' : listing.type === 'plot' ? 'var(--red)' : 'var(--gold)',
              color: listing.type === 'jv' ? 'var(--white)' : listing.type === 'plot' ? 'var(--white)' : 'var(--charcoal)',
              alignSelf: 'flex-start',
            }}
          >
            {listing.badge}
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
        <section className="land-detail-section" id="snapshot">
          <h2 className="land-detail-h">Snapshot</h2>
          <ul className="land-detail-snapshot">
            {(listing.snapshot ?? []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="land-detail-section" id="gallery">
          <h2 className="land-detail-h">Image Gallery</h2>
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

        <section className="land-detail-section" id="media">
          <h2 className="land-detail-h">Media</h2>
          {listing.media?.length > 0 ? (
            <div className="media-grid">
              {listing.media.map((item) => {
                const isMp4 = item.url?.toLowerCase().endsWith('.mp4');
                return (
                  <div key={item.url} className="media-item">
                    <div className="media-frame">
                      {isMp4 ? (
                        <video
                          src={item.url}
                          controls
                          preload="metadata"
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
          <h2 className="land-detail-h">Files &amp; Brochures</h2>
          {listing.files?.length > 0 ? (
            <ul className="files-list">
              {listing.files.map((file) => (
                <li key={file.name}>
                  <a href={file.url} target="_blank" rel="noreferrer" className="file-row">
                    <div className="file-icon">PDF</div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-action">Download</div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="land-detail-empty">No files uploaded yet.</div>
          )}
        </section>

        <section className="land-detail-section" id="description">
          <h2 className="land-detail-h">Description</h2>
          <p className="land-detail-desc">{listing.description}</p>
          {listing.nearestStation ? (
            <p className="land-detail-desc" style={{ marginTop: 14 }}>
              <strong style={{ color: 'var(--gold)' }}>Nearest Train Station:</strong> {listing.nearestStation}
            </p>
          ) : null}
          {listing.status ? (
            <p className="land-detail-desc" style={{ marginTop: 14 }}>
              <strong style={{ color: 'var(--gold)' }}>Status:</strong> {listing.status}
            </p>
          ) : null}
          {listing.specialComments ? (
            <p className="land-detail-desc" style={{ marginTop: 14 }}>
              <strong style={{ color: 'var(--gold)' }}>Special Comments:</strong> {listing.specialComments}
            </p>
          ) : null}
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
            <a href={mapLink} target="_blank" rel="noreferrer" className="btn-outline">
              Open in Google Maps
            </a>
          </div>
        </section>

        <div className="land-detail-cta">
          <Link to="/#contact" className="btn-gold">
            Enquire About This Listing
          </Link>
          <ShareButton
            title={listing.name}
            message={shareMessage}
            label="Share on WhatsApp"
            className="share-btn-lg"
            phone={WHATSAPP_NUMBER}
            image={listing.img}
          />
          <Link to="/land" className="btn-outline">
            Back to All Listings
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandDetailPage;
