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
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTg5NDQwNCwiZXhwIjoxNzYyNDk5MjA0fQ.A6s4471HX6IE7E5B7beYSYkytO1B8M_CPpn-GZwWFsE'
      const token = getToken();
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