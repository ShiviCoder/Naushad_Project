import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/PopUp';

type RootStackParamList = {
  OurProducts: undefined;
  ProductDetails: { product: any };
  CartPaymentScreen: undefined;
};

type ProductDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

// Local placeholder - SAME AS OurProducts
const PLACEHOLDER_IMAGE = require('../../assets/placeholder.jpg');

const ProductDetails = ({ navigation }: ProductDetailsProps) => {
  const route = useRoute<any>();
  const params = route.params || {};
  const product = params.product || {};

  // 🔥 LOG SELECTED PRODUCT TO CONSOLE
  console.log('🎯 PRODUCT DETAILS SCREEN - FULL PRODUCT DATA:');
  console.log('📦 Complete Product Object:', JSON.stringify(product, null, 2));

  const [count, setCount] = useState(1);
  const { theme } = useTheme();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
    setLoading(false);
  }, []);

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // 🔥 SAME IMAGE FALLBACK AS OurProducts
  const ProductImage = ({ uri }) => {
    if (!uri || imageError) {
      return (
        <Image
          source={PLACEHOLDER_IMAGE}
          style={styles.image}
          resizeMode="cover"
        />
      );
    }

    return (
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        onError={() => setImageError(true)}
        defaultSource={PLACEHOLDER_IMAGE}
      />
    );
  };

  const displayImage = Array.isArray(product.image)
    ? product.image[0]
    : product.image;

  // 🔥 SAVE FULL PRODUCT DATA TO ASYNC STORAGE
  const saveProductForPayment = async () => {
    try {
      const paymentProduct = {
        type: 'product',
        serviceName: product.name || 'Product',
        name: product.name || 'Product',
        price: product.price || 0,
        quantity: count,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        source: 'ProductDetails',
        productId: product._id || product.id || null,
        description: product.description || '',
        gender: product.gender || '',
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        tag: product.tag || '',
        offer: product.offer || '',
        originalProduct: product,
      };

      console.log('💾 SAVING PRODUCT FOR PAYMENT:', paymentProduct);
      await AsyncStorage.setItem(
        'buyNowProduct',
        JSON.stringify(paymentProduct),
      );
      console.log('✅ Product saved to AsyncStorage successfully');
      return paymentProduct;
    } catch (error) {
      console.error('❌ Error saving product to AsyncStorage:', error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      showPopup('User not found. Please sign in again.');
      return;
    }

    console.log('🛒 Adding to cart:', {
      userId,
      productId: product._id || product.id,
      productName: product.name,
      price: product.price,
      quantity: count,
    });

    try {
      const requestBody = {
        userId: userId,
        productId: product._id || product.id,
        productName: product.name || 'Product', // ✅ CHANGED: name → productName
        productDescription: product.description || 'Product Description', // ✅ CHANGED: Added productDescription
        price: product.price || 0,
        amount: (product.price || 0) * count, // ✅ CHANGED: Added amount as price * quantity
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        quantity: count,
      };

      console.log(
        '📤 CART API REQUEST BODY:',
        JSON.stringify(requestBody, null, 2),
      );

      const response = await fetch('https://naushad.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const res = await response.json();
      console.log('🛒 CART API RESPONSE:', res);

      if (response.ok && res.success) {
        showPopup('Product added to cart ✅');
      } else {
        showPopup(res.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Cart Error:', error);
      showPopup('Network error. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    try {
      console.log('🛍️ BUY NOW button clicked');

      const savedProduct = await saveProductForPayment();

      if (!savedProduct) {
        showPopup('Error saving product details. Please try again.');
        return;
      }

      navigation.navigate('CartPaymentScreen', {
        serviceName: product.name || 'Product',
        price: product.price || 0,
        quantity: count,
        productId: product._id || product.id,
        loadFromStorage: true,
        source: 'ProductDetails',
      });

      console.log('🚀 Navigating to CartPaymentScreen with product data');
    } catch (error) {
      console.error('❌ Error in handleBuyNow:', error);
      showPopup('Error processing purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? '#121212' : '#fff' },
        ]}
      >
        <Head title="Product Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#121212' : '#fff' },
      ]}
    >
      <Head title="Product Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('10%') }}
      >
        <View style={{ paddingHorizontal: wp('4%') }}>
          {/* Product Image - SAME FALLBACK AS OurProducts */}
          <ProductImage uri={displayImage} />

          {/* Product Details */}
          <View style={styles.detailContain}>
            <Text
              style={[styles.prodName, { color: theme.dark ? '#fff' : '#000' }]}
            >
              {product.name || 'Product Name'}
            </Text>
            <Text
              style={[
                styles.prodPrice,
                { color: theme.dark ? '#fff' : '#000' },
              ]}
            >
              ₹{product.price || 0}
            </Text>

            <View style={styles.ratingContain}>
              <View style={styles.starContain}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={wp('5%')}
                    color={
                      i < (product.rating || 0)
                        ? '#F6B745'
                        : theme.dark
                        ? '#ACACAC'
                        : '#E0E0E0'
                    }
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.reviews,
                  { color: theme.dark ? '#777' : '#666' },
                ]}
              >
                ({product.reviews || 0} reviews)
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.desc, { color: theme.dark ? '#fff' : '#000' }]}>
            {product.description || 'No description available'}
          </Text>

          {/* Quantity Selector */}
          <View
            style={[
              styles.countContain,
              { backgroundColor: theme.dark ? '#333' : '#F8F9FA' },
            ]}
          >
            <TouchableOpacity
              style={styles.countBtn}
              onPress={() => setCount(count > 1 ? count - 1 : count)}
            >
              <Text
                style={[
                  styles.countBtnTxt,
                  { color: theme.dark ? '#fff' : '#495057' },
                ]}
              >
                -
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.countTxt,
                { color: theme.dark ? '#fff' : '#212529' },
              ]}
            >
              {count}
            </Text>

            <TouchableOpacity
              style={styles.countBtn}
              onPress={() => setCount(count + 1)}
            >
              <Text
                style={[
                  styles.countBtnTxt,
                  { color: theme.dark ? '#fff' : '#495057' },
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnContain}>
            <TouchableOpacity
              style={[
                styles.cartButton,
                {
                  borderColor: theme.dark ? '#fff' : COLORS.primary,
                  borderWidth: theme.dark ? 1.5 : 2,
                },
              ]}
              onPress={handleAddToCart}
            >
              <Text
                style={[
                  styles.cartTxt,
                  { color: theme.dark ? '#fff' : COLORS.primary },
                ]}
              >
                Add to cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBuyNow}
              style={[styles.buyButton, { backgroundColor: COLORS.primary }]}
            >
              <Text style={styles.buyTxt}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: wp('90%'),
    height: hp('28%'),
    borderRadius: wp('4%'),
    alignSelf: 'center',
    marginBottom: hp('3%'),
    resizeMode: 'cover',
  },
  detailContain: {
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
    gap: hp('1%'),
    paddingHorizontal: wp('3%'),
  },
  prodName: {
    fontSize: wp('7%'),
    fontWeight: '600',
    textAlign: 'left',
  },
  prodPrice: {
    fontSize: wp('6%'),
    fontWeight: '700',
  },
  ratingContain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginTop: hp('1%'),
  },
  starContain: {
    flexDirection: 'row',
  },
  reviews: {
    fontSize: wp('3.5%'),
  },
  desc: {
    width: '90%',
    alignSelf: 'flex-start',
    fontSize: wp('5%'),
    fontWeight: '400',
    marginBottom: hp('2%'),
    paddingHorizontal: wp('3%'),
    lineHeight: wp('6.5%'),
  },
  countContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.2%'),
    width: wp('38%'),
    alignSelf: 'flex-start',
    marginBottom: hp('4%'),
  },
  countBtn: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2.5%'),
  },
  countBtnTxt: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  countTxt: {
    fontSize: wp('4.8%'),
    fontWeight: '700',
    minWidth: wp('10%'),
    textAlign: 'center',
  },
  btnContain: {
    width: '100%',
    alignSelf: 'center',
    gap: hp('2.5%'),
    paddingHorizontal: wp('3%'),
  },
  cartButton: {
    width: '100%',
    height: hp('6.5%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    width: '100%',
    height: hp('6.5%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartTxt: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
  },
  buyTxt: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#fff',
  },
});
