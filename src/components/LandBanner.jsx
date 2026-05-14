import { useEffect, useState } from 'react';
import landBanners from '../api/land-banners.json';

function LandBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (landBanners.length === 0) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % landBanners.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  if (landBanners.length === 0) return <div className="land-banner" />;

  return (
    <div className="land-banner">
      {landBanners.map((banner, i) => (
        <div
          key={banner.img}
          className={`land-banner-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${banner.img})` }}
        >
          <div className="land-banner-overlay" />
          <div className="land-banner-content">
            <div className="section-badge">
              <span>Featured Land Opportunity</span>
            </div>
            <h1
              className="land-banner-title"
              dangerouslySetInnerHTML={{ __html: banner.title }}
            />
            <p
              className="land-banner-sub"
              dangerouslySetInnerHTML={{ __html: banner.sub }}
            />
          </div>
        </div>
      ))}

      <div className="land-banner-dots">
        {landBanners.map((banner, i) => (
          <button
            key={banner.img}
            className={`land-banner-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Show banner ${i + 1}`}
          />
        ))}
      </div>

      <button
        className="land-banner-arrow prev"
        onClick={() => setIndex((i) => (i - 1 + landBanners.length) % landBanners.length)}
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        className="land-banner-arrow next"
        onClick={() => setIndex((i) => (i + 1) % landBanners.length)}
        aria-label="Next banner"
      >
        ›
      </button>
    </div>
  );
}

export default LandBanner;
