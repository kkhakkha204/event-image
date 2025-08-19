import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const imageAPI = {
  // Upload images
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search by face
  searchByFace: async (file, tolerance = 0.6) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/images/search?tolerance=${tolerance}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all images
  getAllImages: async (skip = 0, limit = 50) => {
    const response = await api.get('/images/all', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/images/stats');
    return response.data;
  },
};