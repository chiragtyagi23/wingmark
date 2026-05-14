function PageLoader({ loaderHidden }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-charcoal transition-opacity duration-[600ms] ease-out ${
        loaderHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      id="pageLoader"
    >
      <div className="px-5 text-center font-serif text-[clamp(42px,12vw,64px)] font-light tracking-[0.1em] text-white">
        <div className="text-[0.55em] font-medium italic tracking-[0.12em]">The</div>
        Wingsmark <em className="italic text-gold">Infraa</em>
      </div>
      <div className="relative h-px w-[200px] overflow-hidden bg-[rgba(247,198,27,0.15)]">
        <div className="anim-load-bar absolute left-0 top-0 h-full bg-gold" />
      </div>
      <div className="text-[9px] uppercase tracking-[0.3em] text-dark-gray">
        Establishing Trust &amp; Value
      </div>
    </div>
  );
}

export default PageLoader;
