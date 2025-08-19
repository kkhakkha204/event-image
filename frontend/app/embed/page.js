'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchSection from '@/components/SearchSection';
import ImageGallery from '@/components/ImageGallery';
import { imageAPI } from '@/lib/api';

export default function EmbedPage() {
  const [searchResults, setSearchResults] = useState(null);

  // Fetch all images
  const { data: allImages, isLoading } = useQuery({
    queryKey: ['images'],
    queryFn: () => imageAPI.getAllImages(0, 100),
  });

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Search Section */}
      <SearchSection onSearchResults={handleSearchResults} />

      {/* Gallery */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Đang tải ảnh...</p>
          </div>
        ) : searchResults ? (
          <ImageGallery 
            images={searchResults.images} 
            title="Kết Quả Tìm Kiếm"
          />
        ) : (
          <ImageGallery 
            images={allImages?.images || []} 
            title="Tất Cả Ảnh Sự Kiện"
          />
        )}
      </div>
    </div>
  );
}