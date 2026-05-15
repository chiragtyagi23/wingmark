import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const STATS = [
  { target: 30, suffix: '+', label: 'Years Combined Experience' },
  { target: 6, suffix: '+', label: 'Prime Regions Covered' },
  { target: 3, suffix: '', label: 'Office Locations' },
  { type: 'text', value: 'LLP', label: 'Incorporated May 2026' },
];

const ANIMATED_STATS = STATS.filter((s) => s.target != null);

const DURATION_MS = 2600;
const LOADER_BUFFER_MS = 2400;

/** Borders on first three cells only — one vertical + one horizontal line at the center */
function statCellClass(index) {
  return clsx(
    'px-3 py-1.5 text-center',
    index === 0 && 'border-r border-b border-white/20',
    index === 1 && 'border-b border-white/20',
    index === 2 && 'border-r border-white/20'
  );
}

function StatsBar({ variant = 'default' }) {
  const containerRef = useRef(null);
  const [counts, setCounts] = useState(() => ANIMATED_STATS.map(() => 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (variant === 'hero') {
      const timer = window.setTimeout(() => setStarted(true), LOADER_BUFFER_MS);
      return () => window.clearTimeout(timer);
    }

    const node = containerRef.current;
    if (!node) return undefined;

    let observer;
    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(node);
    }, LOADER_BUFFER_MS);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [variant]);

  useEffect(() => {
    if (!started) return undefined;

    let startTimestamp = null;
    let frameId = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCounts(ANIMATED_STATS.map(({ target }) => Math.floor(eased * target)));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCounts(ANIMATED_STATS.map(({ target }) => target));
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  const shell =
    variant === 'hero'
      ? 'grid grid-cols-2 gap-0 border-t border-gold border-b border-[rgba(247,198,27,0.2)] bg-[rgba(14,56,94,0.78)] px-[4vw] py-2.5 backdrop-blur-md max-[768px]:py-2 max-[768px]:px-[3vw]'
      : 'grid grid-cols-2 gap-0 border-t border-gold border-b border-[rgba(247,198,27,0.2)] bg-royal px-[4vw] py-3 max-[768px]:py-2.5';

  const num =
    'mx-auto mb-1 inline-flex min-h-0 min-w-0 items-center justify-center font-sans text-xl font-bold leading-none tracking-wide text-white max-[768px]:text-lg';

  const label =
    'text-[8px] font-semibold uppercase leading-tight tracking-[0.14em] text-white max-[768px]:text-[7.5px]';

  return (
    <div className={shell} ref={containerRef}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className={statCellClass(i)}>
          <div className={num}>
            {stat.type === 'text' ? stat.value : `${counts[i]}${stat.suffix}`}
          </div>
          <div className={label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
