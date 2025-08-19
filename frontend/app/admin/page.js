'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { imageAPI } from '@/lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch stats
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: imageAPI.getStats,
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setUploadStatus(`Đang tải lên ${acceptedFiles.length} ảnh...`);
    
    try {
      const result = await imageAPI.uploadImages(acceptedFiles);
      setUploadedFiles(prev => [...result.uploaded, ...prev]);
      setUploadStatus(`✓ Đã tải lên ${result.uploaded.length} ảnh thành công!`);
      refetchStats();
      
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      setUploadStatus('✗ Lỗi khi tải ảnh lên!');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [refetchStats]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl text-gray-600 mt-1">Upload ảnh sự kiện</p>
            </div>
            
            <Link 
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              → Xem Trang Khách
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-3xl font-bold text-blue-600">{stats.total_images}</div>
              <div className="text-sm text-gray-600 mt-1">Tổng số ảnh</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-3xl font-bold text-green-600">{stats.total_faces}</div>
              <div className="text-sm text-gray-600 mt-1">Khuôn mặt phát hiện</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-3xl font-bold text-purple-600">{stats.images_with_faces}</div>
              <div className="text-sm text-gray-600 mt-1">Ảnh có người</div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Tải Ảnh Lên</h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {isDragActive ? (
                <p className="text-lg font-medium">Thả ảnh vào đây...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">Kéo thả ảnh vào đây</p>
                  <p className="text-sm text-gray-500">hoặc click để chọn từ máy tính</p>
                  <p className="text-xs text-gray-400 mt-4">Hỗ trợ: JPG, PNG, WebP • Có thể chọn nhiều ảnh</p>
                </>
              )}
            </div>
          </div>
          
          {/* Upload Status */}
          {uploadStatus && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3
              ${uploading ? 'bg-blue-50 text-blue-700' : 
                uploadStatus.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {uploading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              <span className="font-medium">{uploadStatus}</span>
            </div>
          )}
        </div>

        {/* Recent Uploads */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mt-8">
            <h3 className="text-lg font-semibold mb-4">Ảnh vừa tải lên</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{file.filename}</span>
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${file.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {file.status === 'processing' ? 'Đang xử lý' : 'Hoàn thành'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}