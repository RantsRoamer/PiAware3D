// tests/aircraft-manager.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAircraftManager } from '../src/aircraft-manager.js';

function createMockViewer() {
  const entityMap = new Map();
  return {
    entities: {
      add: (e) => { entityMap.set(e.id, e); return e; },
      remove: (e) => entityMap.delete(e.id),
      getById: (id) => entityMap.get(id) ?? null,
      _map: entityMap
    }
  };
}

function mockCreateEntity(_viewer, aircraft) {
  return { id: aircraft.hex, _data: { ...aircraft } };
}

function mockUpdateEntity(entity, aircraft) {
  entity._data = { ...aircraft };
}

let viewer, manager;
beforeEach(() => {
  viewer = createMockViewer();
  manager = createAircraftManager(viewer, mockCreateEntity, mockUpdateEntity);
});

describe('update', () => {
  it('adds new aircraft with valid lat/lon', () => {
    manager.update([{ hex: 'aaa', lat: 40, lon: -73, alt_baro: 10000 }]);
    expect(manager.getCount()).toBe(1);
  });

  it('skips aircraft without lat/lon', () => {
    manager.update([{ hex: 'bbb', flight: 'UA2' }]);
    expect(manager.getCount()).toBe(0);
  });

  it('updates existing aircraft instead of creating a duplicate', () => {
    const ac = { hex: 'ccc', lat: 40, lon: -73, flight: 'DL1', alt_baro: 5000 };
    manager.update([ac]);
    manager.update([{ ...ac, alt_baro: 6000 }]);
    expect(manager.getCount()).toBe(1);
  });

  it('enforces 200 aircraft maximum', () => {
    const batch = Array.from({ length: 250 }, (_, i) => ({
      hex: `hex${i}`, lat: 40 + i * 0.01, lon: -73 + i * 0.01, alt_baro: 10000
    }));
    manager.update(batch);
    expect(manager.getCount()).toBeLessThanOrEqual(200);
  });
});

describe('removeStale', () => {
  it('removes aircraft not refreshed within staleMs', () => {
    vi.useFakeTimers();
    manager.update([{ hex: 'ddd', lat: 40, lon: -73, alt_baro: 10000 }]);
    vi.advanceTimersByTime(31000);
    manager.removeStale(30000);
    expect(manager.getCount()).toBe(0);
    vi.useRealTimers();
  });

  it('keeps aircraft refreshed within staleMs', () => {
    vi.useFakeTimers();
    const ac = { hex: 'eee', lat: 40, lon: -73, alt_baro: 10000 };
    manager.update([ac]);
    vi.advanceTimersByTime(15000);
    manager.update([ac]); // refresh lastSeen
    vi.advanceTimersByTime(20000); // 20s since refresh, under the 30s limit
    manager.removeStale(30000);
    expect(manager.getCount()).toBe(1);
    vi.useRealTimers();
  });
});

describe('clear', () => {
  it('removes all tracked aircraft', () => {
    manager.update([
      { hex: 'f1', lat: 40, lon: -73, alt_baro: 10000 },
      { hex: 'f2', lat: 41, lon: -72, alt_baro: 20000 }
    ]);
    manager.clear();
    expect(manager.getCount()).toBe(0);
  });
});
