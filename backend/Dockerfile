FROM python:3.11-slim

# Install system dependencies for OpenCV and dlib
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    python3-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (better Docker caching)
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs temp

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Expose port (Railway sẽ set PORT env var)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD python -c "import requests; requests.get(f'http://localhost:{__import__(\"os\").getenv(\"PORT\", \"8000\")}/health')" || exit 1

# Start command - Railway sẽ override bằng railway.json
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}