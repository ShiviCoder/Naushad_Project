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

const OurProducts = () => {
  const { likedProducts, toggleLike } = useLikedProducts();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const fetchProducts = async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // your token here
      const res = await fetch('https://naushad.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProducts(data.data);
    } catch (err) {
      console.log('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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