import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  
  return (
    <>
      <Header />
      <main className="py-16 bg-3">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-semibold text-center mb-12 playwrite">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl mb-6">Your cart is empty</p>
              <Link to="/categories" className="bg-5 text-white py-3 px-6 rounded-lg inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-4">
                    <tr>
                      <th className="py-4 px-6 text-left">Product</th>
                      <th className="py-4 px-6 text-center">Quantity</th>
                      <th className="py-4 px-6 text-right">Price</th>
                      <th className="py-4 px-6 text-right">Total</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 px-3 py-1 rounded-l"
                            >
                              -
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 px-3 py-1 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 playwrite">Order Summary</h2>
                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={clearCart}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium"
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="w-full bg-5 text-white py-3 rounded-lg font-medium"
                    onClick={() => alert("This is a static checkout. In a real app, this would proceed to checkout.")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}



