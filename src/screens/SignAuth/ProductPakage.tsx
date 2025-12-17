import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/PopUp';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductPackages = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const { theme } = useTheme();
  const route = useRoute();
  const { item } = route.params || {};
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullProductData, setFullProductData] = useState(null);

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

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('🆔 User ID fetched:', storedUserId);
        setUserId(storedUserId);
      } catch (error) {
        console.error('❌ Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  // Process and store full product data
  useEffect(() => {
    if (item) {
      console.log('📦 Processing product data:', item);

      // Create complete product object with all details
      const productData = {
        _id: item._id || item.id || Date.now().toString(),
        productId: item._id || item.id || Date.now().toString(),
        productPackageId: item._id || item.id || Date.now().toString(),
        name: item.name || item.title || 'Product',
        title: item.name || item.title || 'Product',
        serviceName: item.name || item.title || 'Product',
        price: item.price || 0,
        originalPrice: item.originalPrice || item.price || 0,
        image: item.image || item.imageUrl || 'https://via.placeholder.com/400',
        description:
          item.description || item.desc || 'No description available.',
        category: item.category || 'product',
        type: 'product',
        items: item.items || [],
        usage: item.usage || 'Follow instructions',
        review: item.review || 0,
        rating: item.rating || 4,
        quantity: 1,
        source: 'ProductPackages',
        createdAt: new Date().toISOString(),
      };

      console.log('📋 Full product data prepared:', productData);
      setFullProductData(productData);
      setLoading(false);
    } else {
      console.log('❌ No item data in params');
      setLoading(false);
    }
  }, [item]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(prev => prev - 1);

  const renderStars = (rating = 4) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name={i < Math.floor(rating) ? 'star' : 'star-outline'}
        size={wp(5)}
        color="#F6B745"
        style={styles.star}
      />
    ));
  };

  const showPopup = (message: string, autoClose = false) => {
    setPopupMessage(message);
    setPopupVisible(true);

    // Auto close popup after 1 second if requested
    if (autoClose) {
      setTimeout(() => {
        setPopupVisible(false);
      }, 1000);
    }
  };

  const saveProductForPayment = async () => {
    try {
      // Prepare complete product data for payment
      const paymentProduct = {
        type: 'product',
        serviceName: fullProductData.name || 'Product',
        name: fullProductData.name || 'Product',
        price: fullProductData.price || 0,
        quantity: quantity,
        image: fullProductData.image,
        source: 'ProductPackages',
        productId: fullProductData._id || fullProductData.id || null,
        // Additional product details
        description: fullProductData.description || '',
        items: fullProductData.items || [],
        usage: fullProductData.usage || '',
        rating: fullProductData.rating || 0,
        review: fullProductData.review || 0,
        // Original product object for reference
        originalProduct: fullProductData,
      };

      console.log('💾 SAVING PRODUCT FOR PAYMENT:');
      console.log(
        '📋 Payment Product Data:',
        JSON.stringify(paymentProduct, null, 2),
      );

      // Save to AsyncStorage
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
      showPopup('User not found. Please sign in again.', false);
      return;
    }

    console.log('🛒 Adding to cart:', {
      userId,
      productId: fullProductData._id || fullProductData.id,
      productName: fullProductData.name,
      price: fullProductData.price,
      quantity: quantity,
    });

    try {
      const requestBody = {
        userId: userId,
        productId: fullProductData._id || fullProductData.id,
        productName: fullProductData.name || 'Product', // ✅ CHANGED: name → productName
        productDescription:
          fullProductData.description || 'Product Description', // ✅ CHANGED: Added productDescription
        price: fullProductData.price || 0,
        amount: (fullProductData.price || 0) * quantity, // ✅ CHANGED: Added amount as price * quantity
        image: fullProductData.image,
        quantity: quantity,
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
        showPopup('Product added to cart ✅', true); // ✅ Auto-close after 1 second
      } else {
        showPopup(res.message || 'Failed to add product to cart', false);
      }
    } catch (error) {
      console.error('Cart Error:', error);
      showPopup('Network error. Please try again.', false);
    }
  };

  const handleBuyNow = async () => {
    try {
      console.log('🛍️ BUY NOW button clicked');

      // 1. Save full product data to AsyncStorage
      const savedProduct = await saveProductForPayment();

      if (!savedProduct) {
        showPopup('Error saving product details. Please try again.', false);
        return;
      }

      // 2. Navigate to CartPaymentScreen with minimal data
      navigation.navigate('CartPaymentScreen', {
        // Pass only essential data through params
        serviceName: fullProductData.name || 'Product',
        price: fullProductData.price || 0,
        quantity: quantity,
        productId: fullProductData._id || fullProductData.id,
        // Flag to indicate we should load from AsyncStorage
        loadFromStorage: true,
        source: 'ProductPackages',
      });

      console.log('🚀 Navigating to CartPaymentScreen with product data');
    } catch (error) {
      console.error('❌ Error in handleBuyNow:', error);
      showPopup('Error processing purchase. Please try again.', false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Head title="Product Package" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: theme.textPrimary, marginTop: hp(2) }}>
            Loading product details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!fullProductData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Head title="Product Package" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>
            Product data not available
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Head title="Product Package" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageError ? (
            <View style={styles.placeholderContainer}>
              <Image
                source={require('../../assets/placeholder.jpg')}
                style={styles.placeholderImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Image
              source={{ uri: fullProductData.image }}
              style={styles.productImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
              defaultSource={require('../../assets/placeholder.jpg')}
            />
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titlePriceRow}>
            <Text
              style={[styles.productTitle, { color: theme.textPrimary }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {fullProductData.name}
            </Text>
            <Text style={[styles.price, { color: COLORS.primary }]}>
              ₹{fullProductData.price}
            </Text>
          </View>

          {/* Rating and Review */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(fullProductData.rating)}
              </View>
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
                {fullProductData.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
              ({fullProductData.review} reviews)
            </Text>
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {fullProductData.description}
          </Text>

          {/* Items List */}
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Items Included
          </Text>
          {Array.isArray(fullProductData.items) &&
          fullProductData.items.length > 0 ? (
            <View style={styles.itemsContainer}>
              {fullProductData.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Icon name="checkmark-circle" size={wp(4)} color="#4CAF50" />
                  <Text
                    style={[styles.itemText, { color: theme.textPrimary }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.noItemsText, { color: theme.textSecondary }]}>
              No items listed
            </Text>
          )}

          {/* Usage Instructions */}
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Usage Instructions
          </Text>
          <Text style={[styles.usageText, { color: theme.textSecondary }]}>
            {fullProductData.usage}
          </Text>

          {/* Quantity Selector */}
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Quantity
          </Text>
          <View
            style={[
              styles.quantityContainer,
              { backgroundColor: theme.dark ? '#F8F9FA' : '#000000' }, //333 //F8F9FA
            ]}
          >
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decreaseQuantity}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: theme.dark ? '#000000' : '#fff' }, //495057 fff
                ]}
              >
                -
              </Text>
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text
                style={[
                  styles.quantityText,
                  { color: theme.dark ? '#000000' : '#fff' }, //212529 fff
                ]}
              >
                {quantity}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={increaseQuantity}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  { color: theme.dark ? '#000000' : '#fff' }, // 495057 fff
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>

          {/* Total Price */}
          <Text style={[styles.totalText, { color: theme.textSecondary }]}>
            Total: ₹{(fullProductData.price * quantity).toFixed(2)}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                {
                  borderColor: theme.dark ? '#fff' : COLORS.primary,
                  borderWidth: theme.dark ? 1.5 : 2,
                },
              ]}
              onPress={handleAddToCart}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.addToCartText,
                  { color: theme.dark ? '#fff' : COLORS.primary },
                ]}
              >
                Add to cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buyNowButton, { backgroundColor: COLORS.primary }]}
              onPress={handleBuyNow}
              activeOpacity={0.7}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Popup - Auto closes for success messages */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  errorText: {
    fontSize: wp(4.5),
    textAlign: 'center',
    marginBottom: hp(3),
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
  },
  backButtonText: {
    color: '#fff',
    fontSize: wp(3.8),
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(5),
  },
  imageContainer: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderRadius: wp(4),
    overflow: 'hidden',
    height: hp(28),
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '80%',
    height: '80%',
    opacity: 0.5,
  },
  productInfo: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
    paddingHorizontal: wp(1),
  },
  productTitle: {
    flex: 1,
    fontSize: wp(7),
    fontWeight: '600',
    lineHeight: wp(7.5),
    marginRight: wp(2),
  },
  price: {
    fontSize: wp(6),
    fontWeight: '700',
  },
  ratingContainer: {
    alignItems: 'flex-start',
    marginBottom: hp(2),
    paddingHorizontal: wp(1),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: wp(3),
  },
  star: {
    marginRight: wp(1),
  },
  ratingText: {
    fontSize: wp(3.8),
    fontWeight: '600',
  },
  reviewText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  description: {
    fontSize: wp(3.8),
    lineHeight: wp(5),
    marginBottom: hp(3),
    paddingHorizontal: wp(1),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: '700',
    marginBottom: hp(1.5),
    marginTop: hp(1),
    paddingHorizontal: wp(1),
  },
  itemsContainer: {
    marginBottom: hp(2),
    paddingHorizontal: wp(1),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0),
    paddingVertical: hp(0.1),
  },
  itemText: {
    fontSize: wp(3.8),
    marginLeft: wp(2),
    flex: 1,
    lineHeight: wp(4.5),
  },
  noItemsText: {
    fontSize: wp(3.8),
    fontStyle: 'italic',
    marginBottom: hp(2),
    paddingHorizontal: wp(1),
  },
  usageText: {
    fontSize: wp(3.8),
    lineHeight: wp(5),
    marginBottom: hp(3),
    paddingHorizontal: wp(1),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
    paddingVertical: hp(1),
    width: wp(35),
    marginBottom: hp(4),
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  quantityButton: {
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
  },
  quantityButtonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  quantityDisplay: {
    minWidth: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: wp(4),
    fontWeight: '600',
  },
  totalText: {
    fontSize: wp(4),
    fontWeight: '600',
    marginTop: hp(-2),
    marginBottom: hp(4),
    textAlign: 'right',
    paddingRight: wp(2),
    paddingHorizontal: wp(1),
  },
  buttonsContainer: {
    width: '100%',
    gap: hp(2),
    marginBottom: hp(4),
    paddingHorizontal: wp(1),
  },
  addToCartButton: {
    width: '100%',
    height: hp(6),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButton: {
    width: '100%',
    height: hp(6),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: wp(4),
    fontWeight: '500',
  },
  buyNowText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProductPackages;
