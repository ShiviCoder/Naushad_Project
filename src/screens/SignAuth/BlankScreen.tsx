import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { useTheme } from "../../context/ThemeContext";
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../components/PopUp";

const { width, height } = Dimensions.get('window');

const OrderHistory = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Salon orders data - Updated with only Wallet payment method
  const staticOrders = [
    {
      _id: "1",
      orderId: "ORD-2025-001",
      serviceName: "Haircut & Styling",
      date: "2025-12-08",
      time: "2:30 PM",
      status: "delivered",
      totalAmount: 1299,
      items: [
        { name: "Premium Haircut", price: 799, quantity: 1 },
        { name: "Hair Styling", price: 500, quantity: 1 }
      ],
      paymentMethod: "Wallet",
      image: require("../../assets/images/logo.png")
    },
    {
      _id: "2",
      orderId: "ORD-2025-002",
      serviceName: "Facial Treatment",
      date: "2025-12-05",
      time: "11:00 AM",
      status: "processing",
      totalAmount: 2500,
      items: [
        { name: "Deep Cleansing Facial", price: 1500, quantity: 1 },
        { name: "Fruit Facial", price: 1000, quantity: 1 }
      ],
      paymentMethod: "Wallet",
      image: require("../../assets/images/logo.png")
    },
    {
      _id: "3",
      orderId: "ORD-2025-003",
      serviceName: "Manicure & Pedicure",
      date: "2025-12-03",
      time: "4:15 PM",
      status: "delivered",
      totalAmount: 1899,
      items: [
        { name: "Deluxe Manicure", price: 999, quantity: 1 },
        { name: "Deluxe Pedicure", price: 900, quantity: 1 }
      ],
      paymentMethod: "Wallet",
      image: require("../../assets/images/logo.png")
    },
    {
      _id: "4",
      orderId: "ORD-2025-004",
      serviceName: "Hair Color",
      date: "2025-11-28",
      time: "10:30 AM",
      status: "delivered",
      totalAmount: 3500,
      items: [
        { name: "Global Hair Color", price: 2500, quantity: 1 },
        { name: "Hair Treatment", price: 1000, quantity: 1 }
      ],
      paymentMethod: "Wallet",
      image: require("../../assets/images/logo.png")
    },
    {
      _id: "5",
      orderId: "ORD-2025-005",
      serviceName: "Full Body Massage",
      date: "2025-11-25",
      time: "3:00 PM",
      status: "delivered",
      totalAmount: 4200,
      items: [
        { name: "90 Min Massage", price: 3500, quantity: 1 },
        { name: "Steam Bath", price: 700, quantity: 1 }
      ],
      paymentMethod: "Wallet",
      image: require("../../assets/images/logo.png")
    }
  ];

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

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
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(staticOrders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      showPopup("Unable to load order history");
      setOrders(staticOrders);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return COLORS.primary;
      case 'processing': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return 'checkmark-circle';
      case 'processing': return 'time';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter);

  const handleOrderPress = (order) => {
    console.log('Order pressed:', order.orderId);
    // Navigate to order details if needed
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(value)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.filterButtonTextActive,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Head title="Order History" showBack={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <Head title="Order History" showBack={false} />

      {/* Filter Buttons */}
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <FilterButton label="All Orders" value="all" />
          <FilterButton label="Delivered" value="delivered" />
          <FilterButton label="Processing" value="processing" />
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Icon name="receipt-outline" size={wp('15%')} color="#adb5bd" />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              No orders found
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {selectedFilter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${selectedFilter} orders`}
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Explore Services</Text>
              <Icon name="arrow-forward" size={wp('4%')} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={[
                styles.orderCard,
                { 
                  backgroundColor: theme.cardBg || '#fff',
                  shadowColor: COLORS.primary,
                },
              ]}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.9}
            >
              {/* Order Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Icon name={getStatusIcon(order.status)} size={wp('3.5%')} color="#fff" />
                <Text style={styles.statusText} numberOfLines={1}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>

              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderId, { color: theme.textPrimary }]}>
                    {order.orderId}
                  </Text>
                  <Text style={[styles.orderDateTime, { color: theme.textSecondary }]}>
                    {formatDate(order.date)} • {order.time}
                  </Text>
                </View>
                
              </View>

              <View style={styles.orderContent}>
                <Image
                  source={order.image}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
                
                <View style={styles.orderDetails}>
                  <Text style={[styles.serviceName, { color: theme.textPrimary }]}>
                    {order.serviceName}
                  </Text>
                  
                  <View style={styles.itemsContainer}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text 
                          style={[styles.itemName, { color: theme.textSecondary }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                        <Text style={[styles.itemPrice, { color: theme.textPrimary }]}>
                          ₹{item.price}
                        </Text>
                      </View>
                    ))}
                    {order.items.length > 2 && (
                      <Text style={[styles.moreItems, { color: COLORS.primary }]}>
                        +{order.items.length - 2} more items
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>
                    ₹{order.totalAmount}
                  </Text>
                  
                </View>
                 <View style={styles.paymentMethod}>
                  <Icon 
                    name="wallet" 
                    size={wp('4%')} 
                    color={theme.textSecondary?.color || "#6c757d"} 
                  />
                  <Text style={[styles.paymentText, { color: theme.textSecondary }]} numberOfLines={1}>
                    Wallet Payment
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp('5%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  filterWrapper: {
    paddingHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    alignSelf: 'center',
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    gap: wp('3%'),
  },
  filterButton: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: wp('25%'),
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    paddingBottom: hp('15%'),
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: hp('10%'),
    paddingHorizontal: wp('10%'),
  },
  emptyIcon: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginBottom: hp('3%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
    marginBottom: hp('4%'),
    lineHeight: hp('2.5%'),
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    gap: wp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  orderCard: {
    borderRadius: wp('3%'),
    marginBottom: hp('2.5%'),
    padding: wp('4%'),
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  statusBadge: {
    position: 'absolute',
    top: wp('3%'),
    right: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('2%'),
    zIndex: 2,
    gap: wp('1%'),
    maxWidth: wp('40%'),
  },
  statusText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: '600',
    flexShrink: 1,
  },
  orderHeader: {
    flexDirection: width < 400 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: width < 400 ? 'flex-start' : 'center',
    marginBottom: hp('2%'),
    gap: width < 400 ? hp('1%') : 0,
  },
  orderInfo: {
    flex: width < 400 ? 0 : 1,
  },
  orderId: {
    fontSize: wp('4%'),
    fontWeight: '700',
    marginBottom: hp('0.5%'),
  },
  orderDateTime: {
    fontSize: wp('3.2%'),
    fontWeight: '400',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    marginTop: width < 400 ? hp('0.5%') : 0,
  },
  paymentText: {
    fontSize: wp('3%'),
    fontWeight: '500',
    flexShrink: 1,
  },
  orderContent: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  serviceImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2.5%'),
    marginRight: wp('4%'),
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  itemsContainer: {
    gap: hp('0.8%'),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: wp('3.2%'),
    flex: 1,
    marginRight: wp('2%'),
  },
  itemPrice: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    flexShrink: 0,
  },
  moreItems: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    marginTop: hp('0.5%'),
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: wp('3.6%'),
    fontWeight: '500',
    marginBottom: hp('0.5%'),
  },
  totalAmount: {
    fontSize: wp('4.5%'),
    fontWeight: '800',
  },
});

export default OrderHistory;