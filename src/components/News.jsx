import marketNews from '../api/market-news.json';

function News() {
  return (
    <section id="news" className="news-section">
      <div className="news-inner">
        <div className="news-header reveal">
          <div className="section-badge">
            <span>Market News</span>
          </div>
          <h2 className="section-h2">
            What's <em>moving</em> Navi Mumbai
          </h2>
          <p className="section-p" style={{ margin: '0 auto', textAlign: 'center' }}>
            Real-Time Signals from CIDCO, The Airport Corridor and The Commercial Real-Estate Market - Context for every Investor.
          </p>
        </div>

        <div className="news-grid">
          {marketNews.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="news-card reveal"
            >
              <div
                className="news-thumb"
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className="news-source">{item.source}</div>
              </div>
              <div className="news-body">
                <div className="news-meta">
                  <span className="news-tag">{item.tag}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-summary">{item.summary}</p>
                <div className="news-link">Read full article →</div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default News;
