// src/utils.js

// Converts feet to meters, clamped to 0 (no underground positions).
export function feetToMeters(feet) {
  if (feet < 0) return 0;
  return feet * 0.3048;
}

// Converts aircraft track (0-360° clockwise from north) to Cesium billboard
// rotation (counter-clockwise in radians). The SVG icon points north at rotation=0.
export function headingToRotation(trackDeg) {
  return -((trackDeg * Math.PI) / 180);
}

// Returns a CSS hex color string for the given altitude bracket.
export function altitudeColor(altFeet) {
  if (altFeet < 5000)  return '#00ff88'; // ground / low
  if (altFeet < 15000) return '#ffff00'; // mid-low
  if (altFeet < 25000) return '#ff8800'; // mid
  if (altFeet < 35000) return '#ff4444'; // high
  return '#ff00ff';                       // very high
}

// Haversine great-circle distance in kilometers.
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Formats altitude for display. PiAware uses the string "ground" for surface aircraft.
export function formatAltitude(alt) {
  if (alt === 'ground' || alt === 0) return 'Ground';
  return `${Number(alt).toLocaleString()} ft`;
}

// Formats vertical rate with direction arrow. Rates under 50 fpm are shown as level.
export function formatVerticalRate(fpm) {
  if (!fpm || Math.abs(fpm) < 50) return 'Level';
  const sign = fpm > 0 ? '+' : '';
  const arrow = fpm > 0 ? '↑' : '↓';
  return `${sign}${fpm} fpm ${arrow}`;
}

// Trims trailing spaces from ADS-B callsign strings.
export function trimCallsign(callsign) {
  return callsign ? callsign.trim() : '';
}
