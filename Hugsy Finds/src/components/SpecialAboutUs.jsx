import React from 'react'
import image from '../assets/image.png'

export default function SpecialAboutUs() {
  return (
    <div className="bg-1">
        <div className='grid grid-cols-1 sm:grid-cols-2'>
            <img src={image} alt="Special About Us" className='w-full' />
            <div className="flex flex-col space-y-6 p-18 gap-10">
                <h1 className="playwrite text-5xl">What Special Hugsy Finds offer?</h1>
                <p className='text-xl font-light text-justify'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, dolorum. Iste eos deleniti corporis, maxime, exercitationem odit ullam natus minus earum eligendi deserunt omnis laboriosam facere illo incidunt eaque ratione consequuntur mollitia sequi? Rem voluptatibus repudiandae quos soluta pariatur assumenda, cumque non itaque. Placeat maiores similique ullam, necessitatibus ducimus laudantium, beatae, obcaecati consequuntur voluptatibus dolore temporibus. Quo ducimus harum esse sunt reprehenderit perspiciatis id, amet sit fugit? Optio magni ipsam ex dolore, autem obcaecati repellendus culpa similique vel quaerat quisquam laboriosam facilis beatae architecto, at neque fuga quasi expedita quis numquam? Minima a ullam deleniti nam dolorum architecto sequi ipsa ipsam eum molestiae totam quam expedita corporis doloribus sint iure, voluptatum mollitia ab nesciunt veritatis sapiente sit quas. Doloribus dolor omnis et, obcaecati quas pariatur tempore sed! Ea ducimus inventore reprehenderit, debitis, sed ut unde aliquam, assumenda velit porro adipisci illo in cum. Minima blanditiis explicabo quam optio pariatur et nostrum unde aut recusandae nam modi accusantium quae id dolore similique natus ipsum, dolor cupiditate ipsa tempora quisquam deleniti veritatis. Quis corporis in iste earum cupiditate ea similique ipsum sit neque, illo quam nostrum architecto delectus. Maxime, accusamus. Ex, molestiae vitae! Quis natus iste, iusto enim possimus asperiores veniam eaque.</p>
            </div>
        </div>
    </div>
  )
}
