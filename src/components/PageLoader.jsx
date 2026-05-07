function PageLoader({ loaderHidden }) {
  return (
    <div className={`page-loader ${loaderHidden ? 'hidden' : ''}`} id="pageLoader">
      <div className="loader-logo">
        Wingsmark <em>Infraa</em>
      </div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
      <div className="loader-text">Establishing Trust &amp; Value</div>
    </div>
  );
}

export default PageLoader;
