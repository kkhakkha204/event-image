from app.database import engine, Base
from app.models.image import EventImage, FaceVector
from app.config import get_settings
from minio import Minio
from sqlalchemy import text

def init_database():
    print("Creating database tables...")
    
    # Enable pgvector extension first
    print("Enabling pgvector extension...")
    with engine.connect() as connection:
        # Enable the vector extension
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()
    print("pgvector extension enabled!")
    
    # Now create tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def init_minio():
    settings = get_settings()
    client = Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=settings.minio_secure
    )
    
    bucket_name = settings.minio_bucket
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)
        print(f"Created MinIO bucket: {bucket_name}")
    else:
        print(f"MinIO bucket already exists: {bucket_name}")

if __name__ == "__main__":
    init_database()
    init_minio()