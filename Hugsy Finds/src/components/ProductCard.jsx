import React, { useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import image from '../assets/image.png'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleAddToCart = () => {
    // In a real app, this would add the product to cart state or call an API
    console.log('Added to cart:', product.name)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative product-image">
        <img src={image} alt={product.name} className="w-full h-64 object-cover" />
        {product.sale && (
          <div className="absolute top-2 right-2 bg-5 text-white px-2 py-1 rounded">
            {product.sale}
          </div>
        )}
        <button 
          className={`addtocart absolute bottom-4 left-1/2 transform -translate-x-1/2 
          bg-5 text-white px-4 py-2 rounded-full flex items-center transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2" size={16} />
          Add to Cart
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-gray-400 line-through mr-2">{product.oldprice}</span>
            <span className="text-5 font-bold">{product.price}</span>
          </div>
          <button className="text-gray-500 hover:text-red-500">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}