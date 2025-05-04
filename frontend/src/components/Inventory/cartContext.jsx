import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i._id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i._id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);