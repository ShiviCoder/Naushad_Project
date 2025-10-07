import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Head from "../../components/Head";
import { useTheme } from "../../context/ThemeContext"; // ✅ import theme
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const product = route.params?.product;
  const { theme } = useTheme(); // ✅ get current theme

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (product) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + product.qty }
              : item
          );
        }
        return [...prev, product];
      });
    }
  }, [product]);

  // Quantity update
  const handleQtyChange = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: type === "add" ? item.qty + 1 : Math.max(1, item.qty - 1) }
          : item
      )
    );
  };

  // Remove item
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 175;
  const gst = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + gst;

  return (
    <View style={[styles.container, { backgroundColor: theme.dark ? "#121212" : "#fff" }]}>
      <Head title="Cart" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180, paddingHorizontal: 20 }}
      >
        {cartItems.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 18, color: theme.dark ? '#888' : '#aaa' }}>
              Your cart is empty
            </Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: '#dadada',
                  borderColor: theme.dark ? '#F6B745' : '#F6B745',
                },
              ]}
            >
              <Image
                source={require("../../assets/images/photo.png")}
                style={styles.image}
              />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: '#000' }]}>
                  {item.name || item.title}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: '#000' }]}>
                    ₹{item.price}
                  </Text>
                  <Text style={[styles.oldPrice, { color: '#888' }]}>
                    ₹{item.oldPrice}
                  </Text>
                  <Text style={[styles.discount, { color: '#42BA86' }]}>
                    ({item.discount}%OFF)
                  </Text>
                </View>

                {/* Quantity Section */}
                <View
                  style={[
                    styles.qtyRow,
                    { backgroundColor: '#000' },
                  ]}
                >
                  <TouchableOpacity onPress={() => handleQtyChange(item.id, "sub")}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => handleQtyChange(item.id, "add")}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                  style={styles.removeRow}
                  onPress={() => handleRemove(item.id)}
                >
                  <Icon name="close" size={16} color="red" style={{ marginRight: 4 }} />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, { color: theme.dark ? '#fff' : '#000' }]}>Subtotal</Text>
            <Text style={[styles.summaryText, { color: theme.dark ? '#fff' : '#000' }]}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.discountText, { color: theme.dark ? '#42BA86' : '#42BA86' }]}>Discount</Text>
            <Text style={[styles.discountText, { color: theme.dark ? '#42BA86' : '#42BA86' }]}>₹{discount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.gstText, { color: theme.dark ? '#fff' : '#000' }]}>GST (10%)</Text>
            <Text style={[styles.gstText, { color: theme.dark ? '#fff' : '#000' }]}>₹{gst}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Total + Checkout */}
      <View
        style={[
          styles.stickyFooter,
          { backgroundColor: theme.dark ? '#222' : '#fff', borderColor: theme.dark ? '#ddd' : '#444' },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={[styles.totalText, { color: theme.dark ? '#fff' : '#000' }]}>Total</Text>
          <Text style={[styles.totalText, { color: theme.dark ? '#fff' : '#000' }]}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: '#F6B745' }]}
        >
          <Text style={[styles.checkoutText, { color: '#fff' }]}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    padding: wp('3%'),
    borderRadius: wp('7%'),
    borderWidth: 1,
    marginBottom: hp('1.5%'),
    elevation: 1,
  },
  image: { width: wp('32%'), height: hp('15%'), borderRadius: wp('3%'), marginRight: wp('3%') },
  itemDetails: {
    flex: 1, justifyContent: "center", alignItems: "center", fontFamily: "Poppins-Medium"
  },
  itemName: { fontSize: wp('4%'), fontWeight: "600", fontFamily: "Poppins-Medium" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: hp('0.5%'), fontFamily: "Poppins-Medium" },
  price: { fontWeight: "bold", fontSize: wp('3.5%'), fontFamily: "Poppins-Medium" },
  oldPrice: {
    textDecorationLine: "line-through",
    fontSize: wp('3%'),
    marginLeft: wp('2%'),
    fontFamily: "Poppins-Medium"
  },
  discount: { 
    marginLeft: wp('2%'), 
    fontSize: wp('3%'), 
    fontFamily: "Poppins-Medium" 
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    minWidth: wp('22%'),
    marginTop: hp('1%'),
  },
  qtyBtnText: {
    fontSize: wp('5%'),
    fontWeight: "bold",
    paddingHorizontal: wp('2%'),
    color: '#fff',
    fontFamily: "Poppins-Medium"
  },
  qtyValue: {
    fontSize: wp('4%'),
    fontWeight: "bold",
    textAlign: "center",
    minWidth: wp('6%'),
    color: '#fff',
    fontFamily: "Poppins-Medium"
  },
  removeRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: hp('0.5%') 
  },
  removeText: { 
    color: "red", 
    fontSize: wp('3%'), 
    fontWeight: "500", 
    fontFamily: "Poppins-Medium" 
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp('1%'),
    paddingTop: hp('0.5%'),
  },
  totalText: { 
    fontSize: wp('4%'), 
    fontWeight: "bold", 
    fontFamily: "Poppins-Medium" 
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp('4%'),
    borderTopWidth: 1,
  },
  checkoutBtn: {
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: "center",
    marginTop: hp('1%'),
  },
  checkoutText: { 
    fontSize: wp('4%'), 
    fontWeight: "bold", 
    letterSpacing: 1, 
    fontFamily: "Poppins-Medium" 
  },
  summary: { 
    marginTop: hp('2%') 
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: hp('1%'),
  },
  summaryText: { fontSize: wp('4.5%') },
  discountText: { color: "#42BA86", fontSize: wp('4.5%') },
  gstText: { color: "black", fontSize: wp('4.5%') },
});
export default CartScreen;
