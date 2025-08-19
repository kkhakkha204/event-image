'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { imageAPI } from '@/lib/api';

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tolerance, setTolerance] = useState(0.5);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 20;

  // Fetch all images
  const { data: allImages, isLoading } = useQuery({
    queryKey: ['images', currentPage],
    queryFn: () => imageAPI.getAllImages(currentPage * imagesPerPage, imagesPerPage),
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!selectedFile) return;
    
    setSearching(true);
    try {
      const results = await imageAPI.searchByFace(selectedFile, tolerance);
      setSearchResults(results);
      setCurrentPage(0);
    } catch (error) {
      console.error('Search error:', error);
      alert('Không tìm thấy khuôn mặt trong ảnh!');
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setSearchResults(null);
    setCurrentPage(0);
  };

  const displayImages = searchResults ? searchResults.images : (allImages?.images || []);
  const totalImages = searchResults ? searchResults.total : (allImages?.total || 0);
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-yellow-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Tìm ảnh của bạn
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Bước 1: Chọn ảnh chân dung của bạn
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">Click để chọn ảnh</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG tối đa 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Controls Section */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Bước 2: Điều chỉnh và tìm kiếm
              </label>
              
              {/* Tolerance Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Độ chính xác:</span>
                  <span className="text-sm font-medium text-blue-800">
                    {tolerance < 0.3 ? 'Rất cao' : tolerance < 0.5 ? 'Cao' : 'Trung bình'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.6"
                  step="0.05"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-blue-800"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Chính xác</span>
                  <span>Linh hoạt</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSearch}
                  disabled={!selectedFile || searching}
                  className="w-full py-3 bg-yellow-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {searching ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang tìm kiếm...
                    </span>
                  ) : (
                    'Tìm Kiếm'
                  )}
                </button>
                
                {searchResults && (
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Xem Tất Cả Ảnh
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {searchResults ? `Kết quả tìm kiếm (${searchResults.total} ảnh)` : `Tất cả ảnh (${totalImages} ảnh)`}
            </h3>
          </div>

          {/* Gallery */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">Không tìm thấy ảnh nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.thumbnail_url}
                      alt={image.filename}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {image.face_count > 0 && (
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded-full">
                        {image.face_count} người
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {!searchResults && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>
                  
                  <span className="px-4 py-2">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <img
              src={selectedImage.url}
              alt={selectedImage.filename}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-4xl font-light"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}