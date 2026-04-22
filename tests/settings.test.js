// tests/settings.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../src/settings.js';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => { store[key] = String(val); },
    clear: () => { store = {}; }
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => localStorageMock.clear());

describe('loadSettings', () => {
  it('returns defaults when localStorage is empty', () => {
    const s = loadSettings();
    expect(s.piawareUrl).toBe(DEFAULT_SETTINGS.piawareUrl);
    expect(s.cesiumToken).toBe('');
  });

  it('returns saved values from localStorage', () => {
    localStorageMock.setItem(
      'overli_settings',
      JSON.stringify({ piawareUrl: 'http://192.168.1.50:8080', cesiumToken: 'abc' })
    );
    const s = loadSettings();
    expect(s.piawareUrl).toBe('http://192.168.1.50:8080');
    expect(s.cesiumToken).toBe('abc');
  });

  it('falls back to defaults on corrupted JSON', () => {
    localStorageMock.setItem('overli_settings', 'NOT_JSON');
    const s = loadSettings();
    expect(s.piawareUrl).toBe(DEFAULT_SETTINGS.piawareUrl);
  });
});

describe('saveSettings', () => {
  it('persists settings to localStorage', () => {
    saveSettings({ piawareUrl: 'http://10.0.0.1:8080', cesiumToken: 'xyz' });
    const raw = JSON.parse(localStorageMock.getItem('overli_settings'));
    expect(raw.piawareUrl).toBe('http://10.0.0.1:8080');
    expect(raw.cesiumToken).toBe('xyz');
  });
});
