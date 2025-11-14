import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { useTheme } from "../../context/ThemeContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCart = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      console.log(userId);
      setLoading(true);
      const response = await fetch(`https://naushad.onrender.com/api/cart/${userId}`);
      const data = await response.json();
      console.log("Cart Data:", data);

      if (response.ok && data.success) {
        setCartItems(data.cart.items || []);
      } else {
        Alert.alert("Error", data.message || "Failed to load cart");
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      Alert.alert("Error", "Unable to fetch cart data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item from cart (API)
  const handleRemove = async (itemId) => {
    try {
      const response = await fetch(`https://naushad.onrender.com/api/cart/${userId}/${itemId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Removed", "Item removed from cart");
        fetchCart(); // Refresh list
      } else {
        Alert.alert("Error", data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Unable to remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const discount = 0; // you can modify if your API includes discounts
  const gst = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + gst;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? "#121212" : "#fff" }]}>
      <Head title="Cart" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
            </View>
          ) : (
            cartItems.map((item) => (
              <View
                key={item._id.toString()}
                style={[
                  styles.card,
                  { backgroundColor: "#dadada", borderColor: COLORS.shadow },
                ]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: "#000" }]}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: "#000" }]}>₹{item.price}</Text>
                  </View>

                  {/* Quantity */}
                  <View style={[styles.qtyRow, { backgroundColor: "#000" }]}>
                    <Text style={styles.qtyValue}>Qty: {item.quantity}</Text>
                  </View>

                  {/* Remove */}
                  <TouchableOpacity style={styles.removeRow} onPress={() => handleRemove(item._id)}>
                    <Icon name="close" size={16} color="red" style={{ marginRight: 4 }} />
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Subtotal</Text>
                  <Text style={styles.summaryText}>₹{subtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>GST (10%)</Text>
                  <Text style={styles.summaryText}>₹{gst}</Text>
                </View>
              </View>

              <View style={[styles.stickyFooter, { backgroundColor: theme.dark ? "#222" : "#fff" }]}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalText}>₹{total}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("PaymentScreen")}
                  style={[styles.checkoutBtn, { backgroundColor: COLORS.primary }]}
                >
                  <Text style={[styles.checkoutText, { color: "#fff" }]}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}
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
  },
  image: {
    width: wp("32%"),
    height: hp("15%"),
    borderRadius: wp("3%"),
    marginRight: wp("3%"),
  },
  itemDetails: { flex: 1, 
    justifyContent: "center" 
  },
  itemName: { 
    fontSize: wp("4%"), 
    fontWeight: "700" 
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
  },
  qtyValue: { 
    fontSize: wp("4%"), 
    fontWeight: "bold", 
    color: "#fff" 
  },
  removeRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: hp("0.5%") 
  },
  removeText: { 
    color: "red", 
    fontSize: wp("3%"), 
    fontWeight: "500" 
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
    fontSize: wp("4.5%") 
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp("4%"),
    borderTopWidth: 1,
  },
  totalRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: hp("1%") 
  },
  totalText: { 
    fontSize: wp("4%"), 
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
