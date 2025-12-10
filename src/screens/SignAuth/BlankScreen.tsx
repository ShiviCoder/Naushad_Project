import React, { useEffect, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const OrderHistory = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [apiError, setApiError] = useState(false);

  const showPopup = message => {
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // Fetch userId from AsyncStorage
  const getUserId = async () => {
    try {
      console.log('🔍 Starting to fetch user ID from AsyncStorage...');

      const storedUserId = await AsyncStorage.getItem('userId');
      const userDataString = await AsyncStorage.getItem('userData');

      console.log('📦 Direct userId from AsyncStorage:', storedUserId);
      console.log('📦 userData from AsyncStorage:', userDataString);

      let finalUserId = storedUserId;

      if (!finalUserId && userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          console.log('📊 Parsed userData:', userData);

          if (userData.user && userData.user._id) {
            finalUserId = userData.user._id;
            console.log('✅ Found userId in userData.user._id:', finalUserId);
          } else if (userData._id) {
            finalUserId = userData._id;
            console.log('✅ Found userId in userData._id:', finalUserId);
          } else if (userData.id) {
            finalUserId = userData.id;
            console.log('✅ Found userId in userData.id:', finalUserId);
          }
        } catch (parseError) {
          console.log('❌ Error parsing userData:', parseError);
        }
      }

      if (finalUserId) {
        console.log('🎯 Final userId to be used:', finalUserId);
        setUserId(finalUserId);
        return finalUserId;
      } else {
        console.log('❌ No userId found in any storage location');
        showPopup('User not found. Please sign in again.');
        return null;
      }
    } catch (error) {
      console.log('❌ Error getting userId:', error);
      showPopup('Error loading user data');
      return null;
    }
  };

  // Fetch orders from API - Try different methods
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError(false);

      const user_Id = await getUserId();

      if (!user_Id) {
        console.log('❌ Cannot fetch orders: No userId available');
        setOrders([]);
        return;
      }

      console.log('👤 Using userId for orders API call:', user_Id);

      let ordersData = [];

      // Method 1: GET with query parameter
      try {
        const url1 = `https://naushad.onrender.com/api/order/get-user-orders?userId=${user_Id}`;
        console.log('🔄 Trying Method 1 - GET with query parameter');
        console.log('🔗 API URL:', url1);

        const response1 = await fetch(url1, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', response1.status);
        console.log('📡 Response ok:', response1.ok);

        if (response1.ok) {
          const data = await response1.json();
          console.log('✅ Method 1 succeeded!');
          console.log('📩 Full API Response:', JSON.stringify(data, null, 2));

          if (data.success && data.data) {
            console.log('✅ Orders fetched successfully via GET');
            ordersData = data.data;
          }
        } else {
          console.log('❌ Method 1 failed with status:', response1.status);
          throw new Error(`GET method failed: ${response1.status}`);
        }
      } catch (error1) {
        console.log('❌ Method 1 error:', error1.message);

        // Method 2: POST with body
        try {
          const url2 = 'https://naushad.onrender.com/api/order/get-user-orders';
          console.log('🔄 Trying Method 2 - POST with body');
          console.log('🔗 API URL:', url2);

          const requestBody = {
            userId: user_Id,
          };

          console.log('📦 Request body:', requestBody);

          const response2 = await fetch(url2, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          console.log('📡 Response status:', response2.status);
          console.log('📡 Response ok:', response2.ok);

          if (response2.ok) {
            const data = await response2.json();
            console.log('✅ Method 2 succeeded!');
            console.log('📩 Full API Response:', JSON.stringify(data, null, 2));

            if (data.success && data.data) {
              console.log('✅ Orders fetched successfully via POST');
              ordersData = data.data;
            }
          } else {
            console.log('❌ Method 2 failed with status:', response2.status);
            throw new Error(`POST method failed: ${response2.status}`);
          }
        } catch (error2) {
          console.log('❌ Method 2 error:', error2.message);

          // Method 3: Different endpoint pattern
          try {
            const url3 = `https://naushad.onrender.com/api/order/get-user-orders-by-userId/${user_Id}`;
            console.log('🔄 Trying Method 3 - Different endpoint pattern');
            console.log('🔗 API URL:', url3);

            const response3 = await fetch(url3, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('📡 Response status:', response3.status);
            console.log('📡 Response ok:', response3.ok);

            if (response3.ok) {
              const data = await response3.json();
              console.log('✅ Method 3 succeeded!');
              console.log(
                '📩 Full API Response:',
                JSON.stringify(data, null, 2),
              );

              if (data.success && data.data) {
                console.log(
                  '✅ Orders fetched successfully via alternative endpoint',
                );
                ordersData = data.data;
              }
            } else {
              console.log('❌ Method 3 failed with status:', response3.status);
              throw new Error(
                `Alternative endpoint failed: ${response3.status}`,
              );
            }
          } catch (error3) {
            console.log('❌ Method 3 error:', error3.message);
            setApiError(true);
            showPopup(
              'Unable to connect to server. Please check your internet connection.',
            );
          }
        }
      }

      if (ordersData.length > 0) {
        console.log('📋 Processing orders data, count:', ordersData.length);

        const mappedOrders = ordersData.map(order => {
          console.log('📦 Processing order:', order._id);
          console.log('   Order data:', JSON.stringify(order, null, 2));

          let orderDate;
          if (order.createdAt) {
            orderDate = new Date(order.createdAt);
          } else if (order._id) {
            const timestamp =
              parseInt(order._id.toString().substring(0, 8), 16) * 1000;
            orderDate = new Date(timestamp);
          } else {
            orderDate = new Date();
          }

          const dateString = orderDate.toISOString().split('T')[0];
          const timeString = orderDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          const items = [];

          if (order.productName) {
            items.push({
              name: order.productName,
              price:
                order.quantity > 0
                  ? order.amount / order.quantity
                  : order.amount,
              quantity: order.quantity || 1,
            });
          }

          if (order.productDescription) {
            const shortDescription =
              order.productDescription.length > 40
                ? order.productDescription.substring(0, 40) + '...'
                : order.productDescription;

            items.push({
              name: shortDescription,
              price: 0,
              quantity: 1,
            });
          }

          if (items.length === 0) {
            items.push({
              name: 'Product',
              price: order.amount || 0,
              quantity: 1,
            });
          }

          const mappedOrder = {
            _id: order._id || `order-${Math.random()}`,
            orderId:
              order.orderCode ||
              `ORD-${order._id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
            serviceName: order.productName || 'Product Order',
            date: dateString,
            time: timeString,
            status: (order.orderStatus || 'processing').toLowerCase(),
            totalAmount: order.amount || 0,
            items: items,
            paymentMethod: 'Wallet',
            productId: order.productId?._id || order.productId,
            originalProduct: order.productId || {},
            description: order.productDescription,
            // keep actual Date object for reliable sorting descending
            orderDateObj: orderDate,
          };

          console.log('✅ Mapped order:', mappedOrder.orderId);
          return mappedOrder;
        });

        // 🔽 LATEST FIRST: sort by real Date object (descending)
        const sortedOrders = mappedOrders.sort(
          (a, b) => b.orderDateObj - a.orderDateObj,
        );

        setOrders(sortedOrders);
        console.log(`✅ Successfully loaded ${sortedOrders.length} orders`);
      } else {
        console.log('📭 No orders data received from API');
        setOrders([]);
      }
    } catch (error) {
      console.error('🚨 Fetch orders error:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
      });
      setApiError(true);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('🏁 Fetch orders process completed');
    }
  };

  const onRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    console.log('🚀 OrderHistory component mounted');
    fetchOrders();

    return () => {
      console.log('🧹 OrderHistory component unmounted');
    };
  }, []);

  const getStatusColor = status => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
      case 'completed':
        return COLORS.primary;
      case 'processing':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      case 'shipped':
        return '#17a2b8';
      case 'pending':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = status => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
      case 'completed':
        return 'checkmark-circle';
      case 'processing':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'shipped':
        return 'car';
      case 'pending':
        return 'hourglass';
      default:
        return 'help-circle';
    }
  };

  const getStatusText = status => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredOrders =
    selectedFilter === 'all'
      ? orders
      : orders.filter(
          order => order.status.toLowerCase() === selectedFilter.toLowerCase(),
        );

  const handleOrderPress = order => {
    console.log('🖱️ Order pressed:', order.orderId);
    console.log('📦 Product data:', order.originalProduct);

    if (order.productId) {
      const productData = {
        _id: order.productId,
        name: order.serviceName,
        price: order.totalAmount / (order.items[0]?.quantity || 1),
        image:
          order.originalProduct?.image ||
          require('../../assets/images/logo.png'),
        description: order.description || '',
        quantity: order.items[0]?.quantity || 1,
      };

      console.log('🚀 Navigating to ProductDetails with:', productData);
      navigation.navigate('ProductDetails', { product: productData });
    } else {
      console.log('⚠️ No productId found, cannot navigate to ProductDetails');
      showPopup('Product details not available for this order');
    }
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not available';
      }
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.log('❌ Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => {
        console.log(`🎯 Filter changed to: ${value}`);
        setSelectedFilter(value);
      }}
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Head title="Order History" showBack={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
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
          <FilterButton label="Processing" value="processing" />
          <FilterButton label="Delivered" value="delivered" />
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
              {apiError ? (
                <Icon name="warning-outline" size={wp('15%')} color="#dc3545" />
              ) : (
                <Icon name="receipt-outline" size={wp('15%')} color="#adb5bd" />
              )}
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              {apiError ? 'Connection Error' : 'No orders found'}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              {apiError
                ? 'Unable to load orders. Please check your internet connection and try again.'
                : selectedFilter === 'all'
                ? "You haven't placed any orders yet"
                : `No ${selectedFilter} orders`}
            </Text>
            {apiError && (
              <TouchableOpacity
                style={[styles.retryBtn, { backgroundColor: COLORS.primary }]}
                onPress={fetchOrders}
              >
                <Icon name="refresh" size={wp('4%')} color="#fff" />
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredOrders.map(order => (
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
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) },
                ]}
              >
                <Icon
                  name={getStatusIcon(order.status)}
                  size={wp('3.5%')}
                  color="#fff"
                />
                <Text style={styles.statusText} numberOfLines={1}>
                  {getStatusText(order.status)}
                </Text>
              </View>

              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderId, { color: theme.textPrimary }]}>
                    {order.orderId}
                  </Text>
                  <Text
                    style={[
                      styles.orderDateTime,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {formatDate(order.date)} • {order.time}
                  </Text>
                </View>
              </View>

              <View style={styles.orderContent}>
                <Image
                  source={
                    order.originalProduct?.image
                      ? { uri: order.originalProduct.image }
                      : require('../../assets/images/logo.png')
                  }
                  style={styles.serviceImage}
                  resizeMode="cover"
                  defaultSource={require('../../assets/images/logo.png')}
                  onError={e => {
                    console.log('❌ Image load error:', e.nativeEvent.error);
                  }}
                />

                <View style={styles.orderDetails}>
                  <Text
                    style={[styles.serviceName, { color: theme.textPrimary }]}
                  >
                    {order.serviceName}
                  </Text>

                  <View style={styles.itemsContainer}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <View key={index} style={styles.itemRow}>
                        <Text
                          style={[
                            styles.itemName,
                            { color: theme.textSecondary },
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                        {item.price > 0 ? (
                          <Text
                            style={[
                              styles.itemPrice,
                              { color: theme.textPrimary },
                            ]}
                          >
                            ₹{item.price.toFixed(2)}{' '}
                            {item.quantity > 1 ? `× ${item.quantity}` : ''}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.itemPrice,
                              { color: theme.textSecondary },
                            ]}
                          ></Text>
                        )}
                      </View>
                    ))}
                    {order.items.length > 2 && (
                      <Text
                        style={[styles.moreItems, { color: COLORS.primary }]}
                      >
                        +{order.items.length - 2} more items
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                  <Text
                    style={[styles.totalLabel, { color: theme.textSecondary }]}
                  >
                    Total Amount
                  </Text>
                  <Text
                    style={[styles.totalAmount, { color: theme.textPrimary }]}
                  >
                    ₹{order.totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.paymentMethod}>
                  <Icon
                    name="wallet"
                    size={wp('4%')}
                    color={theme.textSecondary || '#6c757d'}
                  />
                  <Text
                    style={[styles.paymentText, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
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
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
    marginTop: hp('10%'),
    paddingHorizontal: wp('10%'),
  },
  emptyIcon: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
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
  retryBtn: {
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
  retryBtnText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
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
    backgroundColor: '#f8f9fa',
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
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: wp('3.2%'),
    flex: 1,
    marginRight: wp('2%'),
    lineHeight: hp('2.2%'),
  },
  itemPrice: {
    fontSize: wp('3.4%'),
    fontWeight: '600',
    flexShrink: 0,
    textAlign: 'right',
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
