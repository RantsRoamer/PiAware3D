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
// cesiumToken: optional Ion access token for HD imagery + world terrain.
export async function initGlobe(containerId, cesiumToken) {
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

  // Start zoomed into the PiAware coverage area over Long Island with a slight
  // downward pitch so depth is visible — not straight-down top view.
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(-73.2, 40.8, 350_000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch:   CesiumMath.toRadians(-55),
      roll:    0
    }
  });

  return viewer;
}
