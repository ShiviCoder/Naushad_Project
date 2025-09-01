import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Beard oil", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 2, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 3, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 4, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 5, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 6, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
        { id: 7, name: "Hair Spa", price: 299, oldPrice: 399, discount: 25, qty: 1 },
    ]);

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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="chevron-back" size={24} />
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            {/* Scrollable Items */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }} // space for sticky total
            >
                {cartItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image
                            source={require("../../assets/images/photo.png")}
                            style={styles.image}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>₹{item.price}</Text>
                                <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
                                <Text style={styles.discount}>({item.discount}%OFF)</Text>
                            </View>

                            {/* Quantity Section */}
                            <View style={styles.qtyRow}>
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
                ))}

                {/* Summary */}
                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryText}>Subtotal</Text>
                        <Text style={styles.summaryText}>₹{subtotal}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.discountText}>Discount</Text>
                        <Text style={styles.discountText}>₹{discount}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.gstText}>GST (10%)</Text>
                        <Text style={styles.gstText}>₹{gst}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Total + Checkout */}
            <View style={styles.stickyFooter}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>₹{total}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#e8e5e5ff",
        padding: 10,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "#F6B745",
        marginBottom: 12,
        elevation: 1,
    },
    image: {
        width: 126,
        height: 120,
        borderRadius: 12,
        marginRight: 10
    },
    itemDetails: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600"
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },
    price: {
        fontWeight: "bold",
        fontSize: 14
    },
    oldPrice: {
        textDecorationLine: "line-through",
        color: "#888",
        fontSize: 12,
        marginLeft: 6,
    },
    discount: {
        color: "#42BA86",
        marginLeft: 6,
        fontSize: 12
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#000",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
        minWidth: 90,
        marginTop: 8,
    },
    qtyBtnText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 10,
    },
    qtyValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        minWidth: 20
    },
    removeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8
    },
    removeText: {
        color: "red",
        fontSize: 13,
        fontWeight: "500"
    },
    summary: { marginTop: 20 },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 3
    },
    summaryText: { fontSize: 14 },
    discountText: {
        color: "#42BA86",
        fontSize: 14
    },
    gstText: {
        color: "black",
        fontSize: 14
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        paddingTop: 8,
    },
    totalText: { fontSize: 16, fontWeight: "bold" },
    stickyFooter: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 15,
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    checkoutBtn: {
        backgroundColor: "#000",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 10,
    },
    checkoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1
    },
});

export default CartScreen;
