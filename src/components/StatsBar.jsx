function StatsBar({ count }) {
  return (
    <div className="stats-bar">
      <div className="stat-item reveal">
        <div className="stat-num">{count > 0 ? `${count}+` : '0+'}</div>
        <div className="stat-label">Years Combined Experience</div>
      </div>
      <div className="stat-item reveal reveal-delay-1">
        <div className="stat-num">6+</div>
        <div className="stat-label">Prime Locations Covered</div>
      </div>
      <div className="stat-item reveal reveal-delay-2">
        <div className="stat-num">4</div>
        <div className="stat-label">Office Locations</div>
      </div>
      <div className="stat-item reveal reveal-delay-3">
        <div className="stat-num">LLP</div>
        <div className="stat-label">Incorporated May 2026</div>
      </div>
    </div>
  );
}

export default StatsBar;
