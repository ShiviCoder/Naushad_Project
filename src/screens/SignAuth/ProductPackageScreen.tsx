import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ProductData from '../../components/useProductData';
import Card from '../../components/Cards';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/Colors';

const ProductPackageScreen = () => {
  const {theme} = useTheme();
  const [loading , setLoading] = useState(false);
  const [numColumns , setNumColumns] = useState(2);
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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchProductPackages(gender); // whenever gender changes
    }, [gender]);
    
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setNumColumns(width > height ? 4 : 2); // landscape → 5, portrait → 2
    };

    updateOrientation(); // initial check
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => subscription?.remove();
  }, []);

  if (loading) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={[styles.mainContainer,{backgroundColor : theme.background}]}>
      {/* Header */}
      <Head title="Product Packages"></Head>
      <View style={{paddingHorizontal : wp('3.5%')}}>
        <FlatList
        data={productData}
        numColumns={numColumns}
          key={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: hp('10%'),
          paddingTop: hp('2%'),
        }}
        renderItem={({ item }) => <Card item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: hp('4%') }} />}
      /> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom : hp('4%')
  
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    gap: wp('20%'),
  },
  iconImage: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  headText: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ProductPackageScreen;
