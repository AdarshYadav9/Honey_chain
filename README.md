# Honey Chain — Traceable Honey, Verified at the Source

Honey Chain is an integrated blockchain, AI, and IoT-based digital platform developed for **KVIC's Honey Mission** and rural beekeepers.

---

## 🌟 Key Features

1. **IoT Smart Hive Monitoring**: Live telemetry for brood temperature, nest humidity, scale weight accumulation, acoustic buzzing frequency, and battery levels.
2. **AI Colony Health & Yield Prediction**: Machine-learning models detecting disease risks (Varroa mite, Foulbrood, Nosema) and predicting 4-week honey yields.
3. **Blockchain Traceability**: Immutable batch records tracking 6 supply-chain checkpoints (Harvest $\rightarrow$ Lab Test $\rightarrow$ Processing $\rightarrow$ Packaging $\rightarrow$ Distribution $\rightarrow$ Retail).
4. **Consumer QR Verification**: Plain-language provenance summary resolving honey batch purity, origin beekeeper profile, and lab certifications.
5. **Scale-Up Framework**: Phased deployment roadmap for KVIC regional and national honey clusters.

---

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
- API: `http://localhost:4000`

### 2. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm start
```
- Frontend: `http://localhost:3000`

### 3. (Optional) Start Consumer Verification Webpage
```bash
cd webpage
npm install
node server.js
```
- Consumer Portal: `http://localhost:8000/KVIC-HC-2026-0417`

## Deploy

### Backend on Render

1. Create a new Render **Blueprint** from this repository. Render will use `render.yaml`.
2. Deploy the `honey-chain-api` web service.
3. Copy the service URL, such as `https://honey-chain-api.onrender.com`.

### Frontend on Vercel

1. Import this repository into Vercel.
2. Set the project root directory to `frontend`.
3. Use `npm run build` as the build command and `build` as the output directory.
4. Add `REACT_APP_API_URL` with the Render service URL, without a trailing slash.
5. Deploy. `frontend/vercel.json` keeps React Router routes working after refresh.
