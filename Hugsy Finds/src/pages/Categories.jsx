import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { categories, products } from '../data/staticData'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();
  
  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  return (
    <>
      <Header />
      <main className="py-16 bg-3">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-semibold text-center mb-12 playwrite">Shop by Categories</h1>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full ${activeCategory === 'all' ? 'bg-5 text-white' : 'bg-4 text-gray-800'}`}
            >
              All
            </button>
            
            {categories.map(category => (
              <button 
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-6 py-2 rounded-full ${activeCategory === category.slug ? 'bg-5 text-white' : 'bg-4 text-gray-800'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative product-image">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                  <button 
                    onClick={() => addToCart(product)}
                    className="addtocart absolute bottom-4 right-4 bg-5 text-white py-2 px-4 rounded-full transition-opacity duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
                  {!product.inStock && (
                    <p className="text-red-500 mt-1">Out of stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

