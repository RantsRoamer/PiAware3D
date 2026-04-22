// tests/utils.test.js
import { describe, it, expect } from 'vitest';
import {
  feetToMeters,
  headingToRotation,
  altitudeColor,
  haversineKm,
  formatAltitude,
  formatVerticalRate,
  trimCallsign
} from '../src/utils.js';

describe('feetToMeters', () => {
  it('converts 0 feet to 0 meters', () => expect(feetToMeters(0)).toBe(0));
  it('converts 3281 feet to approx 1000 meters', () => {
    expect(feetToMeters(3281)).toBeCloseTo(1000, 0);
  });
  it('returns 0 for negative altitude (ground)', () => {
    expect(feetToMeters(-100)).toBe(0);
  });
});

describe('headingToRotation', () => {
  it('north (0°) returns 0 radians', () => {
    expect(headingToRotation(0)).toBeCloseTo(0, 5);
  });
  it('east (90°) returns -PI/2 radians', () => {
    expect(headingToRotation(90)).toBeCloseTo(-Math.PI / 2, 5);
  });
  it('south (180°) returns -PI radians', () => {
    expect(headingToRotation(180)).toBeCloseTo(-Math.PI, 5);
  });
});

describe('altitudeColor', () => {
  it('returns ground color for 0 ft', () => expect(altitudeColor(0)).toBe('#00ff88'));
  it('returns low color for 3000 ft', () => expect(altitudeColor(3000)).toBe('#00ff88'));
  it('returns mid-low color for 10000 ft', () => expect(altitudeColor(10000)).toBe('#ffff00'));
  it('returns mid color for 20000 ft', () => expect(altitudeColor(20000)).toBe('#ff8800'));
  it('returns high color for 30000 ft', () => expect(altitudeColor(30000)).toBe('#ff4444'));
  it('returns very high color for 40000 ft', () => expect(altitudeColor(40000)).toBe('#ff00ff'));
});

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    expect(haversineKm(40, -73, 40, -73)).toBe(0);
  });
  it('returns approx 111 km per degree latitude', () => {
    expect(haversineKm(0, 0, 1, 0)).toBeCloseTo(111, 0);
  });
});

describe('formatAltitude', () => {
  it('formats "ground" string as "Ground"', () => {
    expect(formatAltitude('ground')).toBe('Ground');
  });
  it('formats number with commas and ft suffix', () => {
    expect(formatAltitude(35000)).toBe('35,000 ft');
  });
});

describe('formatVerticalRate', () => {
  it('shows climbing for positive rate', () => {
    expect(formatVerticalRate(500)).toBe('+500 fpm ↑');
  });
  it('shows descending for negative rate', () => {
    expect(formatVerticalRate(-300)).toBe('-300 fpm ↓');
  });
  it('returns "Level" for 0', () => {
    expect(formatVerticalRate(0)).toBe('Level');
  });
  it('returns "Level" for small rates (< 50 fpm)', () => {
    expect(formatVerticalRate(40)).toBe('Level');
  });
});

describe('trimCallsign', () => {
  it('trims trailing whitespace', () => {
    expect(trimCallsign('UAL123  ')).toBe('UAL123');
  });
  it('returns empty string for undefined', () => {
    expect(trimCallsign(undefined)).toBe('');
  });
});
