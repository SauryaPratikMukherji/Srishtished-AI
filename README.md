---
title: Jalpramaan Aqua Nexus
emoji: 🌊
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# 🌊 JALPRAMAAN / AQUA NEXUS
### Scientific Watershed Assessment, Automated Monitoring, and Validation Framework
*(Developed for Smart India Hackathon)*

## 📌 Overview
Jalpramaan (Aqua Nexus) is an AI-driven, multi-modal geospatial auditing system for rural watershed structures (check dams, farm ponds, percolation tanks, and contour trenches). 

It combines:
- **Ground Truth Computer Vision**: Structural detection and tamper-resistant cryptographic GPS/compass metadata extraction.
- **Satellite Multispectral Downscaling**: Sentinel-2 & Planet Labs 30m NIR/Red/Green analysis computing normalized water & vegetation indexes (NDWI & NDVI).
- **Spatial Discrepancy Engine**: Viewshed cone ray-casting that cross-validates field ground photos with satellite soil moisture signatures to detect fraudulent or misplaced claims.
- **AI Synthesis**: Hugging Face LLM analysis providing instant natural-language audit reasoning for field inspectors and district administrators.

---

## 🚀 Running Locally

### Option 1: Quick Launcher (Both Frontend & Backend)
```bash
python start_app.py
```

### Option 2: Separate Terminals
```bash
# Terminal 1 - FastAPI Backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 - React Frontend
cd frontend
npm run dev
```

- **Frontend:** http://localhost:5173
- **API Docs (Swagger):** http://127.0.0.1:8000/docs

---

## 🐳 Deployment (Hugging Face Spaces)
This project is containerized for Hugging Face Spaces via Docker:
- Frontend is compiled with Node 20 into static production assets.
- FastAPI backend runs on Python 3.11 and serves both the REST API endpoints and SPA routes on port `7860`.
