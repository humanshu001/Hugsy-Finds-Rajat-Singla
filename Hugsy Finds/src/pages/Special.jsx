import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import image from '../assets/image.png'
import { Clock, Tag, Percent } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Special() {
  // Static offers data
  const offers = [
    { 
      id: 1, 
      title: "Summer Sale", 
      description: "Get amazing discounts on our summer collection",
      discount: "30% OFF",
      endDate: "August 31, 2024",
      bgColor: "bg-1"
    },
    { 
      id: 2, 
      title: "Bundle & Save", 
      description: "Purchase any two items and get the third one free",
      discount: "Buy 2 Get 1 Free",
      endDate: "Limited time offer",
      bgColor: "bg-2"
    },
    { 
      id: 3, 
      title: "New Customer Special", 
      description: "Special discount for first-time customers",
      discount: "15% OFF",
      endDate: "No expiration",
      bgColor: "bg-4"
    }
  ];

  return (
    <>
      <Header />
      <div className="bg-3 min-h-screen py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl playwrite text-center mb-6 text-black">Special Offers</h1>
          <p className="text-center mb-10 text-black">Discover our exclusive deals and limited-time offers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {offers.map(offer => (
              <div key={offer.id} className={`${offer.bgColor} p-8 rounded-lg shadow-md text-center`}>
                <div className="bg-5 text-white text-xl font-bold py-2 px-4 rounded-full inline-block mb-4">
                  {offer.discount}
                </div>
                <h3 className="text-2xl playwrite mb-4 text-black">{offer.title}</h3>
                <p className="mb-6 text-black">{offer.description}</p>
                <div className="flex items-center justify-center text-black mb-4">
                  <Clock size={18} className="mr-2" />
                  <span>Ends: {offer.endDate}</span>
                </div>
                <Link to="/categories" className="bg-5 text-white px-6 py-3 rounded-full inline-block">
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
          
          <div className="bg-2 p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-3xl playwrite mb-6 text-center text-black">Flash Sale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl playwrite mb-4 text-black">24 Hours Only!</h3>
                <p className="mb-4 text-black">
                  Don't miss our exclusive flash sale with discounts up to 50% off on selected items.
                  This offer is valid for 24 hours only, so hurry and grab your favorites before they're gone!
                </p>
                <div className="flex items-center text-black mb-4">
                  <Tag size={18} className="mr-2" />
                  <span>Use code: FLASH50</span>
                </div>
                <Link to="/categories" className="bg-5 text-white px-6 py-3 rounded-full inline-block">
                  Shop Flash Sale
                </Link>
              </div>
              <div className="flex justify-center">
                <img src={image} alt="Flash Sale" className="rounded-lg shadow-md max-w-full h-auto" />
              </div>
            </div>
          </div>
          
          <div className="bg-4 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl playwrite mb-6 text-center text-black">Loyalty Program</h2>
            <div className="text-center">
              <div className="bg-5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <Percent size={36} />
              </div>
              <h3 className="text-2xl playwrite mb-4 text-black">Earn Points, Get Rewards</h3>
              <p className="mb-6 text-black">
                Join our loyalty program and earn points on every purchase. Redeem your points for discounts, free products, or exclusive offers! 
              </p>
              <button 
                className="bg-5 text-white px-6 py-3 rounded-full"
                onClick={() => alert("This is a static loyalty program signup. In a real app, this would open a signup form.")}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}



