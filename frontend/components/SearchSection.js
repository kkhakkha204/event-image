'use client';

import { useState } from 'react';
import { imageAPI } from '@/lib/api';

export default function SearchSection({ onSearchResults }) {
  const [searching, setSearching] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tolerance, setTolerance] = useState(0.4); // Mặc định 0.4 cho độ chính xác cao

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
      onSearchResults(results);
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
    onSearchResults(null);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Tìm Ảnh Theo Khuôn Mặt</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">
            Chọn ảnh có khuôn mặt của bạn:
          </label>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Tolerance Slider */}
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium">
              Độ chính xác: {tolerance < 0.3 ? 'Rất cao' : tolerance < 0.5 ? 'Cao' : 'Trung bình'}
            </label>
            <input
              type="range"
              min="0.2"
              max="0.6"
              step="0.05"
              value={tolerance}
              onChange={(e) => setTolerance(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Chính xác nhất</span>
              <span>Linh hoạt hơn</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center gap-3">
          <button
            onClick={handleSearch}
            disabled={!selectedFile || searching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {searching ? 'Đang tìm...' : 'Tìm Kiếm'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Xóa & Xem Tất Cả
          </button>
        </div>
      </div>
    </div>
  );
}