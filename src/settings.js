// src/settings.js
const STORAGE_KEY = 'piaware3d_settings';

export const DEFAULT_SETTINGS = {
  piawareUrl: 'http://piaware.local:8080',
  cesiumToken: ''
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

// Wires the settings modal to DOM. onSave(newSettings) is called after user saves.
export function initSettingsModal(currentSettings, onSave) {
  const overlay    = document.getElementById('settings-overlay');
  const urlInput   = document.getElementById('piaware-url');
  const tokenInput = document.getElementById('cesium-token');
  const saveBtn    = document.getElementById('settings-save');
  const cancelBtn  = document.getElementById('settings-cancel');
  const openBtn    = document.getElementById('settings-btn');

  urlInput.value   = currentSettings.piawareUrl;
  tokenInput.value = currentSettings.cesiumToken;

  const open  = () => overlay.classList.remove('hidden');
  const close = () => overlay.classList.add('hidden');

  openBtn.addEventListener('click', open);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  saveBtn.addEventListener('click', () => {
    const newSettings = {
      piawareUrl: urlInput.value.trim() || DEFAULT_SETTINGS.piawareUrl,
      cesiumToken: tokenInput.value.trim()
    };
    saveSettings(newSettings);
    onSave(newSettings);
    close();
  });
}
