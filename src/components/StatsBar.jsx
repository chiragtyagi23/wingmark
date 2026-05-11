import { useEffect, useRef, useState } from 'react';

const STATS = [
  { target: 30, suffix: '+', label: 'Years Combined Experience' },
  { target: 6, suffix: '+', label: 'Prime Regions Covered' },
  { target: 3, suffix: '', label: 'Office Locations' },
];

const DURATION_MS = 2600;
const LOADER_BUFFER_MS = 2400;

function StatsBar() {
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

  return (
    <div className="stats-bar" ref={containerRef}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className="stat-item">
          <div className="stat-num">
            {counts[i]}
            {stat.suffix}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
      <div className="stat-item">
        <div className="stat-num">LLP</div>
        <div className="stat-label">Incorporated May 2026</div>
      </div>
    </div>
  );
}

export default StatsBar;
