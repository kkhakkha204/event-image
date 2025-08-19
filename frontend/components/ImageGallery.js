'use client';

import { useState } from 'react';

export default function ImageGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có ảnh nào để hiển thị</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        {title} ({images.length} ảnh)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.thumbnail_url}
              alt={image.filename}
              className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            {image.face_count > 0 && (
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs
                px-2 py-1 rounded-full">
                {image.face_count} mặt
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Modal xem ảnh lớn */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center 
            justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.filename}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 
                rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}