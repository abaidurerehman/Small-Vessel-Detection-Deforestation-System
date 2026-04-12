FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch FIRST — prevents ultralytics from pulling CUDA (2GB+)
RUN pip install --no-cache-dir \
    torch==2.3.1+cpu \
    torchvision==0.18.1+cpu \
    --extra-index-url https://download.pytorch.org/whl/cpu

# Now install everything else
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/models

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002", "--workers", "1"]
