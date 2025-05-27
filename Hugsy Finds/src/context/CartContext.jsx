import { createContext, useState, useContext } from 'react';

// Create cart context
const CartContext = createContext();

// Static cart data
const mockCartItems = [
  {
    id: 1,
    name: "Vintage Teddy Bear",
    price: 29.99,
    image: "/images/products/teddy1.jpg",
    quantity: 1
  },
  {
    id: 2,
    name: "Handmade Wooden Toy",
    price: 19.99,
    image: "/images/products/toy1.jpg",
    quantity: 2
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  // Static cart functions
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? {...item, quantity: item.quantity + 1} 
            : item
        );
      }
      return [...prev, {...product, quantity: 1}];
    });
  };
  
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? {...item, quantity: Math.max(1, quantity)} 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
