# 🛰️ SentinelAI — Detection Platform

AI-powered **Deforestation Detection** and **Small Vessel Detection** from satellite imagery.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│               React Frontend (:3000)                     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (Axios)
┌────────────────────────▼────────────────────────────────┐
│              API Gateway (:8000)                         │
│         FastAPI · Token Auth · Logging                   │
└──────────────┬──────────────────┬──────────────────────┘
               │                  │
┌──────────────▼──────┐  ┌────────▼──────────────────┐
│ Deforestation Svc   │  │  Vessel Detection Svc     │
│  FastAPI (:8001)    │  │  FastAPI (:8002)          │
│  Deforestationmodel │  │  Vesselmodel              │
└─────────────────────┘  └───────────────────────────┘
```

---

## 📁 Project Structure

```
project/
├── docker-compose.yml
├── .env
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Deforestation.js
│       │   └── VesselDetection.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   ├── ImageUploader.js
│       │   ├── ConfidenceBar.js
│       │   ├── SpinnerOverlay.js
│       │   └── PageLoader.js
│       └── utils/
│           └── api.js
└── backend/
    ├── gateway/
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   ├── main.py
    │   ├── middleware/
    │   │   └── logging_middleware.py
    │   ├── routers/
    │   │   ├── health.py
    │   │   ├── deforestation.py
    │   │   └── vessel.py
    │   └── utils/
    │       └── auth.py
    ├── deforestation_service/
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   ├── main.py
    │   ├── routers/
    │   │   ├── health.py
    │   │   └── predict.py
    │   ├── services/
    │   │   └── model_service.py
    │   └── models/
    │       └── schemas.py
    └── vessel_service/
        ├── Dockerfile
        ├── requirements.txt
        ├── main.py
        ├── routers/
        │   ├── health.py
        │   └── predict.py
        ├── services/
        │   └── model_service.py
        └── models/
            └── schemas.py
```

---

## 🐳 Docker Guide for Beginners

### What is Docker?

Docker lets you package an application and all its dependencies into a portable "container". Think of it like a shipping container — it works the same everywhere, whether on your laptop or a server in the cloud.

**Key concepts:**
- **Image** — a blueprint for a container (built from a `Dockerfile`)
- **Container** — a running instance of an image
- **docker-compose** — a tool to run multiple containers together with one command

---

### Step 1 — Install Docker

**Windows / macOS:**
1. Go to https://www.docker.com/products/docker-desktop
2. Download and install **Docker Desktop**
3. Start Docker Desktop (you'll see the whale icon in your taskbar)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER   # run docker without sudo
newgrp docker
```

Verify installation:
```bash
docker --version        # Docker version 24.x.x
docker compose version  # Docker Compose version 2.x.x
```

---

### Step 2 — Add Your Models (Optional)

If you have trained model files, place them here:
```
project/
└── models/
    ├── Deforestationmodel/   ← your deforestation model weights
    └── Vesselmodel/          ← your vessel detection model weights
```

> If no models are present, the services run in **simulation mode** and return realistic dummy predictions so you can test the full UI/API flow.

---

### Step 3 — Run the Project

Open a terminal, navigate to the project root, and run:

```bash
# Go to the project directory
cd project

# Build all Docker images and start all containers
docker compose up --build
```

The first run takes 3–8 minutes to download base images and install dependencies. Subsequent starts are much faster.

To run in the background (detached mode):
```bash
docker compose up --build -d
```

---

### Step 4 — Access the Application

| Service | URL |
|---|---|
| 🌐 Frontend (Website) | http://localhost:3000 |
| 🔌 API Gateway | http://localhost:8000 |
| 📖 API Docs (Gateway) | http://localhost:8000/docs |
| 🌿 Deforestation Docs | http://localhost:8001/docs |
| 🛥️ Vessel Docs | http://localhost:8002/docs |

---

### Useful Docker Commands

```bash
# View running containers
docker compose ps

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f api-gateway

# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild a single service
docker compose up --build deforestation-service

# Enter a running container's shell
docker compose exec api-gateway bash
```

---

## 🔌 API Reference

### Authentication

All endpoints require a Bearer token header:
```
Authorization: Bearer supersecrettoken123
```
> Change this in `.env` before deploying to production.

---

### POST `/api/v1/predict-deforestation`

Upload a forest/satellite image for deforestation classification.

**Request:** `multipart/form-data`
- `file` — image file (JPG/PNG/WEBP/TIFF, max 20MB)

**Response:**
```json
{
  "label": "Severe Deforestation",
  "confidence": 0.9124,
  "confidence_percent": "91.2%",
  "all_scores": {
    "Severe Deforestation": 0.9124,
    "Moderate Deforestation": 0.0521,
    ...
  },
  "processed_image": "<base64-jpeg>",
  "image_size": { "width": 800, "height": 600 },
  "model_version": "Deforestationmodel-v1.0"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:8000/api/v1/predict-deforestation \
  -H "Authorization: Bearer supersecrettoken123" \
  -F "file=@/path/to/forest.jpg"
```

---

### POST `/api/v1/predict-vessel`

Upload a maritime/aerial image for vessel detection.

**Request:** `multipart/form-data`
- `file` — image file (JPG/PNG/WEBP/TIFF, max 20MB)

**Response:**
```json
{
  "vessel_count": 3,
  "detections": [
    {
      "id": 1,
      "class": "Small Fishing Vessel",
      "confidence": 0.8732,
      "confidence_percent": "87.3%",
      "bounding_box": { "x": 124, "y": 88, "width": 62, "height": 40, "x2": 186, "y2": 128 },
      "color": "rgb(255,69,0)"
    }
  ],
  "average_confidence": 0.8732,
  "average_confidence_percent": "87.3%",
  "annotated_image": "<base64-jpeg>",
  "image_size": { "width": 1024, "height": 768 },
  "model_version": "Vesselmodel-v1.0"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:8000/api/v1/predict-vessel \
  -H "Authorization: Bearer supersecrettoken123" \
  -F "file=@/path/to/satellite.jpg"
```

---

### GET `/api/v1/health`

Check health of all services.

```bash
curl http://localhost:8000/api/v1/health
```

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

## 🔧 Integrating Your Real Models

### Deforestation Model
Edit `backend/deforestation_service/services/model_service.py`:

```python
def load_model(self):
    import tensorflow as tf
    self.model = tf.saved_model.load("/app/models/Deforestationmodel")
    self.model_loaded = True

def _run_model_inference(self, img):
    img_resized = img.resize((224, 224))
    img_array = np.array(img_resized) / 255.0
    img_array = np.expand_dims(img_array, axis=0).astype(np.float32)
    predictions = self.model(img_array)
    # Map output to label + confidence and return dict
```

### Vessel Model (YOLO)
Edit `backend/vessel_service/services/model_service.py`:

```python
def load_model(self):
    from ultralytics import YOLO
    self.model = YOLO("/app/models/Vesselmodel/weights/best.pt")
    self.model_loaded = True

def _run_model_inference(self, img):
    results = self.model(img)
    # Parse results[0].boxes and build detections list
```

---

## 🔐 Security Notes for Production

1. Replace `SECRET_TOKEN` in `.env` with a strong random secret
2. Set up HTTPS using Let's Encrypt + Nginx reverse proxy
3. Restrict CORS origins in each service's `main.py`
4. Use Docker secrets or environment injection for credentials
5. Enable rate limiting on the API gateway

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Framer Motion, Tailwind CSS, Axios |
| API Gateway | Python 3.11, FastAPI, httpx |
| ML Services | FastAPI, Pillow, NumPy |
| Container | Docker, docker-compose |
| Web Server | Nginx (Alpine) |

---

## 📄 License

MIT License © 2025 SentinelAI
