// src/trails.js — Per-aircraft polyline trail manager.
import {
  Entity,
  PolylineGlowMaterialProperty,
  Color,
  Cartesian3,
  CallbackProperty
} from 'cesium';
import { feetToMeters } from './utils.js';

const MAX_TRAIL_POINTS = 120; // 2 minutes at 1 Hz

export function createTrailManager(viewer) {
  // hex → { entity, positions: Cartesian3[] }
  const trails = new Map();
  let enabled  = false;

  function addPoint(aircraft) {
    if (!enabled || aircraft.lat == null || aircraft.lon == null) return;
    const altM = feetToMeters(aircraft.alt_baro ?? aircraft.alt_geom ?? 0);
    const pos  = Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, Math.max(altM, 10));

    if (!trails.has(aircraft.hex)) {
      const positions = [pos];
      const entity = viewer.entities.add(new Entity({
        id: `trail_${aircraft.hex}`,
        polyline: {
          positions: new CallbackProperty(() => positions, false),
          width: 1.5,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.15,
            color: Color.fromCssColorString('#4fc3f7').withAlpha(0.45)
          }),
          clampToGround: false
        }
      }));
      trails.set(aircraft.hex, { entity, positions });
    } else {
      const trail = trails.get(aircraft.hex);
      trail.positions.push(pos);
      if (trail.positions.length > MAX_TRAIL_POINTS) trail.positions.shift();
    }
  }

  function removeTrail(hex) {
    const trail = trails.get(hex);
    if (trail) {
      viewer.entities.remove(trail.entity);
      trails.delete(hex);
    }
  }

  function clearAll() {
    for (const hex of [...trails.keys()]) removeTrail(hex);
  }

  function setEnabled(val) {
    enabled = val;
    if (!val) clearAll();
  }

  return { addPoint, removeTrail, clearAll, setEnabled };
}
