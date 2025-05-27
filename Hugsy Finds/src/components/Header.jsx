import React, { useState } from 'react'
import { AlignLeft, BadgePercent, Facebook, Instagram, PhoneCall, Search, ShoppingCart, TicketPercent, Youtube, X, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-2">
        <div className="w-full p-2 container mx-auto">
            <div className="bg-5 rounded-2xl w-full p-4 text-center mt-4 text-white">
                ✨ Welcome to Hugsy Finds ✨
            </div>
            <div className="bg-1 rounded-2xl w-full p-4 text-center mt-4 flex justify-between items-center">
                <TicketPercent />
                Get ready to discover the best deals on the web!
                <BadgePercent />
            </div>

            <div className="mt-8 flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <AlignLeft />
                    <Link to="/" className="ml-2 text-3xl playwrite">Hugsy Finds</Link>
                </div>
                
                {/* Mobile menu button */}
                <button 
                  className="md:hidden text-black"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                {/* Desktop navigation */}
                <div className="hidden md:flex justify-end items-center space-x-8">
                    <Link to="/" className="text-black hover:text-5 transition-colors">Home</Link>
                    <Link to="/categories" className="text-black hover:text-5 transition-colors">Categories</Link>
                    <Link to="/special" className="text-black hover:text-5 transition-colors">Special</Link>
                    <Link to="/contact" className="text-black hover:text-5 transition-colors">Contact</Link>
                    <Link to="/about" className="text-black hover:text-5 transition-colors">About</Link>
                    <button className="text-black hover:text-5 transition-colors"><Search/></button>
                    <Link to="/cart" className="text-black hover:text-5 transition-colors"><ShoppingCart/></Link>
                </div>
            </div>
            
            {/* Mobile navigation */}
            {isMenuOpen && (
              <div className="md:hidden bg-white rounded-lg shadow-lg mt-4 p-4 absolute z-50 left-0 right-0 mx-2">
                <div className="flex flex-col space-y-4">
                  <Link to="/" className="text-black hover:text-5 transition-colors py-2 border-b">Home</Link>
                  <Link to="/categories" className="text-black hover:text-5 transition-colors py-2 border-b">Categories</Link>
                  <Link to="/special" className="text-black hover:text-5 transition-colors py-2 border-b">Special</Link>
                  <Link to="/contact" className="text-black hover:text-5 transition-colors py-2 border-b">Contact</Link>
                  <Link to="/about" className="text-black hover:text-5 transition-colors py-2 border-b">About</Link>
                  <div className="flex justify-between py-2">
                    <button className="text-black hover:text-5 transition-colors"><Search/></button>
                    <Link to="/cart" className="text-black hover:text-5 transition-colors"><ShoppingCart/></Link>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="fixed w-11 rounded-r-2xl h-50 bg-5 flex flex-col justify-between items-center py-4 text-white">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube /></a>
            <a href="tel:+1234567890"><PhoneCall /></a>
        </div>
    </div>
  )
}
