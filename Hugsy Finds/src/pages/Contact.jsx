import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
  }

  return (
    <>
      <Header />
      <div className="bg-3 min-h-screen py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl playwrite text-center mb-10 text-black">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-4 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl playwrite mb-6 text-black">Get in Touch</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-white text-black" 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border rounded bg-white text-black" 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-black">Message</label>
                  <textarea 
                    className="w-full p-2 border rounded h-32 bg-white text-black" 
                    required 
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-5 text-white px-6 py-3 rounded-full"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-2 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl playwrite mb-6 text-black">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="mr-4 text-5" />
                  <div>
                    <h3 className="font-medium text-black">Email</h3>
                    <p className="text-black">info@hugsyfinds.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="mr-4 text-5" />
                  <div>
                    <h3 className="font-medium text-black">Phone</h3>
                    <p className="text-black">+1 (234) 567-8900</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="mr-4 text-5" />
                  <div>
                    <h3 className="font-medium text-black">Address</h3>
                    <p className="text-black">123 Hugsy Street<br />Cozy Town, CT 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-1 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl playwrite mb-6 text-center text-black">Visit Our Store</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-4 text-black">
                  We'd love to meet you in person! Visit our flagship store to explore our full collection 
                  and experience the Hugsy Finds difference.
                </p>
                <div className="mb-4 text-black">
                  <h3 className="font-medium">Store Hours:</h3>
                  <p>Monday - Friday: 10am - 7pm</p>
                  <p>Saturday: 10am - 6pm</p>
                  <p>Sunday: 12pm - 5pm</p>
                </div>
                <button className="bg-5 text-white px-6 py-3 rounded-full">
                  Get Directions
                </button>
              </div>
              <div className="bg-4 p-4 rounded-lg">
                {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
                <div className="bg-white h-64 rounded flex items-center justify-center text-black">
                  <MapPin size={48} className="text-5" />
                  <span className="ml-2">Map Placeholder</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-5 p-8 rounded-lg shadow-md text-white">
            <h2 className="text-3xl playwrite mb-6 text-center">Join Our Newsletter</h2>
            <p className="text-center mb-6">
              Stay updated with our latest products, special offers, and exclusive events.
            </p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-3 rounded-l-lg bg-white text-black" 
                required
              />
              <button 
                type="submit" 
                className="bg-2 text-black px-6 py-3 rounded-r-lg font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
