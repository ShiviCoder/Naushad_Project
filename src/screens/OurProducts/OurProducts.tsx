// screens/OurProducts/OurProducts.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import COLORS from '../../utils/Colors';

// Local placeholder - SAME AS COMPONENT
const PLACEHOLDER_IMAGE = require('../../assets/placeholder.jpg');

type RootStackParamList = {
  OurProducts: undefined;
  ProductDetails: { product: any };
  Cart: undefined;
};

type OurProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OurProducts'>;
};

// 🔥 REUSABLE IMAGE COMPONENT - SAME AS REFERENCE
const ProductImage = ({ uri, style }: { uri?: string; style: any }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <Image source={PLACEHOLDER_IMAGE} style={style} resizeMode="cover" />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const OurProducts = ({ navigation }: OurProductsProps) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  //--------------------------------------------------------------------
  // GET TOKEN
  //--------------------------------------------------------------------
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('📌 Token fetched:', token ? token : '❌ No token found');
      return token;
    } catch (e) {
      console.log('❌ Token fetch error:', e);
      return null;
    }
  };

  //--------------------------------------------------------------------
  // LOAD GENDER - PROPER LOGIC FROM PACKAGES REFERENCE
  //--------------------------------------------------------------------
  useEffect(() => {
    const loadGender = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');
        console.log('Loaded Gender:', savedGender);

        // ✅ PROPER GENDER LOGIC: saved > default
        if (savedGender && savedGender !== 'null') {
          const normalizedGender = savedGender.toLowerCase().trim();
          setGender(
            normalizedGender === 'male' || normalizedGender === 'female'
              ? normalizedGender
              : 'male',
          );
          console.log('✅ Valid Gender Set:', normalizedGender);
        } else {
          console.log('⚠️ No valid saved gender, using default: male');
          setGender('male');
        }

        // ⭐ Clear saved gender after use for fresh value next time
        await AsyncStorage.removeItem('selectedGender');
        console.log('🗑️ Old gender cleared from AsyncStorage');
      } catch (error) {
        console.log('❌ Gender load error:', error);
        setGender('male'); // Fallback to default
      }
    };

    loadGender();
  }, []);

  //--------------------------------------------------------------------
  // FETCH PRODUCTS - PROPER GENDER FILTER FROM PACKAGES REFERENCE
  //--------------------------------------------------------------------
  const fetchProducts = async (selectedGender = null) => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        console.log('❌ No token available');
        setLoading(false);
        return;
      }

      // 🔥 PROPER GENDER PRIORITY: selectedGender > state > default
      let finalGender = 'male';
      if (selectedGender) {
        finalGender = selectedGender.toLowerCase().trim();
      } else if (gender && gender !== 'null') {
        finalGender = gender.toLowerCase().trim();
      }

      // ✅ Validate gender value
      if (!['male', 'female'].includes(finalGender)) {
        finalGender = 'male';
      }

      console.log('🔍 Fetching products for gender:', finalGender);

      const response = await fetch(
        'https://naushad.onrender.com/api/products',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      console.log('📦 Products Full Response:', json);

      if (!json?.success) {
        console.log('❌ API response not successful');
        setLoading(false);
        return;
      }

      let data = json.data || [];

      // 🔥 FILTER BY VALIDATED GENDER - SAME AS PACKAGES
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === finalGender,
      );

      console.log(
        '✅ Filtered Products for',
        finalGender,
        ':',
        data.length,
        'items',
      );
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log('🔥 Products fetch error:', error);
      Alert.alert('Error', 'Failed to fetch products. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch products whenever gender changes
  useEffect(() => {
    if (gender) {
      fetchProducts(gender);
    }
  }, [gender]);

  // 👇 COMMENTED OUT: RefreshControl functionality
  /*
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  */

  //--------------------------------------------------------------------
  // SAFE NAVIGATION
  //--------------------------------------------------------------------
  const safeNavigate = (product: any) => {
    if (!product) {
      Alert.alert('Error', 'Invalid product data');
      return;
    }
    navigation.navigate('ProductDetails', { product });
  };

  //--------------------------------------------------------------------
  // ADD TO CART
  //--------------------------------------------------------------------
  const handleAddToCart = async (product: any) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'You must log in first');
        return;
      }

      const body = {
        userId,
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      };

      const response = await fetch('https://naushad.onrender.com/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const res = await response.json();

      console.log('🛒 CART RESPONSE:', res);

      if (res.success) {
        Alert.alert('Success', 'Product added to cart');
      } else {
        Alert.alert('Error', res.message || 'Failed to add to cart');
      }
    } catch (e) {
      console.log('❌ CART ERROR:', e);
      Alert.alert('Error', 'Network error');
    }
  };

  //--------------------------------------------------------------------
  // PRODUCT ITEM UI - SAME AS REFERENCE COMPONENT
  //--------------------------------------------------------------------
  const renderProductItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        {
          backgroundColor: theme.dark ? '#1E1E1E' : '#fff',
          shadowColor: theme.dark ? '#000' : '#000',
        },
      ]}
      activeOpacity={0.9}
      onPress={() => safeNavigate(item)}
    >
      {/* 🔥 SAME ProductImage COMPONENT */}
      <ProductImage uri={item.image} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text
          numberOfLines={2}
          style={[styles.productName, { color: theme.dark ? '#fff' : '#000' }]}
        >
          {item.name || 'Product Name'}
        </Text>

        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.productPrice,
              { color: theme.dark ? '#fff' : '#000' },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            ₹{item.price || '0'}
          </Text>

          {item.offer && (
            <Text style={styles.productOffer}>{item.offer}% off</Text>
          )}
        </View>

        {/* RATING - SAME AS REFERENCE */}
        {item.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <Icon
                  key={star}
                  name="star"
                  size={wp('3%')}
                  color={
                    star <= (item.rating || 0)
                      ? '#F6B745'
                      : theme.dark
                      ? '#555'
                      : '#E0E0E0'
                  }
                />
              ))}
            </View>
            <Text
              style={[
                styles.ratingText,
                { color: theme.dark ? '#999' : '#666' },
              ]}
            >
              ({item.reviews || 0} reviews)
            </Text>
          </View>
        )}

        {/* TAG - SAME AS REFERENCE */}
        {item.tag && (
          <View
            style={[
              styles.tagContainer,
              { backgroundColor: theme.dark ? '#333' : '#F8F9FA' },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: theme.dark ? '#fff' : '#495057' },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.tag}
            </Text>
          </View>
        )}

        {/* ADD TO CART BUTTON */}
        <TouchableOpacity
          style={[styles.addToCartBtn, { backgroundColor: COLORS.primary }]}
          onPress={e => {
            e.stopPropagation();
            handleAddToCart(item);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  //--------------------------------------------------------------------
  // LOADING SCREEN
  //--------------------------------------------------------------------
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? '#121212' : '#fff' },
        ]}
      >
        <Head title="Our Products" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  //--------------------------------------------------------------------
  // MAIN RETURN
  //--------------------------------------------------------------------
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#121212' : '#fff' },
      ]}
    >
      <Head title="Our Products" />

      {/* PRODUCT LIST - 2 COLUMN GRID */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        numColumns={2}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        // 👇 REMOVED: refreshControl prop
        /*
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        */
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="inventory"
              size={wp('20%')}
              color={theme.dark ? '#666' : '#999'}
            />
            <Text
              style={[
                styles.emptyText,
                { color: theme.dark ? '#fff' : '#666' },
              ]}
            >
              No {gender} products found
            </Text>
            <TouchableOpacity
              style={[
                styles.refreshButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={fetchProducts}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default OurProducts;

const styles = StyleSheet.create({
  container: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productList: {
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('8%'),
  },

  // 🔥 SAME STYLES AS REFERENCE COMPONENT
  productCard: {
    flex: 1,
    margin: wp('1.5%'),
    borderRadius: wp('3.5%'),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    minHeight: hp('38%'),
    overflow: 'hidden',
  },

  productImage: {
    width: '100%',
    height: hp('19%'),
    borderTopLeftRadius: wp('3.5%'),
    borderTopRightRadius: wp('3.5%'),
  },

  productInfo: {
    flex: 1,
    padding: wp('3.2%'),
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: wp('3.6%'),
    fontWeight: '600',
    lineHeight: wp('4.8%'),
    marginBottom: hp('0.8%'),
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.2%'),
  },
  productPrice: {
    fontSize: wp('4.3%'),
    fontWeight: '800',
    flex: 1,
  },
  productOffer: {
    fontSize: wp('3.2%'),
    color: '#28A745',
    fontWeight: '700',
    backgroundColor: '#D4EDDA',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1.5%'),
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: wp('2.5%'),
  },
  ratingText: {
    fontSize: wp('3.1%'),
    fontWeight: '500',
  },

  tagContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('2.8%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('1.8%'),
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tagText: {
    fontSize: wp('3%'),
    fontWeight: '600',
  },

  addToCartBtn: {
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  addToCartText: {
    color: '#fff',
    fontSize: wp('3.6%'),
    fontWeight: '600',
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4.5%'),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: hp('2%'),
    marginBottom: hp('3%'),
  },
  refreshButton: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});
