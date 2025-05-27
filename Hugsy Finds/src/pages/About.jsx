import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import image from '../assets/image.png'
import SpecialAboutUs from '../components/SpecialAboutUs'

export default function About() {
  return (
    <>
      <Header />
      <div className="bg-3 min-h-screen py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl playwrite text-center mb-10 text-black">About Hugsy Finds</h1>
          
          <div className="bg-4 p-8 rounded-lg shadow-md mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl playwrite mb-6 text-black">Our Story</h2>
                <p className="mb-4 text-black">
                  Hugsy Finds was born out of a passion for unique, high-quality products that bring joy and comfort to everyday life. 
                  Founded in 2020, we've been on a mission to curate a collection of special items that make your home cozier and your life happier.
                </p>
                <p className="mb-4 text-black">
                  Our team of dedicated curators travels the world to discover artisanal crafts, vintage treasures, and innovative designs 
                  that you won't find anywhere else. We believe that every item in your home should tell a story and bring you joy.
                </p>
                <p className="text-black">
                  From handcrafted toys to bespoke home décor, each Hugsy Find is selected with care and attention to quality, 
                  sustainability, and that special something that makes it truly unique.
                </p>
              </div>
              <div className="flex justify-center">
                <img src={image} alt="Our Story" className="rounded-lg shadow-md max-w-full h-auto" />
              </div>
            </div>
          </div>
          
          <div className="bg-2 p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-3xl playwrite mb-6 text-center text-black">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Sustainability</h3>
                <p className="text-black">We prioritize eco-friendly products and packaging to minimize our environmental footprint.</p>
              </div>
              <div className="text-center">
                <div className="bg-5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Community</h3>
                <p className="text-black">We support small businesses and artisans, fostering a global community of creators.</p>
              </div>
              <div className="text-center">
                <div className="bg-5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Quality</h3>
                <p className="text-black">We never compromise on quality, ensuring each product meets our high standards.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-1 p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-3xl playwrite mb-6 text-center text-black">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="text-center bg-4 p-4 rounded-lg">
                  <img src={image} alt={`Team Member ${item}`} className="w-40 h-40 object-cover rounded-full mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black">Team Member {item}</h3>
                  <p className="text-black">Position</p>
                </div>
              ))}
            </div>
          </div>
          
          <SpecialAboutUs />
        </div>
      </div>
      <Footer />
    </>
  )
}

