import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/PopUp';

// Local placeholder – adjust path if needed
const PLACEHOLDER_IMAGE = require('../../assets/placeholder.jpg');

// Reusable image with fallback (same idea as OurProducts)
const CartItemImage = ({ uri }) => {
  const [error, setError] = useState(false);

  if (!uri || error) {
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
      onError={() => setError(true)}
      defaultSource={PLACEHOLDER_IMAGE}
    />
  );
};

const CartScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const showPopup = message => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

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
        console.log(
          '🆔 CartScreen - Fetched userId from AsyncStorage:',
          storedUserId,
        );
        setUserId(storedUserId);
      } catch (error) {
        console.error('❌ CartScreen - Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchCart = async () => {
    try {
      // Get fresh userId from AsyncStorage
      const freshUserId = await AsyncStorage.getItem('userId');
      console.log('🛒 CartScreen - Fetching cart for userId:', freshUserId);

      if (!freshUserId) {
        showPopup('Please sign in to view your cart');
        setLoading(false);
        return;
      }

      setLoading(true);

      // Call cart API
      const response = await fetch('https://naushad.onrender.com/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // if backend uses this like cookies:
          'x-user-id': freshUserId,
        },
      });

      const data = await response.json();
      console.log(
        '📥 CartScreen - Full API Response:',
        JSON.stringify(data, null, 2),
      );
      console.log('🔍 CartScreen - Response Status:', response.status);
      console.log('🔍 CartScreen - Success:', data.success);

      if (response.ok && data.success) {
        const allCartItems = data.data || [];
        console.log('📦 CartScreen - All cart items from API:', allCartItems);

        // Filter items for current user (extra safety)
        const filteredItems = allCartItems.filter(item => {
          const matchesUser = item.userId === freshUserId;
          console.log(
            `🔍 CartScreen - Item ${item._id}: userId=${item.userId}, matches=${matchesUser}`,
          );
          return matchesUser;
        });

        console.log(
          '✅ CartScreen - Filtered items for current user:',
          filteredItems,
        );
        console.log('👤 CartScreen - Current userId:', freshUserId);
        console.log('📊 CartScreen - Found items count:', filteredItems.length);

        // Normalize to match UI keys: amount -> price, productName -> name, etc.
        const normalizedItems = filteredItems.map(item => {
          const productImage =
            item.productPackageId?.image || item.productId?.image || null;

          return {
            ...item,
            // UI expects name, price, image, quantity
            name: item.productName,
            price: item.amount,
            image: productImage || null,
            description: item.productDescription,
            quantity: Number(item.quantity || 1),
          };
        });

        setCartItems(normalizedItems);
      } else {
        showPopup('Unable to load your cart. Please try again');
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ CartScreen - Fetch cart error:', error);
      showPopup('Network connection issue. Please check your internet');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item from cart (API)
  const handleRemove = async itemId => {
    try {
      const freshUserId = await AsyncStorage.getItem('userId');
      if (!freshUserId) {
        showPopup('Please sign in to manage your cart');
        return;
      }

      console.log(
        '🗑️ CartScreen - Removing item:',
        itemId,
        'for user:',
        freshUserId,
      );

      const response = await fetch(
        `https://naushad.onrender.com/api/cart/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': freshUserId,
          },
        },
      );
      const data = await response.json();

      console.log(
        '📥 CartScreen - Remove API Response:',
        JSON.stringify(data, null, 2),
      );

      if (response.ok && data.success) {
        fetchCart(); // Refresh list
      } else {
        showPopup('Failed to remove item. Please try again');
      }
    } catch (error) {
      console.error('❌ CartScreen - Delete error:', error);
      showPopup('Network issue. Please check your connection');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // ✅ Local quantity increase/decrease (no API, only UI)
  const handleIncreaseQuantity = itemId => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId
          ? { ...item, quantity: Number(item.quantity || 0) + 1 }
          : item,
      ),
    );
  };

  const handleDecreaseQuantity = itemId => {
    setCartItems(prev =>
      prev.map(item => {
        if (item._id !== itemId) return item;
        const currentQty = Number(item.quantity || 0);
        const newQty = currentQty > 1 ? currentQty - 1 : 1;
        return { ...item, quantity: newQty };
      }),
    );
  };

  // ✅ Handle Checkout - Pass all cart items to PaymentScreen
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showPopup('Your cart is empty');
      return;
    }

    const checkoutItems = cartItems.map(item => ({
      type: 'cart',
      serviceName: item.name,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      source: 'Cart',
      orderCode: item.orderCode,
      cartId: item._id,
    }));

    console.log('🛒 Checkout Items:', checkoutItems);

    navigation.navigate('MyCartPayment', {
      services: checkoutItems,
      source: 'Cart',
    });
  };

  // ✅ Calculations (only total, no GST / discount) – use amount/price
  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#121212' : '#f8f9fa' },
      ]}
    >
      <Head title="Cart" />

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={{
              marginTop: 10,
              color: theme.dark ? '#fff' : '#000',
            }}
          ></Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 180,
            paddingHorizontal: 20,
          }}
        >
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIcon,
                  {
                    backgroundColor: theme.dark ? '#333' : '#e9ecef',
                  },
                ]}
              >
                <Icon
                  name="cart-outline"
                  size={60}
                  color={theme.dark ? '#666' : '#adb5bd'}
                />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: theme.dark ? '#fff' : '#000' },
                ]}
              >
                Your cart is empty
              </Text>
              <Text
                style={[
                  styles.emptySubtitle,
                  { color: theme.dark ? '#888' : '#6c757d' },
                ]}
              >
                Add some amazing products to your cart!
              </Text>
            </View>
          ) : (
            cartItems.map(item => (
              <View
                key={item._id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.dark ? '#1e1e1e' : '#fff',
                    shadowColor: theme.dark ? '#000' : COLORS.primary,
                  },
                ]}
              >
                {/* Image with placeholder fallback */}
                <CartItemImage uri={item.image} />

                <View style={styles.itemDetails}>
                  <View style={styles.headerRow}>
                    <Text
                      style={[
                        styles.itemName,
                        { color: theme.dark ? '#fff' : '#000' },
                      ]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.removeButton,
                        {
                          backgroundColor: theme.dark ? '#333' : '#f8f9fa',
                        },
                      ]}
                      onPress={() => handleRemove(item._id)}
                    >
                      <Icon name="trash-outline" size={18} color="#dc3545" />
                    </TouchableOpacity>
                  </View>

                  {!!item.description && (
                    <Text
                      style={[
                        styles.itemDescription,
                        { color: theme.dark ? '#bbb' : '#6c757d' },
                      ]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}

                  <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                      <Text
                        style={[
                          styles.price,
                          { color: theme.dark ? '#fff' : '#000' },
                        ]}
                      >
                        ₹{item.price}
                      </Text>
                      <Text
                        style={[
                          styles.originalPrice,
                          {
                            color: theme.dark ? '#666' : '#adb5bd',
                          },
                        ]}
                      >
                        ₹{Math.round(Number(item.price || 0) * 1.2)}
                      </Text>
                    </View>

                    {/* Quantity with + / - buttons */}
                    <View
                      style={[
                        styles.quantityContainer,
                        {
                          backgroundColor: theme.dark ? '#333' : '#e9ecef',
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleDecreaseQuantity(item._id)}
                        style={styles.qtyBtn}
                      >
                        <Text
                          style={[
                            styles.qtyBtnText,
                            {
                              color: theme.dark ? '#fff' : '#000',
                            },
                          ]}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.quantityText,
                          { color: theme.dark ? '#fff' : '#000' },
                        ]}
                      >
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleIncreaseQuantity(item._id)}
                        style={styles.qtyBtn}
                      >
                        <Text
                          style={[
                            styles.qtyBtnText,
                            {
                              color: theme.dark ? '#fff' : '#000',
                            },
                          ]}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Only total card, no GST / discount */}
              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: theme.dark ? '#1e1e1e' : '#fff',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.summaryTitle,
                    { color: theme.dark ? '#fff' : '#000' },
                  ]}
                >
                  Order Summary
                </Text>

                <View style={styles.summaryRow}>
                  <Text
                    style={[
                      styles.totalLabel,
                      { color: theme.dark ? '#fff' : '#000' },
                    ]}
                  >
                    Total Amount
                  </Text>
                  <Text style={[styles.totalValue, { color: COLORS.primary }]}>
                    ₹{total}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.stickyFooter,
                  {
                    backgroundColor: theme.dark ? '#1a1a1a' : '#fff',
                  },
                ]}
              >
                <View style={styles.totalContainer}>
                  <Text
                    style={[
                      styles.footerLabel,
                      {
                        color: theme.dark ? '#bbb' : '#6c757d',
                      },
                    ]}
                  >
                    Total Payable
                  </Text>
                  <Text
                    style={[
                      styles.footerTotal,
                      { color: theme.dark ? '#fff' : '#000' },
                    ]}
                  >
                    ₹{total}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCheckout}
                  style={[
                    styles.checkoutBtn,
                    {
                      backgroundColor: COLORS.primary,
                      shadowColor: COLORS.primary,
                    },
                  ]}
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                  <Icon
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                    style={styles.checkoutIcon}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Popup Component */}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  emptyIcon: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  emptySubtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
    paddingHorizontal: wp('10%'),
  },
  card: {
    flexDirection: 'row',
    padding: wp('4%'),
    borderRadius: wp('5%'),
    marginBottom: hp('2%'),
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  image: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('4%'),
    marginRight: wp('4%'),
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  itemName: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    flex: 1,
    marginRight: wp('2%'),
    lineHeight: wp('4.8%'),
  },
  itemDescription: {
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    lineHeight: wp('4.2%'),
  },
  removeButton: {
    padding: wp('2%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  price: {
    fontWeight: '800',
    fontSize: wp('4.5%'),
    letterSpacing: 0.5,
  },
  originalPrice: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1.5%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quantityText: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    letterSpacing: 0.3,
    marginHorizontal: wp('2%'),
  },
  qtyBtn: {
    paddingHorizontal: wp('2%'),
  },
  qtyBtnText: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  summaryCard: {
    borderRadius: wp('5%'),
    padding: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  summaryTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('0.8%'),
  },
  totalLabel: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
  },
  totalValue: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    elevation: 16,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  footerLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  footerTotal: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
  checkoutBtn: {
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutText: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    letterSpacing: 1,
    color: '#fff',
    marginRight: wp('2%'),
  },
  checkoutIcon: {
    marginLeft: wp('1%'),
  },
});

export default CartScreen;
