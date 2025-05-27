import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ApiService from '../services/api';
import { getImageUrl } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomerReviews from '../components/CustomerReviews';
import ReviewForm from '../components/ReviewForm';
import { Star, ShoppingCart, Heart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        quantity
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleReviewSubmitted = () => {
    // Refresh product data to show the new review
    const fetchProduct = async () => {
      try {
        const data = await ApiService.getProductById(id);
        setProduct(data);
        setShowReviewForm(false);
      } catch (err) {
        console.error('Error refreshing product:', err);
      }
    };
    
    fetchProduct();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-16 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-16 px-4">
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error || 'Product not found'}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Process images
  const productImages = product.images && product.images.length > 0 
    ? (Array.isArray(product.images) ? product.images : product.images.split(',')) 
    : [];

  return (
    <>
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
              {productImages.length > 0 ? (
                <img 
                  src={getImageUrl(productImages[activeImage])} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {productImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer border-2 rounded-md overflow-hidden h-20 ${
                      index === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Price */}
            <div className="mb-4">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary mr-2">
                    ${parseFloat(product.discountPrice).toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                  Out of Stock
                </span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button 
                  className="bg-gray-200 px-3 py-2 rounded-l-md"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-y border-gray-300 py-2"
                />
                <button 
                  className="bg-gray-200 px-3 py-2 rounded-r-md"
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-primary-dark disabled:bg-gray-400"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button className="flex-1 border border-gray-300 py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50">
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-2">
                <span className="font-semibold">Category:</span> {product.category?.name || 'Uncategorized'}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold">Tags:</span> {product.tags.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
          
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm 
                productId={product._id} 
                onReviewSubmitted={handleReviewSubmitted} 
              />
            </div>
          )}
          
          <CustomerReviews productId={product._id} />
        </div>
      </div>
      <Footer />
    </>
  );
}