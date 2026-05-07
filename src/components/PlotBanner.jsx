import { useEffect, useState } from 'react';
import { landBanners as plotBanners } from '../data';

function PlotBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % plotBanners.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="land-banner">
      {plotBanners.map((banner, i) => (
        <div
          key={banner.img}
          className={`land-banner-slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `url(${banner.img})` }}
        >
          <div className="land-banner-overlay" />
          <div className="land-banner-content">
            <div className="section-badge">
              <span>Plots — Sale &amp; Joint Venture</span>
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
        {plotBanners.map((banner, i) => (
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
        onClick={() => setIndex((i) => (i - 1 + plotBanners.length) % plotBanners.length)}
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        className="land-banner-arrow next"
        onClick={() => setIndex((i) => (i + 1) % plotBanners.length)}
        aria-label="Next banner"
      >
        ›
      </button>
    </div>
  );
}

export default PlotBanner;
