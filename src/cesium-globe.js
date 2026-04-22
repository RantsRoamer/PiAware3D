// src/cesium-globe.js
import {
  Viewer,
  Ion,
  Terrain,
  SkyAtmosphere,
  Color,
  Math as CesiumMath,
  Cartesian3
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Initializes and returns a configured Cesium Viewer instance.
// settings: { cesiumToken?, startLat, startLon, startAltKm, startPitch }
export async function initGlobe(containerId, settings = {}) {
  const {
    cesiumToken  = '',
    startLat     = 40.8,
    startLon     = -73.2,
    startAltKm   = 350,
    startPitch   = -55
  } = settings;

  if (cesiumToken) Ion.defaultAccessToken = cesiumToken;

  const terrainOption = cesiumToken
    ? { terrain: Terrain.fromWorldTerrain() }
    : {};

  const viewer = new Viewer(containerId, {
    ...terrainOption,
    baseLayerPicker:       false,
    animation:             false,
    timeline:              false,
    homeButton:            false,
    sceneModePicker:       false,
    navigationHelpButton:  false,
    geocoder:              false,
    fullscreenButton:      false,
    infoBox:               false,
    selectionIndicator:    false,
    shadows:               false,
    skyAtmosphere:         new SkyAtmosphere()
  });

  // Globe appearance
  viewer.scene.backgroundColor = Color.BLACK;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.atmosphereHueShift = 0.0;
  viewer.scene.globe.atmosphereSaturationShift = 0.1;
  viewer.scene.globe.atmosphereBrightnessShift = 0.1;

  // Allow camera to go below terrain (underground) so users can tilt up and look
  // at aircraft from below, and zoom all the way in to individual planes.
  const ctrl = viewer.scene.screenSpaceCameraController;
  ctrl.enableCollisionDetection = false;
  ctrl.minimumZoomDistance = 100;

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(startLon, startLat, startAltKm * 1000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch:   CesiumMath.toRadians(startPitch),
      roll:    0
    }
  });

  return viewer;
}
