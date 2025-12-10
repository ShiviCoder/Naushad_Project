// screens/OurProducts/OurProducts.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
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

type RootStackParamList = {
  OurProducts: undefined;
  ProductDetails: { product: any };
  Cart: undefined;
};

type OurProductsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OurProducts'>;
};

const OurProducts = ({ navigation }: OurProductsProps) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
  // LOAD GENDER FROM HOMESCREEN (NO LOCAL TOGGLE)
  //--------------------------------------------------------------------
  useEffect(() => {
    const loadGenderFromHome = async () => {
      try {
        const savedGender = await AsyncStorage.getItem('selectedGender');
        console.log('🏠 Gender from HomeScreen:', savedGender);

        if (savedGender && savedGender !== 'null') {
          setGender(savedGender);
          console.log('✅ Using HomeScreen gender:', savedGender);
        } else {
          setGender('male'); // Default fallback
          console.log('🔄 Using default gender: male');
        }
      } catch (error) {
        console.log('❌ Error loading gender:', error);
        setGender('male');
      }
    };

    loadGenderFromHome();
  }, []);

  //--------------------------------------------------------------------
  // FETCH PRODUCTS (runs when gender loads)
  //--------------------------------------------------------------------
  useEffect(() => {
    if (gender) {
      fetchProducts();
    }
  }, [gender]);

  //--------------------------------------------------------------------
  // FETCH PRODUCTS
  //--------------------------------------------------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        console.log('❌ No token found. Cannot fetch products.');
        setLoading(false);
        return;
      }

      console.log('🎯 Using gender from HomeScreen →', gender);

      const response = await fetch('https://naushad.onrender.com/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      console.log('📦 FULL API RESPONSE:', json);

      if (!json?.success) {
        console.log('❌ API success false');
        setLoading(false);
        return;
      }

      let data = json.data || [];
      console.log('📌 RAW PRODUCTS:', data);

      // FILTER BY HOMESCREEN GENDER
      data = data.filter(
        item =>
          String(item.gender || '')
            .trim()
            .toLowerCase() === gender.toLowerCase()
      );

      console.log('🎯 FILTERED PRODUCTS (HomeScreen gender):', data);

      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.log('🔥 FETCH PRODUCTS ERROR:', error);
      Alert.alert('Error', 'Failed to fetch products. Try again.');
    } finally {
      setLoading(false);
    }
  };

  //--------------------------------------------------------------------
  // ON REFRESH
  //--------------------------------------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

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
  const handleAddToCart = async product => {
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
  // PRODUCT ITEM UI
  //--------------------------------------------------------------------
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        {
          backgroundColor: theme.dark ? '#1E1E1E' : '#fff',
          shadowColor: theme.dark ? '#000' : '#000',
        },
      ]}
      activeOpacity={0.7}
      onPress={() => safeNavigate(item)}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text
          numberOfLines={2}
          style={[
            styles.productName,
            { color: theme.dark ? '#fff' : '#000' },
          ]}>
          {item.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.productPrice,
              { color: theme.dark ? '#fff' : '#000' },
            ]}>
            ₹{item.price}
          </Text>

          {item.offer && (
            <Text style={styles.productOffer}>{item.offer}% off</Text>
          )}
        </View>

        {/* RATING */}
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                key={star}
                name="star"
                size={wp('3.5%')}
                color={
                  star <= item.rating
                    ? '#F6B745'
                    : theme.dark
                    ? '#555'
                    : '#DDD'
                }
              />
            ))}
          </View>
          <Text
            style={[
              styles.ratingText,
              { color: theme.dark ? '#999' : '#666' },
            ]}>
            ({item.reviews} reviews)
          </Text>
        </View>

        {/* TAG */}
        {item.tag && (
          <View
            style={[
              styles.tagContainer,
              { backgroundColor: theme.dark ? '#333' : '#F0F0F0' },
            ]}>
            <Text
              style={[
                styles.tagText,
                { color: theme.dark ? '#fff' : '#000' },
              ]}>
              {item.tag}
            </Text>
          </View>
        )}

        {/* ADD TO CART */}
        <TouchableOpacity
          style={[styles.addToCartBtn, { backgroundColor: COLORS.primary }]}
          onPress={e => {
            e.stopPropagation();
            handleAddToCart(item);
          }}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  //--------------------------------------------------------------------
  // LOADING SCREEN
  //--------------------------------------------------------------------
  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? '#121212' : '#fff' },
        ]}>
        <Head title="Our Products" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        
        </View>
      </SafeAreaView>
    );
  }

  //--------------------------------------------------------------------
  // MAIN RETURN (NO LOCAL GENDER TOGGLE)
  //--------------------------------------------------------------------
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#121212' : '#fff' },
      ]}>
      <Head title="Our Products" />

      {/* CURRENT GENDER DISPLAY (READONLY) */}
      {/* <View style={styles.genderDisplayContainer}>
        <Text style={[styles.currentGenderText, { color: theme.dark ? '#fff' : '#000' }]}>
          Showing {gender.charAt(0).toUpperCase() + gender.slice(1)} Products
        </Text>
      </View> */}

      {/* PRODUCT COUNT */}
      {/* <View style={styles.countContainer}>
        <Text
          style={[
            styles.countText,
            { color: theme.dark ? '#fff' : '#000' },
          ]}>
          {filteredProducts.length} Products Found
        </Text>
      </View> */}

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        numColumns={2}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inventory" size={wp('20%')} color={theme.dark ? '#666' : '#999'} />
            <Text style={[styles.emptyText, { color: theme.dark ? '#fff' : '#666' }]}>
              No {gender} products found
            </Text>
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: COLORS.primary }]}
              onPress={fetchProducts}>
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

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: hp('2%'), fontSize: wp('4%'), fontWeight: '500' },

  // READONLY GENDER DISPLAY
  genderDisplayContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  currentGenderText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    textAlign: 'center',
  },

  countContainer: { paddingHorizontal: wp('4%'), marginBottom: hp('1%') },
  countText: { fontSize: wp('4%'), fontWeight: '500' },

  productList: { paddingHorizontal: wp('2%'), paddingBottom: hp('8%') },

  productCard: {
    flex: 1,
    margin: wp('1.5%'),
    borderRadius: wp('3%'),
    elevation: 3,
    minHeight: hp('35%'),
    overflow: 'hidden',
  },

  productImage: { 
    width: '100%', 
    height: hp('18%'),
    borderTopLeftRadius: wp('3%'),
    borderTopRightRadius: wp('3%'),
  },

  productInfo: { padding: wp('3%'), flex: 1 },

  productName: { fontSize: wp('3.8%'), fontWeight: '600', minHeight: hp('4%') },

  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('1%') },
  productPrice: { fontSize: wp('4.5%'), fontWeight: '700' },
  productOffer: { fontSize: wp('3.5%'), color: '#29A244', marginLeft: wp('1%') },

  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('1%') },
  starsContainer: { flexDirection: 'row', marginRight: wp('2%') },
  ratingText: { fontSize: wp('3.2%') },

  tagContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
  },
  tagText: { fontSize: wp('3%'), fontWeight: '500' },

  addToCartBtn: { paddingVertical: hp('1%'), borderRadius: wp('2%'), alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: wp('3.5%'), fontWeight: '600' },

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
