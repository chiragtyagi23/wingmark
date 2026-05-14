function Ticker() {
  const items = [
    'Kharghar Land Opportunities',
    'Panvel Developments',
    'Mumbai 3.0 Investment Corridor',
    'Karjat Premium Plots',
    'Pen & Khopoli Growth Zone',
    'Joint Venture Opportunities',
    'NRI Investment Gateway',
    '30+ Years Combined Expertise',
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-t border-[#e0b015] bg-gold py-2.5">
      <div className="anim-ticker flex w-max gap-[60px] whitespace-nowrap">
        {row.map((label, i) => (
          <div
            key={`${label}-${i}`}
            className="flex shrink-0 items-center gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal after:text-[8px] after:content-['◆']"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ticker;
