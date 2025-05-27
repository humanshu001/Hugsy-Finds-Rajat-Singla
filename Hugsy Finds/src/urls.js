// Base URL for the API
const API_BASE_URL = 'http://localhost:3000/api';

// API endpoints
export const URLS = {
  // Product endpoints
  product: {
    readAll: `${API_BASE_URL}/products`,
    readOne: `${API_BASE_URL}/products`,  // Will need ID appended
    create: `${API_BASE_URL}/products`,
    update: `${API_BASE_URL}/products`,   // Will need ID appended
    delete: `${API_BASE_URL}/products`,   // Will need ID appended
    getByCategory: `${API_BASE_URL}/products/category` // Will need ID appended
  },
  
  // Category endpoints
  category: {
    readAll: `${API_BASE_URL}/categories`,
    readOne: `${API_BASE_URL}/categories`, // Will need ID appended
    create: `${API_BASE_URL}/categories`,
    update: `${API_BASE_URL}/categories`,  // Will need ID appended
    delete: `${API_BASE_URL}/categories`   // Will need ID appended
  }
}