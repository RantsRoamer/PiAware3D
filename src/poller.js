// src/poller.js

// Creates a polling controller that fetches aircraft.json via the Express proxy.
// The PiAware URL is passed as a query param so the backend knows where to fetch from.
// Returns { start(), stop() }.
export function createPoller(piawareUrl, onData, onError, intervalMs = 1000) {
  let timerId = null;
  let running = false;

  async function poll() {
    if (!running) return;
    try {
      const url = `/api/aircraft?url=${encodeURIComponent(piawareUrl)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      onData(Array.isArray(json.aircraft) ? json.aircraft : []);
    } catch (err) {
      onError(err);
    } finally {
      if (running) timerId = setTimeout(poll, intervalMs);
    }
  }

  return {
    start() {
      if (running) return;
      running = true;
      poll();
    },
    stop() {
      running = false;
      if (timerId) { clearTimeout(timerId); timerId = null; }
    }
  };
}
