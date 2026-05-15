function PageLoader({ loaderHidden }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal px-6 transition-opacity duration-[600ms] ease-out ${
        loaderHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      id="pageLoader"
    >
      <div className="flex w-full max-w-[min(100%,420px)] flex-col items-center text-center">
        <div className="mb-10 flex w-full flex-col items-center gap-1 leading-none">
          <span className="font-serif text-[clamp(14px,3.5vw,20px)] font-medium italic tracking-[0.14em] text-white/90">
            The
          </span>
          <span className="font-serif text-[clamp(36px,10vw,56px)] font-light tracking-[0.08em] text-white">
            Wingsmark{' '}
            <em className="not-italic text-gold">Infraa</em>
          </span>
        </div>

        <div className="relative mb-6 h-1 w-[min(240px,70vw)] overflow-hidden rounded-full bg-[rgba(247,198,27,0.15)]">
          <div className="anim-load-bar absolute left-0 top-0 h-full rounded-full bg-gold" />
        </div>

        <p className="m-0 text-[9px] uppercase tracking-[0.3em] text-white/55">
          Establishing Trust &amp; Value
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
