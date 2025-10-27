// src/components/useProductData.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useProductData = () => {
  const [productData, setProductData] = useState([]);

const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }
  const fetchProductData = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg'
      const response = await fetch('https://naushad.onrender.com/api/product-packages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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