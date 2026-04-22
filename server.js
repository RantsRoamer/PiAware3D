import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 9898;
const isProduction = process.env.NODE_ENV === 'production';

// In production, serve the Vite-built frontend
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Proxy endpoint: frontend passes the PiAware base URL as ?url=
// Returns aircraft.json from PiAware's dump1090-fa HTTP server.
app.get('/api/aircraft', async (req, res) => {
  const baseUrl = req.query.url || 'http://piaware.local:8080';
  const targetUrl = `${baseUrl}/skyaware/data/aircraft.json`;

  try {
    const response = await fetch(targetUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      return res.status(502).json({ error: `PiAware responded with ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    const status = err.name === 'TimeoutError' ? 504 : 503;
    res.status(status).json({ error: err.message });
  }
});

// SPA fallback: all non-API routes serve index.html in production
if (isProduction) {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  const mode = isProduction ? 'production' : 'development (API proxy only)';
  console.log(`PiAware-3D server running on http://localhost:${PORT} [${mode}]`);
});
