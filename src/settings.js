// src/settings.js
const STORAGE_KEY = 'piaware3d_settings';

export const DEFAULT_SETTINGS = {
  piawareUrl:   'http://piaware.local:8080',
  cesiumToken:  '',
  startLat:     40.8,
  startLon:     -73.2,
  startAltKm:   350,
  startPitch:   -55
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Wires the settings modal to DOM.
// getCameraView() → { startLat, startLon, startAltKm, startPitch } from the live globe.
// onSave(newSettings) is called after user saves.
export function initSettingsModal(currentSettings, getCameraView, onSave) {
  const overlay         = document.getElementById('settings-overlay');
  const urlInput        = document.getElementById('piaware-url');
  const tokenInput      = document.getElementById('cesium-token');
  const latInput        = document.getElementById('start-lat');
  const lonInput        = document.getElementById('start-lon');
  const altInput        = document.getElementById('start-alt');
  const pitchInput      = document.getElementById('start-pitch');
  const useViewBtn      = document.getElementById('use-current-view-btn');
  const saveBtn         = document.getElementById('settings-save');
  const cancelBtn       = document.getElementById('settings-cancel');
  const openBtn         = document.getElementById('settings-btn');

  const populate = (s) => {
    urlInput.value   = s.piawareUrl;
    tokenInput.value = s.cesiumToken;
    latInput.value   = s.startLat;
    lonInput.value   = s.startLon;
    altInput.value   = s.startAltKm;
    pitchInput.value = s.startPitch;
  };
  populate(currentSettings);

  const open  = () => { populate(currentSettings); overlay.classList.remove('hidden'); };
  const close = () => overlay.classList.add('hidden');

  openBtn.addEventListener('click', open);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  useViewBtn.addEventListener('click', () => {
    const v = getCameraView();
    latInput.value   = v.startLat;
    lonInput.value   = v.startLon;
    altInput.value   = v.startAltKm;
    pitchInput.value = v.startPitch;
  });

  saveBtn.addEventListener('click', () => {
    const newSettings = {
      piawareUrl:  urlInput.value.trim() || DEFAULT_SETTINGS.piawareUrl,
      cesiumToken: tokenInput.value.trim(),
      startLat:    parseFloat(latInput.value)   || DEFAULT_SETTINGS.startLat,
      startLon:    parseFloat(lonInput.value)   || DEFAULT_SETTINGS.startLon,
      startAltKm:  parseFloat(altInput.value)   || DEFAULT_SETTINGS.startAltKm,
      startPitch:  parseFloat(pitchInput.value) || DEFAULT_SETTINGS.startPitch
    };
    saveSettings(newSettings);
    onSave(newSettings);
    close();
  });
}
