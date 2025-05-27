import { products } from '../data/staticData';
import { useCart } from '../context/CartContext';

export default function BestSellingProducts() {
  const { addToCart } = useCart();
  
  // Filter only best selling products
  const bestSellers = products.filter(product => product.isBestSeller);
  
  return (
    <section className="py-16 bg-3">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12 playwrite">Best Selling Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map(product => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
