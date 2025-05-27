import { reviews } from '../data/staticData';

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-3">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12 playwrite">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {/* Star rating */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">"{review.comment}"</p>
              
              <div className="flex justify-between items-center">
                <p className="font-medium">{review.name}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
