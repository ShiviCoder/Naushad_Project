import React, { createContext, useContext, useState } from "react";

const LikedProductsContext = createContext();

export const LikedProductsProvider = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState([]);

  const toggleLike = (id) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
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
  if (!context) throw new Error("useLikedProducts must be used within LikedProductsProvider");
  return context;
};
