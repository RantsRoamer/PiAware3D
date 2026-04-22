// Static dataset of NY-area airports with approximate FAA airspace sectors.
// Sector radii and altitudes are simplified from published VFR sectional charts
// and are intended for visual reference only — not for navigation.

export const NY_AREA_AIRPORTS = [
  // ── Class B (NYC Metroplex) ────────────────────────────────────────────────
  {
    icao: 'KJFK', iata: 'JFK',
    name: 'John F. Kennedy Intl',
    lat: 40.6413, lon: -73.7781,
    airspaceClass: 'B',
    sectors: [
      { radiusNm: 5,  floorFt: 0,    ceilingFt: 7000 },
      { radiusNm: 10, floorFt: 1500, ceilingFt: 7000 },
      { radiusNm: 20, floorFt: 3000, ceilingFt: 7000 },
    ]
  },
  {
    icao: 'KLGA', iata: 'LGA',
    name: 'LaGuardia Airport',
    lat: 40.7772, lon: -73.8726,
    airspaceClass: 'B',
    sectors: [
      { radiusNm: 5,  floorFt: 0,    ceilingFt: 7000 },
      { radiusNm: 10, floorFt: 1500, ceilingFt: 7000 },
    ]
  },
  {
    icao: 'KEWR', iata: 'EWR',
    name: 'Newark Liberty Intl',
    lat: 40.6895, lon: -74.1745,
    airspaceClass: 'B',
    sectors: [
      { radiusNm: 5,  floorFt: 0,    ceilingFt: 7000 },
      { radiusNm: 10, floorFt: 1500, ceilingFt: 7000 },
    ]
  },

  // ── Class C ───────────────────────────────────────────────────────────────
  {
    icao: 'KISP', iata: 'ISP',
    name: 'Long Island MacArthur',
    lat: 40.7952, lon: -73.1002,
    airspaceClass: 'C',
    sectors: [
      { radiusNm: 5,  floorFt: 0,    ceilingFt: 4000 },
      { radiusNm: 10, floorFt: 1200, ceilingFt: 4000 },
    ]
  },
  {
    icao: 'KHPN', iata: 'HPN',
    name: 'Westchester County',
    lat: 41.0670, lon: -73.7076,
    airspaceClass: 'C',
    sectors: [
      { radiusNm: 5,  floorFt: 0,    ceilingFt: 3500 },
      { radiusNm: 10, floorFt: 1300, ceilingFt: 3500 },
    ]
  },

  // ── Class D ───────────────────────────────────────────────────────────────
  {
    icao: 'KFRG', iata: '',
    name: 'Republic Airport',
    lat: 40.7288, lon: -73.4136,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.3, floorFt: 0, ceilingFt: 2500 }]
  },
  {
    icao: 'KTEB', iata: 'TEB',
    name: 'Teterboro Airport',
    lat: 40.8501, lon: -74.0608,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 3.8, floorFt: 0, ceilingFt: 1500 }]
  },
  {
    icao: 'KFOK', iata: '',
    name: 'Francis S. Gabreski',
    lat: 40.8437, lon: -72.6318,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.3, floorFt: 0, ceilingFt: 2500 }]
  },
  {
    icao: 'KHTO', iata: '',
    name: 'East Hampton',
    lat: 40.9596, lon: -72.2518,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.1, floorFt: 0, ceilingFt: 2500 }]
  },
  {
    icao: 'KBDR', iata: 'BDR',
    name: 'Igor Sikorsky Memorial',
    lat: 41.1635, lon: -73.1262,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.3, floorFt: 0, ceilingFt: 2500 }]
  },
  {
    icao: 'KSWF', iata: 'SWF',
    name: 'NY Stewart Intl',
    lat: 41.5041, lon: -74.1048,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.3, floorFt: 0, ceilingFt: 2800 }]
  },
  {
    icao: 'KCDW', iata: '',
    name: 'Essex County Airport',
    lat: 40.8752, lon: -74.2814,
    airspaceClass: 'D',
    sectors: [{ radiusNm: 4.0, floorFt: 0, ceilingFt: 2500 }]
  },
];
