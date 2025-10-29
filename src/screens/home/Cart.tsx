import React, { useEffect } from "react";
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
import { useTheme } from "../../context/ThemeContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from '../../context/CartContext';
import COLORS from "../../utils/Colors";

const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;
  const { theme } = useTheme();
  const { cartItems, addToCart, updateQty, removeFromCart } = useCart();

  // Add product to cart if passed from previous screen
  useEffect(() => {
    if (product) addToCart({ ...product, qty: 1 }); // ensure qty is initialized
  }, [product]);
  console.log(cartItems)
  // Quantity update
  const handleQtyChange = (id, type) => updateQty(id, type);

  // Remove item
  const handleRemove = (id) => removeFromCart(id);

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  const discount = cartItems.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.qty || 0);
    const discountValue = item.discount;

    if (!discountValue) return acc;

    if (typeof discountValue === "string" && discountValue.includes("%")) {
      const percent = parseFloat(discountValue.replace("%", "").trim());
      if (!isNaN(percent)) return acc + (price * qty * percent) / 100;
    }

    const fixedDiscount = parseFloat(discountValue);
    if (!isNaN(fixedDiscount)) return acc + fixedDiscount * qty;

    return acc;
  }, 0);

  const gst = Math.round((subtotal - discount) * 0.1 || 0);
  const total = subtotal - discount + gst;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? "#121212" : "#fff" }]}>
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
              key={item._id.toString()}
              style={[
                styles.card,
                { backgroundColor: '#dadada', borderColor: COLORS.shadow },
              ]}
            >
              <Image
                source={require("../../assets/images/photo.png")}
                style={styles.image}
              />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: '#000' }]}>
                  {item.name || item.title || item.serviceName}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: '#000' }]}>₹{item.price}</Text>
                  {item.oldPrice && (
                    <Text style={[styles.oldPrice, { color: '#888' }]}>₹{item.oldPrice}</Text>
                  )}
                  {item.discount && (
                    <Text style={[styles.discount, { color: '#42BA86' }]}>{item.discount}</Text>
                  )}
                </View>

                {/* Quantity Section */}
                <View style={[styles.qtyRow, { backgroundColor: '#000' }]}>
                  <TouchableOpacity onPress={() => handleQtyChange(item.id, "sub")}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => handleQtyChange(item.id, "add")}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Remove Button */}
                <TouchableOpacity style={styles.removeRow} onPress={() => handleRemove(item.id)}>
                  <Icon name="close" size={16} color="red" style={{ marginRight: 4 }} />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {cartItems.length > 0 && (
          <>
            {/* Summary Section */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryText, { color: theme.dark ? '#fff' : '#000' }]}>Subtotal</Text>
                <Text style={[styles.summaryText, { color: theme.dark ? '#fff' : '#000' }]}>₹{subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.discountText]}>Discount</Text>
                <Text style={[styles.discountText]}>₹{discount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.gstText, { color: theme.dark ? '#fff' : '#000' }]}>GST (10%)</Text>
                <Text style={[styles.gstText, { color: theme.dark ? '#fff' : '#000' }]}>₹{gst}</Text>
              </View>
            </View>

            {/* Sticky Footer */}
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
              <TouchableOpacity onPress={()=>navigation.navigate("PaymentScreen")} style={[styles.checkoutBtn, { backgroundColor: COLORS.primary }]}>
                <Text style={[styles.checkoutText, { color: '#fff' }]}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flexDirection: "row",
    padding: wp('3%'),
    borderRadius: wp('7%'),
    borderWidth: 1,
    marginBottom: hp('1.5%'),
    elevation: 1
  },
  image: {
    width: wp('32%'),
    height: hp('15%'),
    borderRadius: wp('3%'),
    marginRight: wp('3%')
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Poppins-Medium"
  },
  itemName: {
    fontSize: wp('4%'),
    fontWeight: "700",
    fontFamily: "Poppins-Medium"
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: hp('0.5%'),
    fontFamily: "Poppins-Medium"
  },
  price: {
    fontWeight: "bold",
    fontSize: wp('3.5%'),
    fontFamily: "Poppins-Medium"
  },
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
    marginTop: hp('1%')
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
    paddingTop: hp('0.5%')
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
    borderTopWidth: 1
  },
  checkoutBtn: {
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    alignItems: "center",
    marginTop: hp('1%')
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
    marginVertical: hp('1%')
  },
  summaryText: {
    fontSize: wp('4.5%')
  },
  discountText: {
    color: "#42BA86",
    fontSize: wp('4.5%')
  },
  gstText: {
    color: "black",
    fontSize: wp('4.5%')
  },
});

export default CartScreen;
