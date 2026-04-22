import {
  Entity,
  Cartesian3,
  Color,
  LabelStyle,
  VerticalOrigin,
  HorizontalOrigin,
  Cartesian2,
  DistanceDisplayCondition
} from 'cesium';

const NM_TO_M  = 1852;
const FT_TO_M  = 0.3048;

// Airspace class colors matching VFR sectional chart conventions
const CLASS_COLOR = {
  B: Color.fromCssColorString('#1e88e5'), // blue
  C: Color.fromCssColorString('#ab47bc'), // magenta/purple
  D: Color.fromCssColorString('#29b6f6'), // light blue
};

const ICON_DOT_COLOR = {
  B: '#64b5f6',
  C: '#ce93d8',
  D: '#81d4fa',
};

function airportIcon(cls) {
  const dot = ICON_DOT_COLOR[cls] ?? '#ffffff';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36">
    <circle cx="18" cy="18" r="16" fill="rgba(8,14,24,0.82)" stroke="${dot}" stroke-width="1.8"/>
    <rect x="16" y="4"  width="4" height="28" rx="1.5" fill="${dot}" opacity="0.95"/>
    <rect x="4"  y="16" width="28" height="4" rx="1.5" fill="${dot}" opacity="0.95"/>
    <rect x="8"  y="24" width="20" height="3" rx="1.2" fill="${dot}" opacity="0.7"/>
    <circle cx="29" cy="7" r="7" fill="${dot}"/>
    <text x="29" y="10.5" text-anchor="middle" font-size="8.5" fill="#000810"
          font-family="'Segoe UI',system-ui,sans-serif" font-weight="800">${cls}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Adds one airport: a billboard + label + airspace cylinders for each sector.
function addAirport(viewer, airport) {
  const entities = [];
  const color = CLASS_COLOR[airport.airspaceClass] ?? Color.WHITE;
  const icon  = airportIcon(airport.airspaceClass);

  // Marker
  const marker = viewer.entities.add(new Entity({
    id: `airport-${airport.icao}`,
    position: Cartesian3.fromDegrees(airport.lon, airport.lat, 15),
    billboard: {
      image: icon,
      scale: 0.85,
      verticalOrigin:   VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER,
      distanceDisplayCondition: new DistanceDisplayCondition(0, 600_000),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },
    label: {
      text: `${airport.icao}${airport.iata ? ' / ' + airport.iata : ''}\n${airport.name}`,
      font: '11px "Segoe UI", system-ui, sans-serif',
      fillColor:    Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style:         LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin:   VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset:   new Cartesian2(0, -42),
      showBackground: true,
      backgroundColor: Color.fromCssColorString('#0c1520').withAlpha(0.82),
      backgroundPadding: new Cartesian2(6, 4),
      distanceDisplayCondition: new DistanceDisplayCondition(0, 350_000),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  }));
  entities.push(marker);

  // Airspace sectors (3D cylinders)
  for (const sector of airport.sectors) {
    const floorM   = sector.floorFt * FT_TO_M;
    const ceilingM = sector.ceilingFt * FT_TO_M;
    const radiusM  = sector.radiusNm * NM_TO_M;

    const cylinder = viewer.entities.add(new Entity({
      id: `airspace-${airport.icao}-r${sector.radiusNm}`,
      position: Cartesian3.fromDegrees(airport.lon, airport.lat, floorM),
      ellipse: {
        semiMajorAxis: radiusM,
        semiMinorAxis: radiusM,
        height:         floorM,
        extrudedHeight: ceilingM,
        material:    color.withAlpha(0.07),
        outline:     true,
        outlineColor: color.withAlpha(0.70),
        outlineWidth: 1.5
      }
    }));
    entities.push(cylinder);

    // Altitude label at the outer edge of each ring
    const altLabel = viewer.entities.add(new Entity({
      id: `airspace-label-${airport.icao}-r${sector.radiusNm}`,
      position: Cartesian3.fromDegrees(
        airport.lon + sector.radiusNm * 0.0145,  // ~1 NM east in degrees
        airport.lat,
        ceilingM
      ),
      label: {
        text: `${sector.floorFt === 0 ? 'SFC' : sector.floorFt.toLocaleString()}–${sector.ceilingFt.toLocaleString()} ft\n${sector.radiusNm} NM`,
        font: '10px "Segoe UI", system-ui, sans-serif',
        fillColor: color.withAlpha(0.95),
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: LabelStyle.FILL_AND_OUTLINE,
        showBackground: true,
        backgroundColor: Color.fromCssColorString('#0c1520').withAlpha(0.75),
        backgroundPadding: new Cartesian2(4, 3),
        distanceDisplayCondition: new DistanceDisplayCondition(0, 250_000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    }));
    entities.push(altLabel);
  }

  return entities;
}

export function createAirspaceLayer(viewer) {
  const allEntities = [];
  let visible = true;

  return {
    add(airports) {
      for (const ap of airports) {
        allEntities.push(...addAirport(viewer, ap));
      }
    },
    setVisible(v) {
      visible = v;
      for (const e of allEntities) e.show = v;
    },
    isVisible: () => visible
  };
}
