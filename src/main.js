// src/main.js — Entry point. Wires all modules together.
import { loadSettings, initSettingsModal } from './settings.js';
import { initGlobe } from './cesium-globe.js';
import { createAircraftManager } from './aircraft-manager.js';
import { createAircraftEntity, updateAircraftEntity } from './aircraft-entity.js';
import { createTrailManager } from './trails.js';
import { createPoller } from './poller.js';
import {
  updateAircraftCount,
  setConnectionStatus,
  showAircraftPopup,
  hideAircraftPopup,
  initPopupCloseButton,
  initLegendToggle,
  initTrailsToggle
} from './ui.js';
import { ScreenSpaceEventType } from 'cesium';

const STALE_MS = 30_000;
const POLL_MS  = 1_000;

async function main() {
  const settings = loadSettings();

  // Globe
  const viewer = await initGlobe('cesium-container', settings.cesiumToken || null);

  // Systems
  const trailManager    = createTrailManager(viewer);
  const aircraftManager = createAircraftManager(viewer, createAircraftEntity, updateAircraftEntity);

  // Remove stale aircraft every 5 seconds
  setInterval(() => aircraftManager.removeStale(STALE_MS), 5_000);

  // Track the selected aircraft for popup refresh and follow
  let selectedHex = null;

  // Click to select aircraft and show popup
  viewer.screenSpaceEventHandler.setInputAction((event) => {
    const picked = viewer.scene.pick(event.position);
    if (picked?.id?._ac) {
      const entity = picked.id;
      selectedHex = entity._ac.hex;
      showAircraftPopup(entity._ac);
      document.getElementById('follow-btn').disabled = false;
    } else {
      selectedHex = null;
      hideAircraftPopup();
      document.getElementById('follow-btn').disabled = true;
      viewer.trackedEntity = undefined;
    }
  }, ScreenSpaceEventType.LEFT_CLICK);

  // Follow button: toggle camera lock on selected entity
  document.getElementById('follow-btn').addEventListener('click', () => {
    if (!selectedHex) return;
    const entity = viewer.entities.getById(selectedHex);
    if (!entity) return;
    viewer.trackedEntity = viewer.trackedEntity === entity ? undefined : entity;
    document.getElementById('follow-btn').textContent =
      viewer.trackedEntity ? '📍 Following' : '📍 Follow';
  });

  // Reset camera to home view
  document.getElementById('reset-camera-btn').addEventListener('click', () => {
    viewer.trackedEntity = undefined;
    document.getElementById('follow-btn').textContent = '📍 Follow';
    viewer.camera.flyHome(1.5);
  });

  // Trails toggle
  initTrailsToggle((enabled) => trailManager.setEnabled(enabled));

  // Legend toggle
  initLegendToggle();

  // Popup close button
  initPopupCloseButton();

  // Settings modal — reloads page so new Cesium token takes effect
  initSettingsModal(settings, () => window.location.reload());

  // Start polling
  setConnectionStatus('connecting');

  const poller = createPoller(
    settings.piawareUrl,
    (aircraft) => {
      aircraftManager.update(aircraft);

      // Add trail points for all positioned aircraft
      for (const ac of aircraft) {
        if (ac.lat != null && ac.lon != null) trailManager.addPoint(ac);
      }

      // Keep popup data fresh for the selected aircraft
      if (selectedHex) {
        const fresh = aircraft.find((a) => a.hex === selectedHex);
        if (fresh) showAircraftPopup(fresh);
      }

      updateAircraftCount(aircraftManager.getCount());
      setConnectionStatus('connected');
    },
    (err) => {
      console.warn('[overLI] Poll error:', err.message);
      setConnectionStatus('disconnected');
    },
    POLL_MS
  );

  poller.start();
}

main().catch(console.error);
