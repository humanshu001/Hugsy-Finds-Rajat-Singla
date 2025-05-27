import React from 'react'
import image from '../assets/image.png'

export default function HeroSection() {
  return (
    <div className='bg-2'>
      <div className="container mx-auto py-20 flex justify-center items-center gap-8 flex-wrap">
        <img src={image} alt="Hero" className="rounded-full w-40" />
        <img src={image} alt="Hero" className="rounded-full w-40" />
        <img src={image} alt="Hero" className="rounded-full w-40" />
        <img src={image} alt="Hero" className="rounded-full w-40" />
        <img src={image} alt="Hero" className="rounded-full w-40" />
        <img src={image} alt="Hero" className="rounded-full w-40" />
      </div>
    </div>
  )
}
