import plotBanners from '../api/plot-banners.json';

const defaultBanner = {
  title: 'PLOTS <em>FOR SALE &amp; JV</em>',
  sub: 'Curated plot parcels with title clarity, access roads and clear development stages.',
};

function PlotBanner() {
  const banner = plotBanners[0] ?? defaultBanner;

  return (
    <header className="listing-page-header">
      <div className="listing-page-header-inner">
        <div className="section-badge">
          <span>Plot Listings</span>
        </div>
        <h1
          className="listing-page-header-title"
          dangerouslySetInnerHTML={{ __html: banner.title }}
        />
        <p className="listing-page-header-sub" dangerouslySetInnerHTML={{ __html: banner.sub }} />
      </div>
    </header>
  );
}

export default PlotBanner;
