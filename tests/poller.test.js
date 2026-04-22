// tests/poller.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPoller } from '../src/poller.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('createPoller', () => {
  it('calls onData with parsed aircraft array on success', async () => {
    const mockAircraft = [{ hex: 'abc123', lat: 40, lon: -73 }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ aircraft: mockAircraft })
    });
    const onData = vi.fn();
    const onError = vi.fn();
    const poller = createPoller('http://piaware.local:8080', onData, onError, 1000);

    poller.start();
    await vi.advanceTimersByTimeAsync(1500);

    expect(onData).toHaveBeenCalledWith(mockAircraft);
    expect(onError).not.toHaveBeenCalled();
    poller.stop();
  });

  it('calls onError when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    const onData = vi.fn();
    const onError = vi.fn();
    const poller = createPoller('http://piaware.local:8080', onData, onError, 1000);

    poller.start();
    await vi.advanceTimersByTimeAsync(1500);

    expect(onError).toHaveBeenCalled();
    expect(onData).not.toHaveBeenCalled();
    poller.stop();
  });

  it('stops polling after stop() is called', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ aircraft: [] })
    });
    const onData = vi.fn();
    const poller = createPoller('http://piaware.local:8080', onData, vi.fn(), 1000);

    poller.start();
    await vi.advanceTimersByTimeAsync(1500);
    const callCount = onData.mock.calls.length;
    poller.stop();
    await vi.advanceTimersByTimeAsync(1500);

    expect(onData.mock.calls.length).toBe(callCount);
  });
});
