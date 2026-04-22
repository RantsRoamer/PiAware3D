// src/aircraft-entity.js
import {
  Entity,
  Cartesian3,
  Color,
  Math as CesiumMath,
  VerticalOrigin,
  HorizontalOrigin,
  LabelStyle,
  Cartesian2
} from 'cesium';
import { feetToMeters, headingToRotation, altitudeColor } from './utils.js';

// SVG airplane icon pointing north. Kept inline to avoid asset loading issues.
const AIRPLANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2 L15.5 9.5 L22 12 L15.5 14.5 L14 22 L12 20 L10 22 L8.5 14.5 L2 12 L8.5 9.5 Z"
        fill="white" opacity="0.95" stroke="rgba(0,0,0,0.4)" stroke-width="0.5"/>
</svg>`;
const AIRPLANE_ICON = `data:image/svg+xml,${encodeURIComponent(AIRPLANE_SVG)}`;

// PiAware emits the string "ground" for alt_baro when aircraft are on the surface.
// Coerce to 0 so feetToMeters and altitudeColor receive a number.
function numericAlt(alt) {
  return typeof alt === 'number' ? alt : 0;
}

function cssColorToCesium(hex) {
  const h = hex.replace('#', '');
  return new Color(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
    1.0
  );
}

function position(aircraft) {
  const altFeet = numericAlt(aircraft.alt_baro ?? aircraft.alt_geom ?? 0);
  return Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, Math.max(feetToMeters(altFeet), 10));
}

// Creates a new Cesium Entity for an aircraft record.
// Stores raw aircraft data in entity._ac for popup retrieval.
export function createAircraftEntity(_viewer, aircraft) {
  const callsign = (aircraft.flight?.trim() || aircraft.hex) ?? aircraft.hex;
  const color    = cssColorToCesium(altitudeColor(numericAlt(aircraft.alt_baro ?? 0)));
  const rotation = headingToRotation(aircraft.track ?? 0);

  const entity = new Entity({
    id: aircraft.hex,
    position: position(aircraft),
    billboard: {
      image: AIRPLANE_ICON,
      scale: 1.3,
      rotation,
      alignedAxis: Cartesian3.UNIT_Z,
      color,
      verticalOrigin:   VerticalOrigin.CENTER,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(0, 0)
    },
    label: {
      text: callsign,
      font: '11px "Segoe UI", system-ui, sans-serif',
      fillColor:    Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style:         LabelStyle.FILL_AND_OUTLINE,
      pixelOffset:   new Cartesian2(0, -20),
      verticalOrigin: VerticalOrigin.BOTTOM,
      showBackground: false
    }
  });

  // Store raw data directly so popup can read it without Cesium's property timing API
  entity._ac = aircraft;
  return entity;
}

// Updates an existing entity with fresh aircraft data.
export function updateAircraftEntity(entity, aircraft) {
  entity.position  = position(aircraft);
  const color      = cssColorToCesium(altitudeColor(numericAlt(aircraft.alt_baro ?? 0)));
  entity.billboard.rotation = headingToRotation(aircraft.track ?? 0);
  entity.billboard.color    = color;
  entity.label.text         = (aircraft.flight?.trim() || aircraft.hex) ?? aircraft.hex;
  entity._ac                = aircraft;
}
