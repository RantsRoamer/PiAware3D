# overLI — PiAware 3D Live Map

Real-time 3D aircraft tracking on a Cesium.js globe, powered by your own PiAware / dump1090-fa device.

*by John F. Gonzales*

---

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. Click **⚙ Settings** and enter your PiAware device URL (e.g. `http://192.168.1.50:8080`).

---

## Installation

**Requirements:** Node.js 18 or later. [Download Node.js](https://nodejs.org)

```bash
# 1. Clone or download this project
git clone <repo-url> overLI && cd overLI

# 2. Install dependencies
npm install

# 3. Start development server (globe + API proxy)
npm run dev
```

Open http://localhost:5173

---

## Production Build

```bash
npm run build      # Vite bundles the frontend into dist/
npm start          # Express serves dist/ and the API proxy
```

Open http://localhost:3001

---

## Cesium Ion Access Token (Optional but Recommended)

A free Cesium Ion token gives you:
- High-resolution Bing Maps satellite imagery
- Cesium World Terrain (3D terrain elevation)

**How to get a free token:**
1. Go to [cesium.com/ion](https://cesium.com/ion/) and create a free account
2. Click **Access Tokens** → **Create Token**
3. Copy the token
4. In the app, click **⚙ Settings** and paste it into **Cesium Ion Token**
5. Click **Save & Apply** — the page reloads with the new imagery

Without a token the globe still works with default OpenStreetMap imagery and no terrain.

---

## Running on PiAware Itself

If you want to run overLI on the same Raspberry Pi as PiAware:

```bash
# On the Pi
npm install
npm run build
npm start
```

Set your PiAware URL to `http://localhost:8080` in Settings.

Then access the app from another machine at `http://<pi-ip>:3001`.

---

## Adding a 3D Airplane glTF Model

The default display uses an SVG billboard icon. To upgrade to a full 3D model:

1. **Find a free CC0 glTF airplane:**
   - Cesium sample asset: Open https://sandcastle.cesium.com and search "3D Models" — grab the glTF URL
   - Sketchfab: Search "airplane" → filter CC0 → download glTF
   - Google Poly archive mirrors (search GitHub for "poly.google.com archive glb")

2. **Place the file** in `public/models/airplane.glb`

3. **Edit `src/aircraft-entity.js`** — replace the `billboard` block with:

```javascript
model: {
  uri: '/models/airplane.glb',
  minimumPixelSize: 32,
  maximumScale: 20000,
  silhouetteColor: Color.WHITE,
  silhouetteSize: 1.0
},
orientation: Cesium.Transforms.headingPitchRollQuaternion(
  position(aircraft),
  new Cesium.HeadingPitchRoll(CesiumMath.toRadians(aircraft.track ?? 0), 0, 0)
)
```

---

## Controls

| Action | Result |
|---|---|
| Click aircraft | Show info popup |
| 📍 Follow | Lock camera to selected aircraft |
| 🌍 Reset View | Return to Long Island home view |
| 〰 Trails | Toggle position history trails |
| Legend | Show altitude color legend |
| ⚙ Settings | Configure PiAware URL and Cesium token |

---

## Altitude Color Legend

| Color | Altitude |
|---|---|
| 🟢 Green | Ground – 5,000 ft |
| 🟡 Yellow | 5,000 – 15,000 ft |
| 🟠 Orange | 15,000 – 25,000 ft |
| 🔴 Red | 25,000 – 35,000 ft |
| 🟣 Magenta | 35,000+ ft |
