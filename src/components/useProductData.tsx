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

  const [gender, setGender] = useState("male");

useEffect(() => {
  const loadGender = async () => {
    const savedGender = await AsyncStorage.getItem("selectedGender");

    console.log("Loaded Gender:", savedGender);

    // Fallback to male if null/undefined/"null"
    if (!savedGender || savedGender === "null") {
      setGender("male");
    } else {
      setGender(savedGender);
    }

      // ⭐ Remove saved gender so next time fresh value will be used
    await AsyncStorage.removeItem("selectedGender");
    console.log("Old gender removed from AsyncStorage");
  };

  loadGender();
}, []);


  const fetchProductPackages = async (selectedGender) => {
      try {
        const token = await getToken();
        if (!token) return;
  
        const g = (selectedGender || gender || "male").toLowerCase().trim();
        console.log("Selected Gender:", g);
  
        const response = await fetch(
          `https://naushad.onrender.com/api/product-packages`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const json = await response.json();
        console.log("📦 Full Response:", json);
  
        if (!json?.success) return;
  
        let data = json.data || [];
  
        // 🔥 FINAL FILTER
        data = data.filter((item) =>
          String(item.gender || "")
            .trim()
            .toLowerCase() === g
        );
  
        console.log("Filtered Data:", data);
  
        setProductData(data);
      } catch (err) {
        console.log("🔥 Product package error:", err);
      }
    };
  
    useEffect(() => {
      fetchProductPackages(gender); // whenever gender changes
    }, [gender]);
  
  return productData;
};

export default useProductData;