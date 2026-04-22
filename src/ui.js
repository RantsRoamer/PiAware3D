// src/ui.js — Pure DOM manipulation. No Cesium imports.
import { formatAltitude, formatVerticalRate } from './utils.js';

export function updateAircraftCount(n) {
  document.getElementById('aircraft-count').textContent = `${n} aircraft`;
}

export function setConnectionStatus(status) {
  const el = document.getElementById('connection-status');
  const states = {
    connected:    { text: '● Connected',    cls: 'status-connected' },
    connecting:   { text: '● Connecting…',  cls: 'status-connecting' },
    disconnected: { text: '● Disconnected', cls: 'status-disconnected' }
  };
  const s = states[status] ?? states.disconnected;
  el.textContent = s.text;
  el.className = s.cls;
}

export function showAircraftPopup(aircraft) {
  const callsign = (aircraft.flight ?? aircraft.hex ?? '').trim();
  document.getElementById('popup-callsign').textContent = callsign || aircraft.hex;
  document.getElementById('popup-type').textContent = aircraft.t || '';
  document.getElementById('popup-hex').textContent = aircraft.hex;
  document.getElementById('popup-altitude').textContent =
    formatAltitude(aircraft.alt_baro ?? aircraft.alt_geom ?? 'ground');
  document.getElementById('popup-speed').textContent =
    aircraft.gs != null ? `${Math.round(aircraft.gs)} kts` : '—';
  document.getElementById('popup-track').textContent =
    aircraft.track != null ? `${Math.round(aircraft.track)}°` : '—';
  document.getElementById('popup-vrate').textContent =
    formatVerticalRate(aircraft.baro_rate ?? 0);
  document.getElementById('popup-squawk').textContent = aircraft.squawk || '—';
  document.getElementById('popup-seen').textContent =
    aircraft.seen != null ? `${aircraft.seen.toFixed(1)}s ago` : '—';
  document.getElementById('aircraft-popup').classList.remove('hidden');
}

export function hideAircraftPopup() {
  document.getElementById('aircraft-popup').classList.add('hidden');
}

export function initPopupCloseButton() {
  document.getElementById('popup-close').addEventListener('click', hideAircraftPopup);
}

export function initLegendToggle() {
  const btn   = document.getElementById('legend-btn');
  const panel = document.getElementById('legend');
  btn.addEventListener('click', () => panel.classList.toggle('hidden'));
}

// Calls onChange(enabled) each time the trails button is toggled.
export function initTrailsToggle(onChange) {
  let on = false;
  const btn = document.getElementById('trails-btn');
  btn.addEventListener('click', () => {
    on = !on;
    btn.textContent = `〰 Trails: ${on ? 'ON' : 'OFF'}`;
    btn.style.color = on ? '#00ff88' : '';
    onChange(on);
  });
}
