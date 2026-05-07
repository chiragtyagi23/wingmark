export const landBanners = [
  {
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
    title: 'Mumbai 3.0 — The Next Growth Frontier',
    sub: 'Premium land parcels along Navi Mumbai International Airport corridor',
  },
  {
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&q=80',
    title: 'Karjat Eco-Resort Plots',
    sub: 'Bungalow plots set in nature, just a drive from Mumbai',
  },
  {
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80',
    title: 'NAINA Influence Zone',
    sub: 'High-growth corridor with airport-led commercial potential',
  },
  {
    img: 'https://images.unsplash.com/photo-1623018035782-b269248df916?w=1600&q=80',
    title: 'Industrial &amp; Logistics Belt',
    sub: 'Khopoli and Pen — strategic highway-access parcels',
  },
  {
    img: 'https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=1600&q=80',
    title: 'Joint Venture Opportunities',
    sub: 'Partner with Wingsmark for landmark developments',
  },
];

export const landCategories = [
  { id: 'all', label: 'All Listings' },
  { id: 'budget', label: 'Budget' },
  { id: 'affordable', label: 'Affordable' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'premium', label: 'Premium' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'bungalow', label: 'Bungalow Plots' },
];

export const landListings = [
  {
    slug: 'rohinjan-premium-land-sale',
    type: 'sale',
    category: 'premium',
    img: '/rohinjan-grid-map.png',
    loc: 'Sector 37 next to Rainbow Life',
    name: 'Premium Land for Sale at Rohinjan near Amandoot metro station',
    area: 'Total Land Area: 6 Acres',
    label: 'Price',
    price: '₹ 1 Lakh per sq mtr',
    badge: 'For Sale',
    snapshot: [
      'Suitable for Residential complex / Mixed use development with commercial shops and offices.',
      'Excellent opportunity for development with ready market demand.',
    ],
    gallery: [
      '/rohinjan-location.png',
    ],
    media: [
      {
        title: 'WhatsApp Video (2)',
        url: '/wardoli-media-1.mp4',
        kind: 'video',
      },
      {
        title: 'WhatsApp Video (1)',
        url: '/wardoli-media-2.mp4',
        kind: 'video',
      },
      {
        title: 'WhatsApp Video',
        url: '/wardoli-media-3.mp4',
        kind: 'video',
      },
    ],
    files: [
      { name: 'Project Brochure.pdf', url: '#' },
      { name: 'Title Documents.pdf', url: '#' },
    ],
    description:
      'This is a prime land parcel available for sale and is ideal for developers, builders and investors who want to trade in short term. The plot is strategically placed at Rohinjan near Amandoot metro station and offers strong potential for residential or mixed-use development.',
    status: 'Clear title single investor deal',
    locationImage: '/rohinjan-location.png',
    location: { lat: 19.0318, lng: 73.1046, address: 'Sector 37, Rohinjan, near Rainbow Life' },
  },
  {
    slug: 'upper-kharghar-jv-dhansar',
    type: 'jv',
    category: 'affordable',
    img: '/dhansar-listing.jpg',
    loc: 'Village Dhansar · Near Shilphata - Kharghar Highway',
    name: 'JV Proposal with building plans and feasibility report at Upper Kharghar',
    area: 'Total Area: 131 Guntha · Ratio: 60:40',
    label: 'On amount',
    price: '₹ 10 Cr (non refundable)',
    badge: 'Joint Venture',
    snapshot: [
      'Suitable for entry level developers.',
      'Low risk affordable market with increasing demand due to infrastructure improvement.',
    ],
    gallery: [
      '/dhansar-listing.jpg',
    ],
    media: [],
    files: [
      {
        name: 'DHANSAR 131 GUNTHE FEASIBILITY REPORT.pdf',
        url: '/dhansar-131-gunthe-feasibility-report.pdf',
      },
      {
        name: 'DHANSAR 173 PODIUM Model.pdf',
        url: '/dhansar-173-podium-model.pdf',
      },
    ],
    description:
      'JV proposal with building plans and feasibility report at Upper Kharghar, located at Village Dhansar near the Shilphata - Kharghar Highway. The parcel is positioned for affordable demand-led growth and is suitable for entry-level developers seeking a low-risk development opportunity.',
    status: 'Clear title single investor deal',
    location: { lat: 19.0284, lng: 73.153, address: 'Village Dhansar, Upper Kharghar' },
  },
  {
    slug: 'rohinjan-kharghar-premium-sale',
    type: 'sale',
    category: 'luxury',
    img: '/rohinjan-location.png',
    loc: 'Village Rohinjan · Close to Sector 37 · Near Reliance BP petrol pump / Clan City',
    name: 'Premium Land for Sale at Rohinjan (Kharghar)',
    area: 'Total Area: 8.25 Acres',
    label: 'Price',
    price: '₹ 1 L per sq mtr (Negotiable on prompt payment)',
    badge: 'For Sale',
    snapshot: [
      'Suitable for mixed-use development and established brands with strong track record.',
      'Strong demand from luxury and aspiring housing segment with limited niche competition.',
    ],
    gallery: [
      '/rohinjan-grid-map.png',
    ],
    media: [],
    files: [
      {
        name: 'Rohinjan original New DP Final Grid_A1.pdf',
        url: '/rohinjan-new-dp-final-grid-a1.pdf',
      },
      {
        name: 'Rohinjan - 10 and 11 map.pdf',
        url: '/rohinjan-10-11-map.pdf',
      },
    ],
    description:
      'This is a prime land parcel on a 24 mtr access road and is ideal for developers, builders and investors looking for good returns from fast sales. The location is in Rohinjan, close to Sector 37 and near Reliance BP petrol pump / Clan City.',
    nearestStation: '1.5 km from Amandoot metro station',
    status: 'Clear title in R zone of Panvel Municipal Corporation',
    specialComments:
      'Prime land parcel on 24 mtr access road, suitable for fast-moving development with strong end-user and investor demand.',
    locationImage: '/rohinjan-grid-map.png',
    location: { lat: 19.0318, lng: 73.1046, address: 'Village Rohinjan, Kharghar' },
  },
  {
    slug: 'panvel-wardoli-mountain-facing',
    type: 'sale',
    category: 'premium',
    img: '/wardoli-location-1.png',
    loc: 'Village Wardoli · Near Wadhwa Wise City',
    name: 'Prime Mountain facing land for sale at Panvel',
    area: 'Total 20 Acres (R zone: approx 13 acres, Green zone: approx 7 acres)',
    label: 'Price',
    price: '₹ 60 Cr',
    badge: 'For Sale',
    snapshot: [
      'Suitable for township / mixed-use development, NA plotting, premium bungalows and row houses.',
      'Top developers like Wadhwa, Godrej and Hiranandani already have possession-ready township projects nearby.',
    ],
    gallery: [
      '/wardoli-location-1.png',
      '/wardoli-location-2.png',
      '/wardoli-location-3.png',
    ],
    media: [],
    files: [
      { name: 'Gat Book map.pdf', url: '/wardoli-gat-book-map.pdf' },
      { name: '7-12. Ferfar.pdf', url: '/wardoli-7-12-ferfar.pdf' },
      { name: 'Wardoli-Bhingarwadi Naina area.pdf', url: '/wardoli-bhingarwadi-naina-area.pdf' },
    ],
    description:
      'This location has excellent connectivity and promising infrastructure development. Old Mumbai Pune Highway is around 3 km away, while top universities, upcoming mall and hospital are available within a 5 km radius.',
    nearestStation:
      'Upcoming Mohape station on Panvel-Karjat rail corridor (1.5 km) and Panvel Railway Station (10 km)',
    status: 'Clear title single investor deal',
    specialComments:
      'Excellent connectivity with strong infrastructure pipeline and proven developer ecosystem in the micro-market.',
    locationImage: '/wardoli-location-1.png',
    googleLocationUrl: 'https://maps.app.goo.gl/ueeHTgaq7vpVfhjx6',
    location: { lat: 19.0227, lng: 73.2045, address: 'Village Wardoli, Panvel' },
  },
  // {
  //   slug: 'khopoli-industrial-jv',
  //   type: 'jv',
  //   category: 'commercial',
  //   img: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=600&q=80',
  //   loc: 'Khopoli, Industrial Belt',
  //   name: 'Industrial & Logistics Land — JV Ready',
  //   area: 'Area: 25,000 sq. mt. · Highway Access',
  //   label: 'JV Opportunity',
  //   price: '₹ Discuss Terms',
  //   badge: 'Joint Venture',
  //   snapshot: [
  //     'Direct Mumbai-Pune Expressway access for logistics and warehousing.',
  //     'Open to JV with industrial developers and logistics operators.',
  //   ],
  //   gallery: [
  //     'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1623018035782-b269248df916?w=1200&q=80',
  //   ],
  //   media: [],
  //   files: [{ name: 'Site Plan.pdf', url: '#' }],
  //   description:
  //     'A 25,000 sq. mt. industrial-zoned parcel in the Khopoli belt with direct Mumbai-Pune Expressway access. Ideal for logistics parks, warehousing, or light industrial developments. Open to structured joint ventures.',
  //   location: { lat: 18.785, lng: 73.343, address: 'Khopoli, Raigad' },
  // },
  // {
  //   slug: 'navi-mumbai-villa-township',
  //   type: 'plot',
  //   category: 'luxury',
  //   img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
  //   loc: 'Navi Mumbai, Sector 22',
  //   name: 'Premium Villa Township — Mumbai 3.0 Edition',
  //   area: 'Plots: 1,500–5,000 sq. ft. · All Amenities',
  //   label: 'Starting From',
  //   price: '₹ 55 L / plot',
  //   badge: 'Villa Plotting',
  //   snapshot: [
  //     'Gated villa township with clubhouse, pool and landscaped gardens.',
  //     'Plots from 1,500 to 5,000 sq. ft. — fully serviced and RERA-cleared.',
  //   ],
  //   gallery: [
  //     'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
  //     'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
  //   ],
  //   media: [],
  //   files: [
  //     { name: 'Township Brochure.pdf', url: '#' },
  //     { name: 'Amenities List.pdf', url: '#' },
  //   ],
  //   description:
  //     'A premium gated villa township in Navi Mumbai\'s Sector 22 with plots ranging 1,500–5,000 sq. ft. Comes with a clubhouse, pool, landscaped gardens, dedicated security and full utility servicing. RERA cleared and ready for villa construction.',
  //   location: { lat: 19.034, lng: 73.029, address: 'Sector 22, Navi Mumbai' },
  // },
];

export const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { to: '/land', label: 'Land' },
  { href: '/#locations', label: 'Locations' },
  { href: '/#investor', label: 'Investors / NRI' },
  { href: '/#team', label: 'Team' },
  { href: '/#contact', label: 'Contact Us', cta: true },
];
