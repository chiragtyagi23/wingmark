import { useEffect, useRef, useState } from 'react';

const STATS = [
  { target: 30, suffix: '+', label: 'Years Combined Experience' },
  { target: 6, suffix: '+', label: 'Prime Regions Covered' },
  { target: 3, suffix: '', label: 'Office Locations' },
];

const DURATION_MS = 2600;
const LOADER_BUFFER_MS = 2400;

function StatsBar({ variant = 'default' }) {
  const containerRef = useRef(null);
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let observer;
    let timer;

    const start = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
    };

    timer = window.setTimeout(start, LOADER_BUFFER_MS);

    return () => {
      window.clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!started) return;

    let startTimestamp = null;
    let frameId = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(STATS.map(({ target }) => Math.floor(eased * target)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCounts(STATS.map(({ target }) => target));
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  const shell =
    variant === 'hero'
      ? 'grid grid-cols-4 gap-0 border-t-2 border-gold border-b border-[rgba(247,198,27,0.2)] bg-[rgba(14,56,94,0.78)] px-[5vw] py-5 backdrop-blur-md max-[768px]:grid-cols-2 max-[768px]:py-4 max-[768px]:px-[4vw]'
      : 'grid grid-cols-4 gap-0 border-t-2 border-gold border-b border-[rgba(247,198,27,0.2)] bg-royal px-[5vw] py-7 max-[768px]:grid-cols-2';

  const item =
    'border-r border-white/12 px-5 py-3 text-center last:border-r-0 max-[768px]:[&:nth-child(2n)]:border-r-0';

  const num =
    'mx-auto mb-2.5 inline-flex h-[78px] min-w-[78px] items-center justify-center rounded-full border-0 bg-transparent px-[18px] font-serif text-[32px] font-bold leading-none tracking-wide text-white';

  const label =
    'text-[10px] font-semibold uppercase tracking-[0.16em] text-med-gray';

  return (
    <div className={shell} ref={containerRef}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className={item}>
          <div className={num}>
            {counts[i]}
            {stat.suffix}
          </div>
          <div className={label}>{stat.label}</div>
        </div>
      ))}
      <div className={item}>
        <div className={num}>LLP</div>
        <div className={label}>Incorporated May 2026</div>
      </div>
    </div>
  );
}

export default StatsBar;
