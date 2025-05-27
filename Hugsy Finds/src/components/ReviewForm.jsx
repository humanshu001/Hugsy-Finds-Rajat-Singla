import React, { useState } from 'react';
import { Star } from 'lucide-react';
import ApiService from '../services/api';

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    guestName: '',
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create FormData object for file uploads
      const reviewFormData = new FormData();
      
      // Add text fields
      reviewFormData.append('product', productId);
      reviewFormData.append('rating', formData.rating);
      reviewFormData.append('title', formData.title);
      reviewFormData.append('comment', formData.comment);
      reviewFormData.append('guestName', formData.guestName);
      
      // Add image files
      images.forEach(image => {
        reviewFormData.append('images', image);
      });
      
      // Submit to API
      const response = await ApiService.createReview(reviewFormData);
      
      // Reset form on success
      setFormData({
        rating: 5,
        title: '',
        comment: '',
        guestName: '',
      });
      setImages([]);
      setSuccess(true);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(response);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          fill={i <= formData.rating ? '#FFD700' : 'none'}
          stroke={i <= formData.rating ? '#FFD700' : '#6B7280'}
          className="cursor-pointer"
          onClick={() => setFormData({...formData, rating: i})}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Your review has been submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex space-x-1">
            {renderStars()}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="guestName" className="block text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Review Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="images" className="block text-gray-700 mb-2">Upload Images (Optional)</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">You can upload up to 5 images</p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}