import image from '../assets/image.png'

export default function Instagram() {
  return (
    <div className='bg-2'>
        <div className="container mx-auto py-16">
            <h1 className="text-center text-4xl playwrite">
                #Hugsy Finds on Instagram
            </h1>
            <p className="mt-5 text-xl font-light text-center uppercase">
                do follow on instagram
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <img src={image} alt="Instagram Post" className="w-full object-cover" />
                <img src={image} alt="Instagram Post" className="w-full object-cover" />
                <img src={image} alt="Instagram Post" className="w-full object-cover" />
                <img src={image} alt="Instagram Post" className="w-full object-cover" />
            </div>

            <div className="p-3 font-bold uppercase bg-5 w-75 text-center mt-5 mx-auto">
                follow us on instagram
            </div>
        </div>
    </div>
  )
}
