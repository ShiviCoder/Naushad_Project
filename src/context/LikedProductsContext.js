<<<<<<< HEAD
import React, { createContext, useContext, useState } from 'react';
=======
import React, { createContext, useContext, useState } from "react";
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

const LikedProductsContext = createContext();

export const LikedProductsProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);

<<<<<<< HEAD
  const toggleLike = id => {
    setLikedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
=======
  const toggleLike = (id) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    );
  };

  return (
    <LikedProductsContext.Provider value={{ likedProducts, toggleLike }}>
      {children}
    </LikedProductsContext.Provider>
  );
};

export const useLikedProducts = () => {
  const context = useContext(LikedProductsContext);
<<<<<<< HEAD
  if (!context)
    throw new Error(
      'useLikedProducts must be used within LikedProductsProvider',
    );
=======
  if (!context) throw new Error("useLikedProducts must be used within LikedProductsProvider");
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  return context;
};
