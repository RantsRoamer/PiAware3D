// src/aircraft-entity.js
import {
  Entity,
  Cartesian3,
  Color,
  Math as CesiumMath,
  VerticalOrigin,
  HorizontalOrigin,
  LabelStyle,
  Cartesian2,
  NearFarScalar,
  DistanceDisplayCondition
} from 'cesium';
import { feetToMeters, headingToRotation, altitudeColor } from './utils.js';

// Detailed 64×64 airliner silhouette pointing north (up = nose).
// Wings are swept back, engine nacelles hang below each wing, tail fin at bottom.
const AIRPLANE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- drop shadow -->
  <ellipse cx="32" cy="32" rx="10" ry="6" fill="rgba(0,0,0,0.25)" transform="translate(2,2)"/>
  <!-- fuselage -->
  <ellipse cx="32" cy="32" rx="3.5" ry="20" fill="white" opacity="0.97"/>
  <!-- nose cone -->
  <ellipse cx="32" cy="13" rx="3" ry="5" fill="white" opacity="0.97"/>
  <!-- cockpit window -->
  <ellipse cx="32" cy="15" rx="1.4" ry="2" fill="rgba(160,220,255,0.75)"/>
  <!-- left main wing (swept back) -->
  <polygon points="32,26 8,46 14,47 32,34" fill="white" opacity="0.93"/>
  <!-- right main wing -->
  <polygon points="32,26 56,46 50,47 32,34" fill="white" opacity="0.93"/>
  <!-- left engine nacelle -->
  <ellipse cx="17" cy="43" rx="3" ry="1.6" fill="rgba(200,200,200,0.9)"/>
  <!-- right engine nacelle -->
  <ellipse cx="47" cy="43" rx="3" ry="1.6" fill="rgba(200,200,200,0.9)"/>
  <!-- horizontal stabilizer (tail) -->
  <polygon points="32,49 20,57 23,58 32,52 41,58 44,57" fill="white" opacity="0.88"/>
  <!-- vertical tail fin -->
  <polygon points="32,44 30,57 34,57" fill="white" opacity="0.88"/>
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
      scale: 0.55,
      rotation,
      alignedAxis: Cartesian3.UNIT_Z,
      color,
      verticalOrigin:   VerticalOrigin.CENTER,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(0, 0),
      // Scale down as you zoom in so the icon doesn't overwhelm close-up views
      scaleByDistance: new NearFarScalar(1e3, 0.35, 2e6, 0.9),
      distanceDisplayCondition: new DistanceDisplayCondition(0, 3e6)
    },
    label: {
      text: callsign,
      font: '11px "Segoe UI", system-ui, sans-serif',
      fillColor:    Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style:         LabelStyle.FILL_AND_OUTLINE,
      pixelOffset:   new Cartesian2(0, -22),
      verticalOrigin: VerticalOrigin.BOTTOM,
      showBackground: false,
      distanceDisplayCondition: new DistanceDisplayCondition(0, 1.5e6)
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
