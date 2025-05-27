// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// Image paths
export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // Otherwise, prepend the base URL
  return `http://localhost:3000/${path}`;
};

// Other configuration settings
export const PAGINATION_LIMIT = 10;