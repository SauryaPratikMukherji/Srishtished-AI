# ---- Stage 1: Build Frontend ----
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Backend Service & Static SPA Runner ----
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (for building psycopg2/pillow if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend ./backend

# Copy built frontend assets from Stage 1 into the location expected by backend/main.py
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Hugging Face runs with UID 1000: configure permissions for sqlite and uploads
RUN useradd -m -u 1000 user && \
    mkdir -p /app/backend/uploads /app/backend/static && \
    chown -R user:user /app

USER user

# Expose default ports (7860 for Hugging Face, 10000 for Render)
EXPOSE 7860
EXPOSE 10000

# Dynamically bind to the platform's $PORT (defaults to 7860 if PORT is not set)
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
