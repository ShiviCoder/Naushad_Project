// src/components/useProductData.js
import { useEffect, useState } from "react";

const useProductData = () => {
  const [productData, setProductData] = useState([]);

  const fetchProductData = async () => {
    try {
      const response = await fetch('https://naushad.onrender.com/api/product-packages', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDUyMTE4OCwiZXhwIjoxNzYxMTI1OTg4fQ.haFkDaIdOrq85-Z1LMnweYsEXT8CrB0aavDdkargyi8',
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log("✅ Product package response:", json);
      setProductData(json.data || []);
    } catch (err) {
      console.log("❌ Product package error:", err);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return productData;
};

export default useProductData;
