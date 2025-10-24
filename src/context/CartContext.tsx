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
          item.id === product.id ? { ...item, qty: item.qty + product.qty } : item
        );
      }
      return [...prev, product];
    });
  };

  const updateQty = (id: string, type: 'add' | 'sub') => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, qty: type === 'add' ? item.qty + 1 : Math.max(1, item.qty - 1) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
