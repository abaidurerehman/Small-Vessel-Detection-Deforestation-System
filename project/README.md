# 🛰️ SentinelAI — AI-Powered Satellite Intelligence Platform

SentinelAI is a modern AI-powered satellite imagery analysis platform designed for:

- 🌿 Deforestation Detection
- 🛥️ Small Vessel Detection

The platform uses a scalable microservices architecture powered by FastAPI, React, and Docker.

---

# ✨ Features

- 🌍 Satellite image analysis
- 🤖 AI-powered object detection & classification
- ⚡ FastAPI microservices architecture
- 🐳 Fully Dockerized deployment
- 🔐 API Gateway with token authentication
- 📊 Interactive React frontend
- 📁 Modular and scalable structure
- ☁️ Cloud deployment ready
- 📖 Swagger API documentation
- 🎨 Modern responsive UI

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│                    React Frontend (:3000)                    │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP / Axios
┌───────────────────────────▼──────────────────────────────────┐
│                    API Gateway (:8000)                       │
│           FastAPI · Authentication · Logging                 │
└───────────────────┬──────────────────────┬──────────────────┘
                    │                      │
        ┌───────────▼──────────┐  ┌────────▼───────────────┐
        │ Deforestation Service │  │ Vessel Detection Svc   │
        │      FastAPI          │  │       FastAPI          │
        │       (:8001)         │  │        (:8002)         │
        └───────────────────────┘  └────────────────────────┘
```

---

# 📁 Project Structure

```text
SentinelAI/
│
├── docker-compose.yml
├── .env
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── utils/
│       └── assets/
│
└── backend/
    ├── gateway/
    ├── deforestation_service/
    └── vessel_service/
```

---

# 🧠 AI Services

## 🌿 Deforestation Detection Service

Detects deforestation severity from satellite forest imagery.

### Capabilities

- Severe deforestation detection
- Moderate deforestation detection
- Forest health analysis
- Confidence scoring
- Processed image output

---

## 🛥️ Vessel Detection Service

Detects and localizes small vessels from maritime satellite imagery.

### Capabilities

- Multi-vessel detection
- Bounding box generation
- Confidence scoring
- Annotated image generation
- Detection statistics

---

# ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.11 |
| AI/ML | TensorFlow, YOLO, NumPy, Pillow |
| Gateway | FastAPI, httpx |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx Alpine |
| Deployment | AWS EC2 / Docker |

---

# 🐳 Docker Deployment Guide

## 📦 What is Docker?

Docker packages applications and dependencies into isolated containers that run consistently across environments.

### Core Concepts

| Concept | Description |
|---|---|
| Image | Blueprint/template for containers |
| Container | Running instance of an image |
| Dockerfile | Instructions to build an image |
| Docker Compose | Runs multiple containers together |

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
cd SentinelAI
```

---

## 2️⃣ Install Docker

### Windows / macOS

Install Docker Desktop:

https://www.docker.com/products/docker-desktop

---

### Ubuntu / Debian

```bash
sudo apt update

sudo apt install docker.io docker-compose -y

sudo usermod -aG docker $USER

newgrp docker
```

Verify installation:

```bash
docker --version
docker compose version
```

---

# 📂 Add AI Models

Place your trained models inside:

```text
models/
├── Deforestationmodel/
└── Vesselmodel/
```

Example:

```text
models/
├── Deforestationmodel/best_model.h5
└── Vesselmodel/weights/best.pt
```

> If models are missing, the services automatically switch to simulation mode.

---

# ▶️ Run the Platform

## Build & Start Containers

```bash
docker compose up --build
```

---

## Run in Background

```bash
docker compose up --build -d
```

---

# 🌐 Access the Platform

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8000 |
| Gateway Docs | http://localhost:8000/docs |
| Deforestation Docs | http://localhost:8001/docs |
| Vessel Docs | http://localhost:8002/docs |

---

# 🛠️ Useful Docker Commands

## View Running Containers

```bash
docker compose ps
```

---

## View Logs

```bash
docker compose logs -f
```

---

## View Specific Service Logs

```bash
docker compose logs -f api-gateway
```

---

## Stop Containers

```bash
docker compose down
```

---

## Remove Volumes

```bash
docker compose down -v
```

---

## Rebuild Single Service

```bash
docker compose up --build deforestation-service
```

---

## Access Container Shell

```bash
docker compose exec api-gateway bash
```

---

# 🔌 API Reference

# 🔐 Authentication

All API requests require:

```http
Authorization: Bearer supersecrettoken123
```

Change the token in `.env` before production deployment.

---

# 🌿 Deforestation Prediction

## Endpoint

```http
POST /api/v1/predict-deforestation
```

---

## Request

`multipart/form-data`

| Field | Type |
|---|---|
| file | Image |

Supported formats:

- JPG
- PNG
- WEBP
- TIFF

Maximum size:

- 20MB

---

## Example Response

```json
{
  "label": "Severe Deforestation",
  "confidence": 0.9124,
  "confidence_percent": "91.2%",
  "processed_image": "<base64-jpeg>",
  "model_version": "Deforestationmodel-v1.0"
}
```

---

## cURL Example

```bash
curl -X POST http://localhost:8000/api/v1/predict-deforestation \
-H "Authorization: Bearer supersecrettoken123" \
-F "file=@forest.jpg"
```

---

# 🛥️ Vessel Detection

## Endpoint

```http
POST /api/v1/predict-vessel
```

---

## Example Response

```json
{
  "vessel_count": 3,
  "average_confidence": 0.87,
  "annotated_image": "<base64-jpeg>",
  "model_version": "Vesselmodel-v1.0"
}
```

---

## cURL Example

```bash
curl -X POST http://localhost:8000/api/v1/predict-vessel \
-H "Authorization: Bearer supersecrettoken123" \
-F "file=@satellite.jpg"
```

---

# ❤️ Health Check

## Endpoint

```http
GET /api/v1/health
```

---

## Example Response

```json
{
  "gateway": "healthy",
  "services": {
    "deforestation": "healthy",
    "vessel": "healthy"
  }
}
```

---

# 🧠 Integrating Real AI Models

# TensorFlow Example

File:

```text
backend/deforestation_service/services/model_service.py
```

```python
import tensorflow as tf

self.model = tf.saved_model.load("/app/models/Deforestationmodel")
```

---

# YOLO Example

File:

```text
backend/vessel_service/services/model_service.py
```

```python
from ultralytics import YOLO

self.model = YOLO("/app/models/Vesselmodel/weights/best.pt")
```

---

# ☁️ AWS Deployment

## Recommended Deployment

| Component | Hosting |
|---|---|
| Frontend | EC2 + Docker |
| Backend | EC2 + Docker |
| AI Models | EC2 |
| Reverse Proxy | Nginx |
| SSL | Let's Encrypt |

---

## AWS Free Tier Notes

AI inference may require additional RAM.

Recommended:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

# 🔐 Production Security

Before production deployment:

- Change API tokens
- Enable HTTPS
- Restrict CORS
- Add rate limiting
- Use Docker secrets
- Configure Nginx reverse proxy

---

# 📊 Frontend Features

- Responsive UI
- Animated transitions
- File upload previews
- Confidence bars
- Loading overlays
- Modern dark theme
- API integration via Axios

---

# 📈 Future Improvements

- User authentication system
- GPU inference support
- Kubernetes deployment
- Multi-model orchestration
- Real-time satellite feeds
- Model monitoring dashboard
- CI/CD pipelines
- Redis caching
- Database integration

---

# 👨‍💻 Author

## Abaidur-E-Rehman

Machine Learning Engineer & Full Stack AI Developer

- AI Systems
- FastAPI Microservices
- Computer Vision
- Cloud Deployment
- Docker & DevOps

---

# 📄 License

MIT License © 2026 SentinelAI