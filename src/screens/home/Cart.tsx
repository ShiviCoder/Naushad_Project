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

    navigation.navigate("PaymentScreen", {
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? "#121212" : "#fff" }]}>
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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
              <Text style={{ fontSize: 18, color: theme.dark ? "#888" : "#aaa" }}>
                Your cart is empty
              </Text>
              <Text style={{ fontSize: 14, color: theme.dark ? "#666" : "#999", marginTop: 10 }}>
                Add some products to your cart!
              </Text>
              <Text style={{ fontSize: 12, color: theme.dark ? "#555" : "#888", marginTop: 5 }}>
                User ID: {userId}
              </Text>
            </View>
          ) : (
            cartItems.map((item) => (
              <View
                key={item._id}
                style={[
                  styles.card,
                  { backgroundColor: theme.dark ? "#333" : "#f8f8f8", borderColor: COLORS.shadow },
                ]}
              >
                <Image
                  source={{ uri: item.image || "https://via.placeholder.com/150" }}
                  style={styles.image}
                />
                <View style={styles.itemDetails}>
                  <View style={styles.headerRow}>
                    <Text style={[styles.itemName, { color: theme.dark ? "#fff" : "#000" }]}>
                      {item.name}
                    </Text>
                    {/* Remove button - top right corner */}
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemove(item._id)}
                    >
                      <Icon name="close" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: theme.dark ? "#fff" : "#000" }]}>
                      ₹{item.price}
                    </Text>
                  </View>

                  {/* Quantity */}
                  <View style={[styles.qtyRow, { backgroundColor: theme.dark ? "#555" : "#000" }]}>
                    <Text style={styles.qtyValue}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryText, { color: theme.dark ? "#fff" : "#000" }]}>
                    Subtotal
                  </Text>
                  <Text style={[styles.summaryText, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{subtotal}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryText, { color: theme.dark ? "#fff" : "#000" }]}>
                    GST (10%)
                  </Text>
                  <Text style={[styles.summaryText, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{gst}
                  </Text>
                </View>
              </View>

              <View style={[styles.stickyFooter, { backgroundColor: theme.dark ? "#222" : "#fff" }]}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalText, { color: theme.dark ? "#fff" : "#000" }]}>
                    Total
                  </Text>
                  <Text style={[styles.totalText, { color: theme.dark ? "#fff" : "#000" }]}>
                    ₹{total}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleCheckout}
                  style={[styles.checkoutBtn, { backgroundColor: COLORS.primary }]}
                >
                  <Text style={[styles.checkoutText, { color: "#fff" }]}>Checkout</Text>
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
  container: { flex: 1 },
  card: {
    flexDirection: "row",
    padding: wp("3%"),
    borderRadius: wp("7%"),
    borderWidth: 1,
    marginBottom: hp("1.5%"),
    elevation: 1,
    position: 'relative',
  },
  image: {
    width: wp("32%"),
    height: hp("15%"),
    borderRadius: wp("3%"),
    marginRight: wp("3%"),
  },
  itemDetails: { 
    flex: 1, 
    justifyContent: "center" 
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("0.5%"),
  },
  itemName: { 
    fontSize: wp("4%"), 
    fontWeight: "700",
    flex: 1,
    marginRight: wp("2%"),
  },
  removeButton: {
    padding: wp("1%"),
    borderRadius: wp("2%"),
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  priceRow: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    marginTop: hp("0.5%") 
  },
  price: { 
    fontWeight: "bold", 
    fontSize: wp("3.5%") 
  },
  qtyRow: {
    marginTop: hp("1%"),
    borderRadius: wp("3%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    alignSelf: 'flex-start',
  },
  qtyValue: { 
    fontSize: wp("3.5%"), 
    fontWeight: "bold", 
    color: "#fff" 
  },
  summary: { 
    marginTop: hp("2%") 
  },
  summaryRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginVertical: hp("1%") 
  },
  summaryText: { 
    fontSize: wp("4.5%"),
    fontWeight: "500"
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("4%"),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: hp("1%") 
  },
  totalText: { 
    fontSize: wp("4.5%"), 
    fontWeight: "bold" 
  },
  checkoutBtn: { 
    borderRadius: wp("3%"), 
    paddingVertical: hp("1.5%"), 
    alignItems: "center" 
  },
  checkoutText: { 
    fontSize: wp("4%"), 
    fontWeight: "bold", 
    letterSpacing: 1 
  },
});

export default CartScreen;