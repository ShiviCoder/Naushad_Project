// CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Product = {
  id: string;
  name?: string;
  title?: string;
  price: number;
  qty: number;
  discount?: string | number;
  oldPrice?: number;
};

type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  updateQty: (id: string, type: 'add' | 'sub') => void;
  removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
<<<<<<< HEAD
          item.id === product.id
            ? { ...item, qty: item.qty + product.qty }
            : item,
=======
          item.id === product.id ? { ...item, qty: item.qty + product.qty } : item
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        );
      }
      return [...prev, product];
    });
  };

  const updateQty = (id: string, type: 'add' | 'sub') => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
<<<<<<< HEAD
          ? {
              ...item,
              qty: type === 'add' ? item.qty + 1 : Math.max(1, item.qty - 1),
            }
          : item,
      ),
=======
          ? { ...item, qty: type === 'add' ? item.qty + 1 : Math.max(1, item.qty - 1) }
          : item
      )
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
<<<<<<< HEAD
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart }}
    >
=======
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart }}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
