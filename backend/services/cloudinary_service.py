import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url
import os
from typing import Optional
import io

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

class CloudinaryService:
    def __init__(self):
        self.folder = "event-images"
    
    def upload_image(self, file_data: bytes, filename: str) -> dict:
        """Upload ảnh lên Cloudinary"""
        try:
            result = cloudinary.uploader.upload(
                io.BytesIO(file_data),
                public_id=f"{self.folder}/{filename}",
                resource_type="image",
                quality="auto:good",
                fetch_format="auto"
            )
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "width": result["width"],
                "height": result["height"]
            }
        except Exception as e:
            raise Exception(f"Error uploading to Cloudinary: {str(e)}")
    
    def get_image_url(self, public_id: str, width: Optional[int] = None, height: Optional[int] = None) -> str:
        """Lấy URL ảnh với kích thước tùy chỉnh"""
        transformation = []
        if width:
            transformation.append(f"w_{width}")
        if height:
            transformation.append(f"h_{height}")
        if transformation:
            transformation.append("c_fill")
        
        url, _ = cloudinary_url(
            public_id,
            transformation=transformation,
            secure=True
        )
        return url
    
    def delete_image(self, public_id: str):
        """Xóa ảnh"""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result
        except Exception as e:
            raise Exception(f"Error deleting from Cloudinary: {str(e)}")
    
    def get_all_images(self, max_results: int = 1000):
        """Lấy danh sách tất cả ảnh"""
        try:
            result = cloudinary.api.resources(
                type="upload",
                prefix=self.folder,
                max_results=max_results
            )
            return result["resources"]
        except Exception as e:
            raise Exception(f"Error fetching images: {str(e)}")

# Instance để sử dụng
cloudinary_service = CloudinaryService()