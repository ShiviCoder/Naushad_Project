import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import Head from '../../components/Head';
import FlatListComp from './FlatListComp';
import { useLikedProducts } from '../../context/LikedProductsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OurProducts = () => {
  const { likedProducts, toggleLike } = useLikedProducts();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
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
  const fetchProducts = async (selectedGender) => {
    try {
      const token = await getToken();
      if (!token) return;

      // 🔥 Final Gender (priority → function param > state > default)
      const g = (selectedGender || gender || "male").toLowerCase().trim();
      console.log("Selected Gender (Products):", g);

      const res = await fetch("https://naushad.onrender.com/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const json = await res.json();
      console.log("📦 Product Full Response:", json);

      if (!json?.success) return;

      let data = json.data || [];

      // 🔥 FINAL FILTER (exact same as product-packages)
      data = data.filter((item) =>
        String(item.gender || "")
          .trim()
          .toLowerCase() === g
      );

      console.log("Filtered Products:", data);

      setProducts(data);
    } catch (error) {
      console.log("🔥 Product error:", error);
    }
  };
  useEffect(() => {
    fetchProducts(gender);
  }, [gender]);
  const onRefresh = async () => {
    setRefreshing(true);

    // Animate down (pull)
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    await fetchProducts();

    // Animate back up
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Animated.ScrollView
        style={{ transform: [{ translateY }] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: hp('4%') }}
      >
        {/* Header should move together during pull */}
        <Head title="Our Products" />

        {/* Products List */}
        <FlatListComp
          products={products}
          likedProducts={likedProducts}
          onToggleLike={toggleLike}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default OurProducts;
const styles = StyleSheet.create({});