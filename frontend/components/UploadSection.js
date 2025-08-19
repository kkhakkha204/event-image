'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { imageAPI } from '@/lib/api';

export default function UploadSection({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setUploadStatus(`Đang tải lên ${acceptedFiles.length} ảnh...`);
    
    try {
      const result = await imageAPI.uploadImages(acceptedFiles);
      setUploadStatus(`Đã tải lên ${result.uploaded.length} ảnh thành công!`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      setUploadStatus('Lỗi khi tải ảnh lên!');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: uploading
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Tải Ảnh Lên (Admin)</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg">Thả ảnh vào đây...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Kéo thả ảnh vào đây, hoặc click để chọn</p>
            <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, WebP</p>
          </div>
        )}
      </div>
      
      {uploadStatus && (
        <div className={`mt-4 p-3 rounded ${uploading ? 'bg-blue-100' : 'bg-green-100'}`}>
          <p className="text-sm">{uploadStatus}</p>
        </div>
      )}
    </div>
  );
}