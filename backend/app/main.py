# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.api import images
# from app.config import get_settings

# settings = get_settings()

# app = FastAPI(title="Event Images API")

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Next.js dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include routers
# app.include_router(images.router)

# @app.get("/")
# async def root():
#     return {"message": "Event Images API", "status": "running"}

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host=settings.api_host, port=settings.api_port)
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import images
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Event Images API",
    version="1.0.0",
    description="API for event photo management with face recognition"
)

# CORS configuration for production
def get_cors_origins():
    """Get CORS origins from environment"""
    cors_origins = os.getenv("CORS_ORIGINS", "")
    if cors_origins:
        # Split by comma and clean whitespace
        origins = [origin.strip() for origin in cors_origins.split(",")]
    else:
        # Development fallback
        origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ]
    
    # Add wildcard only in development
    environment = os.getenv("ENVIRONMENT", "development")
    if environment != "production":
        origins.append("*")
    
    return origins

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(images.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Event Images API", 
        "status": "running",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    try:
        return {
            "status": "healthy",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "cors_origins": get_cors_origins()[:2]  # Show first 2 for security
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# For Railway deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Railway sets PORT
    uvicorn.run(
        app, 
        host="0.0.0.0",  # Railway requires 0.0.0.0
        port=port,
        reload=os.getenv("ENVIRONMENT") != "production"
    )