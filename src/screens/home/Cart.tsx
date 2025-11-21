import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { useTheme } from "../../context/ThemeContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../components/PopUp";

const CartScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('🆔 CartScreen - Fetched userId from AsyncStorage:', storedUserId);
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
        showPopup("Please sign in to view your cart");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await fetch(`https://naushad.onrender.com/api/cart`);
      const data = await response.json();
      console.log("📥 CartScreen - Full API Response:", JSON.stringify(data, null, 2));
      console.log("🔍 CartScreen - Response Status:", response.status);
      console.log("🔍 CartScreen - Success:", data.success);

      if (response.ok && data.success) {
        // Cart items are in data.data array
        const allCartItems = data.data || [];
        console.log("📦 CartScreen - All cart items from API:", allCartItems);
        
        // Filter items for current user
        const filteredItems = allCartItems.filter(item => {
          const matchesUser = item.userId === freshUserId;
          console.log(`🔍 CartScreen - Item ${item._id}: userId=${item.userId}, matches=${matchesUser}`);
          return matchesUser;
        });
        
        console.log("✅ CartScreen - Filtered items for current user:", filteredItems);
        console.log("👤 CartScreen - Current userId:", freshUserId);
        console.log("📊 CartScreen - Found items count:", filteredItems.length);
        setCartItems(filteredItems);
      } else {
        showPopup("Unable to load your cart. Please try again");
        setCartItems([]);
      }
    } catch (error) {
      console.error("❌ CartScreen - Fetch cart error:", error);
      showPopup("Network connection issue. Please check your internet");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item from cart (API)
  const handleRemove = async (itemId) => {
    try {
      const freshUserId = await AsyncStorage.getItem('userId');
      if (!freshUserId) {
        showPopup("Please sign in to manage your cart");
        return;
      }

      console.log('🗑️ CartScreen - Removing item:', itemId, 'for user:', freshUserId);
      
      const response = await fetch(`https://naushad.onrender.com/api/cart/${itemId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      console.log("📥 CartScreen - Remove API Response:", JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        // Directly remove without showing popup
        fetchCart(); // Refresh list
      } else {
        showPopup("Failed to remove item. Please try again");
      }
    } catch (error) {
      console.error("❌ CartScreen - Delete error:", error);
      showPopup("Network issue. Please check your connection");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  // ✅ Handle Checkout - Pass all cart items to PaymentScreen
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showPopup("Your cart is empty");
      return;
    }

    // Prepare cart items for payment screen
    const checkoutItems = cartItems.map(item => ({
      type: 'cart',
      serviceName: item.name,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      source: 'Cart'
    }));

    console.log('🛒 Checkout Items:', checkoutItems);

    navigation.navigate("CartPaymentScreen", {
      services: checkoutItems,
      source: 'Cart'
    });
  };

  // ✅ Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const discount = 0;
  const gst = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + gst;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? "#121212" : "#f8f9fa" }]}>
      <Head title="Cart" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: theme.dark ? "#fff" : "#000" }}>
            
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 20 }}
        >
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.dark ? "#333" : "#e9ecef" }]}>
                <Icon name="cart-outline" size={60} color={theme.dark ? "#666" : "#adb5bd"} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.dark ? "#fff" : "#000" }]}>
                Your cart is empty
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.dark ? "#888" : "#6c757d" }]}>
                Add some amazing products to your cart!
              </Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View
                key={item._id}
                style={[
                  styles.card,
                  { 
                    backgroundColor: theme.dark ? "#1e1e1e" : "#fff",
                    shadowColor: theme.dark ? "#000" : COLORS.primary,
                  },
                ]}
              >
                {/* Premium Badge */}
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>Premium</Text>
                </View>

                <Image
                  source={{ uri: item.image || "https://via.placeholder.com/150" }}
                  style={styles.image}
                />
                
                <View style={styles.itemDetails}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.itemName, { color: theme.dark ? "#fff" : "#000" }]}>
                      {item.name}
                    </Text>
                    <TouchableOpacity 
                      style={[styles.removeButton, { backgroundColor: theme.dark ? "#333" : "#f8f9fa" }]}
                      onPress={() => handleRemove(item._id)}
                    >
                      <Icon name="trash-outline" size={18} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.itemDescription, { color: theme.dark ? "#bbb" : "#6c757d" }]}>
                    Premium service with expert care
                  </Text>

                  <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                      <Text style={[styles.price, { color: theme.dark ? "#fff" : "#000" }]}>
                        ₹{item.price}
                      </Text>
                      <Text style={[styles.originalPrice, { color: theme.dark ? "#666" : "#adb5bd" }]}>
                        ₹{Math.round(item.price * 1.2)}
                      </Text>
                    </View>

                    <View style={[styles.quantityContainer, { backgroundColor: theme.dark ? "#333" : "#e9ecef" }]}>
                      <Text style={[styles.quantityText, { color: theme.dark ? "#fff" : "#000" }]}>
                        Qty: {item.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              <View style={[styles.summaryCard, { backgroundColor: theme.dark ? "#1e1e1e" : "#fff" }]}>
                <Text style={[styles.summaryTitle, { color: theme.dark ? "#fff" : "#000" }]}>
                  Order Summary
                </Text>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.dark ? "#bbb" : "#6c757d" }]}>
                    Subtotal
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{subtotal}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.dark ? "#bbb" : "#6c757d" }]}>
                    Discount
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#28a745" }]}>
                    -₹{discount}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.dark ? "#bbb" : "#6c757d" }]}>
                    GST (10%)
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{gst}
                  </Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.summaryRow}>
                  <Text style={[styles.totalLabel, { color: theme.dark ? "#fff" : "#000" }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.totalValue, { color: COLORS.primary }]}>
                    ₹{total}
                  </Text>
                </View>
              </View>

              <View style={[styles.stickyFooter, { backgroundColor: theme.dark ? "#1a1a1a" : "#fff" }]}>
                <View style={styles.totalContainer}>
                  <Text style={[styles.footerLabel, { color: theme.dark ? "#bbb" : "#6c757d" }]}>
                    Total Payable
                  </Text>
                  <Text style={[styles.footerTotal, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{total}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCheckout}
                  style={[styles.checkoutBtn, { 
                    backgroundColor: COLORS.primary,
                    shadowColor: COLORS.primary,
                  }]}
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" style={styles.checkoutIcon} />
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
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    padding: wp("4%"),
    borderRadius: wp("5%"),
    marginBottom: hp("2%"),
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
  premiumBadge: {
    position: 'absolute',
    top: wp('3%'),
    left: wp('3%'),
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('2%'),
    zIndex: 2,
  },
  premiumText: {
    color: '#fff',
    fontSize: wp('2.8%'),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  image: {
    width: wp("28%"),
    height: wp("28%"),
    borderRadius: wp("4%"),
    marginRight: wp("4%"),
  },
  itemDetails: { 
    flex: 1, 
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("1%"),
  },
  itemName: { 
    fontSize: wp("4.2%"), 
    fontWeight: "700",
    flex: 1,
    marginRight: wp("2%"),
    lineHeight: wp('4.8%'),
  },
  itemDescription: {
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    lineHeight: wp('4.2%'),
  },
  removeButton: {
    padding: wp("2%"),
    borderRadius: wp("3%"),
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
    fontWeight: "800", 
    fontSize: wp("4.5%"),
    letterSpacing: 0.5,
  },
  originalPrice: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
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
    fontSize: wp("3.5%"), 
    fontWeight: "700",
    letterSpacing: 0.3,
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
  summaryLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: hp('1.5%'),
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("5%"),
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
    borderRadius: wp("4%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
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
    fontSize: wp("4.2%"), 
    fontWeight: "700", 
    letterSpacing: 1,
    color: '#fff',
    marginRight: wp('2%'),
  },
  checkoutIcon: {
    marginLeft: wp('1%'),
  },
});

export default CartScreen;