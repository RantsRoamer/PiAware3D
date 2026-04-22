// src/aircraft-manager.js

const MAX_AIRCRAFT = 200;

// Manages Cesium entities for live aircraft.
// createEntityFn(viewer, aircraft) → entity
// updateEntityFn(entity, aircraft) → void
export function createAircraftManager(viewer, createEntityFn, updateEntityFn) {
  // hex → { entity, lastSeen: timestamp }
  const tracked = new Map();

  function update(aircraftList) {
    const now = Date.now();
    const valid = aircraftList
      .filter((ac) => ac.lat != null && ac.lon != null)
      .slice(0, MAX_AIRCRAFT);

    for (const ac of valid) {
      const existing = tracked.get(ac.hex);
      if (existing) {
        updateEntityFn(existing.entity, ac);
        existing.lastSeen = now;
      } else {
        const entity = createEntityFn(viewer, ac);
        viewer.entities.add(entity);
        tracked.set(ac.hex, { entity, lastSeen: now });
      }
    }
  }

  function removeStale(staleMs) {
    const now = Date.now();
    for (const [hex, { entity, lastSeen }] of tracked) {
      if (now - lastSeen > staleMs) {
        viewer.entities.remove(entity);
        tracked.delete(hex);
      }
    }
  }

  function clear() {
    for (const { entity } of tracked.values()) {
      viewer.entities.remove(entity);
    }
    tracked.clear();
  }

  function getCount() { return tracked.size; }
  function getTracked() { return tracked; }

  return { update, removeStale, clear, getCount, getTracked };
}
