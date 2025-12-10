import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartPaymentScreen = () => {
  const [method, setMethod] = useState('wallet');
  const [serviceList, setServiceList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 🔥 LOG ALL INCOMING PARAMS
  console.log('📥 CART PAYMENT SCREEN - Route Params:', params);

  // Memoized totalPrice
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + itemPrice * itemQuantity;
    }, 0);
    console.log('💰 Total Payable Amount:', total);
    return total;
  }, [serviceList]);

  // Memoized hasSufficientBalance
  const hasSufficientBalance = useMemo(() => {
    return walletBalance >= totalPrice;
  }, [walletBalance, totalPrice]);

  // Memoized getItemSubtotal
  const getItemSubtotal = useCallback(item => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const subtotal = price * quantity;
    return subtotal;
  }, []);

  // Memoized getTotalQuantity
  const getTotalQuantity = useCallback(() => {
    const totalQty = serviceList.reduce(
      (acc, curr) => acc + Number(curr.quantity || 1),
      0,
    );
    return totalQty;
  }, [serviceList]);

  // Memoized getServiceTypeLabel
  const getServiceTypeLabel = useCallback(type => {
    const labelMap = {
      product: 'Product',
      package: 'Package',
      service: 'Service',
      cart: 'Cart Item',
    };
    return labelMap[type] || 'Item';
  }, []);

  // 🔥 FETCH PRODUCT DATA FROM ASYNC STORAGE
  const loadProductFromStorage = useCallback(async () => {
    try {
      console.log('💾 Loading product from AsyncStorage...');

      const savedProduct = await AsyncStorage.getItem('buyNowProduct');

      if (savedProduct) {
        console.log('✅ Found saved product in AsyncStorage');
        const productData = JSON.parse(savedProduct);
        console.log('📦 Loaded Product Data:', productData);

        return [productData];
      } else {
        console.log('❌ No saved product found in AsyncStorage');
        return [];
      }
    } catch (error) {
      console.error('❌ Error loading product from AsyncStorage:', error);
      return [];
    }
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      console.log('💰 Fetching wallet balance...');

      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('💰 Wallet API Response:', data);

      if (data.success) {
        setWalletBalance(data.data.totalWalletAmount || 0);
        console.log('💰 Wallet Balance:', data.data.totalWalletAmount);
      } else {
        console.log('❌ Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('❌ Wallet fetch error:', error);
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  // 🔥 Process incoming data
  const processIncomingData = useCallback(async () => {
    console.log('🔄 Processing incoming data');

    let processedServices = [];

    // 🔥 Load from AsyncStorage if flag is set
    if (params.loadFromStorage === true || params.source === 'ProductDetails') {
      console.log('🔄 Loading from AsyncStorage');
      const storageProducts = await loadProductFromStorage();

      if (storageProducts.length > 0) {
        console.log('✅ Using product from AsyncStorage');
        processedServices = storageProducts;
      } else if (params.serviceName && params.price) {
        console.log('🔄 Storage empty, using params');
        processedServices = [
          {
            type: 'product',
            serviceName: params.serviceName,
            name: params.serviceName,
            price: params.price,
            quantity: params.quantity || 1,
            source: 'DirectParams',
            productId: params.productId || null,
            description: params.description || '',
          },
        ];
      }
    }
    // Handle services array
    else if (params.services && Array.isArray(params.services)) {
      console.log('✅ Processing services array');
      processedServices = params.services.map(service => ({
        type: service.type || 'cart',
        serviceName: service.serviceName || service.name,
        name: service.serviceName || service.name,
        price: service.price,
        quantity: service.quantity || 1,
        image: service.image,
        source: service.source || 'Cart',
        productId: service.productId || service.id || null,
        productPackageId: service.productPackageId || null,
        description: service.description || '',
      }));
    }
    // Handle single service parameters
    else if (params.serviceName && params.price) {
      console.log('✅ Processing single service parameters');
      processedServices = [
        {
          type: 'product',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          source: 'DirectParams',
          productId: params.productId || null,
          description: params.description || '',
        },
      ];
    }

    console.log('📋 Processed Services:', processedServices);

    // Save to AsyncStorage for persistence
    if (processedServices.length > 0) {
      await AsyncStorage.setItem(
        'currentPaymentServices',
        JSON.stringify(processedServices),
      );
      setServiceList(processedServices);
    } else {
      // Try to load from storage if no new data
      const stored = await AsyncStorage.getItem('currentPaymentServices');
      if (stored) {
        const storedData = JSON.parse(stored);
        console.log('📂 Loaded stored services:', storedData);
        setServiceList(storedData);
      } else {
        console.log('❌ No services found');
      }
    }
  }, [params, loadProductFromStorage]);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await processIncomingData();
      await fetchWalletBalance();
    } finally {
      setIsLoading(false);
    }
  }, [processIncomingData, fetchWalletBalance]);

  // 🔥 FIXED BACK HANDLER - ALWAYS GO TO PRODUCTDETAILS
  const handleBackPress = useCallback(() => {
    console.log('🔙 Back pressed - ALWAYS navigating to ProductDetails');

    // 🔥 ALWAYS NAVIGATE TO PRODUCTDETAILS SCREEN
    navigation.navigate('MainTabs', {
      productId: serviceList[0]?.productId || params.productId,
      // Pass any other necessary product data
      serviceName: serviceList[0]?.serviceName || params.serviceName,
      price: serviceList[0]?.price || params.price,
      quantity: serviceList[0]?.quantity || params.quantity || 1,
    });

    return true; // Prevent default back action
  }, [navigation, serviceList, params]);

  // 🔥 Set up back handler - FIXED
  useEffect(() => {
    console.log('🔧 Setting up back handlers - ALWAYS to ProductDetails');

    // Software back button (Header back button)
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      console.log('🔙 Software back button pressed');
      e.preventDefault();
      handleBackPress();
    });

    // Hardware back button (Android)
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    // Cleanup
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation, handleBackPress]);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // 🔥 SHOW POPUP FUNCTION
  const showPopup = useCallback((title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  // 🔥 SHOW SUCCESS POPUP AND NAVIGATE
  const showSuccessPopup = useCallback(
    message => {
      setSuccessMessage(message);
      setSuccessPopupVisible(true);

      setTimeout(() => {
        setSuccessPopupVisible(false);
        // 🔥 Navigate to CartPaymentSuccess screen
        navigation.replace('CartPaymentSuccess', {
          bookedServices: serviceList,
          totalAmount: totalPrice,
          paymentMethod: method,
        });
      }, 2000);
    },
    [serviceList, totalPrice, method, navigation],
  );

  // 🔥 CLEAR PAYMENT DATA
  const clearPaymentData = useCallback(async () => {
    console.log('🗑️ Clearing payment data');
    await AsyncStorage.removeItem('currentPaymentServices');
    await AsyncStorage.removeItem('buyNowProduct');
    setServiceList([]);
  }, []);

  // 🔥 NAVIGATE TO ADD FUNDS SCREEN
  const navigateToAddFunds = useCallback(() => {
    console.log('💰 Navigating to FundAddScreen');
    navigation.navigate('FundAddScreen', {
      requiredAmount: totalPrice - walletBalance,
      returnScreen: 'CartPaymentScreen',
      returnParams: params,
    });
  }, [navigation, totalPrice, walletBalance, params]);

  // 🔥 PROCESS ORDER FUNCTION - FIXED: Send only one: productId OR productPackageId
  const processOrder = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      console.log('👤 User ID:', userId);

      if (!token) {
        console.log('❌ No token found');
        return {
          success: false,
          error: 'Authentication required. Please login again.',
        };
      }

      if (!hasSufficientBalance) {
        console.log('❌ Insufficient wallet balance');
        return {
          success: false,
          error:
            'Insufficient wallet balance. Please add money to your wallet.',
        };
      }

      console.log('🛒 Processing order for services:', serviceList);

      // Get the first service (assuming single product order)
      const service = serviceList[0];

      // 🔥 DECIDE WHICH ID TO SEND: productId OR productPackageId
      // If productPackageId exists, send only productPackageId
      // If no productPackageId, send productId
      const hasProductPackageId =
        service?.productPackageId && service.productPackageId !== null;

      // 🔥 Prepare order data for API - Send only ONE ID
      const orderData = {
        productDescription: service?.description || '', // Pass description
        productName: service?.name || service?.serviceName || 'Product', // Pass name
        amount: totalPrice, // 🔥 Pass TOTAL payable amount
        quantity: service?.quantity || 1, // Pass quantity
        // 🔥 Send ONLY ONE: productId OR productPackageId
        ...(hasProductPackageId
          ? { productPackageId: service.productPackageId }
          : { productId: service?.productId || null }),
      };

      console.log('📤 Sending order to API:');
      console.log(
        '🔗 API Endpoint: https://naushad.onrender.com/api/order/create-order',
      );
      console.log('📝 Order Data:', JSON.stringify(orderData, null, 2));
      console.log(
        '🔍 Sending:',
        hasProductPackageId ? 'productPackageId' : 'productId',
      );
      console.log(
        '🔍 ID Value:',
        hasProductPackageId ? service.productPackageId : service?.productId,
      );

      // 🔥 CALL THE CORRECT API ENDPOINT
      const response = await fetch(
        'https://naushad.onrender.com/api/order/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        },
      );

      const result = await response.json();
      console.log('📥 API Response:', result);

      if (result.success) {
        console.log('✅ Order created successfully:', result);
        return {
          success: true,
          data: result.data,
          message: result.message || 'Order created successfully!',
        };
      } else {
        console.log('❌ Order creation failed:', result);
        return {
          success: false,
          error: result.message || 'Order creation failed',
          data: result.data || null,
        };
      }
    } catch (error) {
      console.error('❌ Order processing error:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`,
      };
    }
  }, [serviceList, totalPrice, hasSufficientBalance]);

  // 🔥 HANDLE ORDER CONFIRMATION
  const handleOrder = useCallback(async () => {
    console.log('🔄 handleOrder - Starting order process');

    if (serviceList.length === 0) {
      console.log('❌ No services found');
      showPopup('No Items', 'No items found for order.');
      return;
    }

    if (!hasSufficientBalance) {
      console.log('❌ Insufficient wallet balance');
      showPopup(
        'Insufficient Balance',
        `You need ₹${
          totalPrice - walletBalance
        } more in your wallet.\n\nCurrent Balance: ₹${walletBalance}\nOrder Total: ₹${totalPrice}`,
      );
      return;
    }

    try {
      console.log('🛒 Starting order processing');
      setProcessingPayment(true);

      const orderResult = await processOrder();

      if (orderResult.success) {
        console.log('✅ Order processed successfully');
        console.log('✅ Order Details:', orderResult.data);

        await clearPaymentData();
        showSuccessPopup('Order confirmed successfully!');
      } else {
        console.log('❌ Order processing failed');
        console.log('❌ Error:', orderResult.error);

        showPopup(
          'Order Failed',
          orderResult.error || 'Order was not completed. Please try again.',
        );
      }
    } catch (error) {
      console.log('❌ Order Error:', error);
      showPopup('Order Failed', 'Order was not completed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  }, [
    serviceList,
    hasSufficientBalance,
    totalPrice,
    walletBalance,
    showPopup,
    processOrder,
    clearPaymentData,
    showSuccessPopup,
  ]);

  // Radio item handler
  const handleRadioPress = useCallback(() => {
    setMethod('wallet');
  }, []);

  // Success Popup Component
  const SuccessPopup = useMemo(
    () => (
      <Modal
        visible={successPopupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSuccessPopupVisible(false)}
      >
        <View style={styles.successPopupOverlay}>
          <View style={styles.successPopupContainer}>
            <Image
              source={require('../../assets/images/success.png')}
              style={styles.successImage}
              resizeMode="contain"
            />
            <Text style={styles.successPopupTitle}>Success!</Text>
            <Text style={styles.successPopupMessage}>{successMessage}</Text>
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.successLoader}
            />
            <Text style={styles.successRedirectText}>
              Redirecting to confirmation...
            </Text>
          </View>
        </View>
      </Modal>
    ),
    [successPopupVisible, successMessage],
  );

  // Full screen loading
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <Head title="Payment" />
        <ScrollView
          style={styles.loadingScroll}
          contentContainerStyle={styles.loadingContainer}
          showsVerticalScrollIndicator={false}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* 🔥 PASS handleBackPress TO HEAD COMPONENT */}
      <Head title="Payment" onBackPress={handleBackPress} />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Services list */}
        {serviceList.length > 0 ? (
          <View style={styles.serviceCard}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textPrimary, marginBottom: hp('2%') },
              ]}
            >
              Order Summary ({getTotalQuantity()}{' '}
              {getTotalQuantity() === 1 ? 'item' : 'items'})
            </Text>

            {serviceList.map((srv, i) => (
              <View key={i} style={styles.serviceBlock}>
                <View style={styles.serviceHeader}>
                  <Text
                    style={[styles.serviceTitle, { color: theme.textPrimary }]}
                  >
                    {srv.serviceName || srv.name || 'Unnamed'}
                  </Text>
                  <Text
                    style={[
                      styles.serviceTag,
                      {
                        backgroundColor:
                          srv.type === 'product'
                            ? '#E3F2FD'
                            : srv.type === 'package'
                            ? '#E8F5E8'
                            : srv.type === 'cart'
                            ? '#E8EAF6'
                            : '#FFF3E0',
                        color:
                          srv.type === 'product'
                            ? '#1976D2'
                            : srv.type === 'package'
                            ? '#2E7D32'
                            : srv.type === 'cart'
                            ? '#5C6BC0'
                            : '#F57C00',
                      },
                    ]}
                  >
                    {getServiceTypeLabel(srv.type)}
                  </Text>
                </View>

                <View style={styles.quantityRow}>
                  <Text
                    style={[
                      styles.quantityLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Quantity:
                  </Text>
                  <View style={styles.quantityBadge}>
                    <Text style={[styles.quantityValue, { color: '#fff' }]}>
                      {srv.quantity || 1}
                    </Text>
                  </View>
                  {srv.quantity > 1 && (
                    <Text
                      style={[
                        styles.quantityNote,
                        { color: theme.textSecondary },
                      ]}
                    >
                      ({srv.quantity} units)
                    </Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Text
                    style={[styles.detailText, { color: theme.textSecondary }]}
                  >
                    📱 From: {srv.source || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.footerRow}>
                  <View style={styles.priceDetails}>
                    <Text
                      style={[styles.addOnText, { color: theme.textPrimary }]}
                    >
                      {srv.quantity > 1
                        ? `₹${srv.price} × ${srv.quantity}`
                        : 'Price'}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text
                        style={[
                          styles.unitPrice,
                          { color: theme.textSecondary },
                        ]}
                      >
                        Unit price: ₹{srv.price}
                      </Text>
                    )}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: COLORS.primary }]}>
                      ₹{getItemSubtotal(srv)}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text
                        style={[
                          styles.originalPrice,
                          { color: theme.textSecondary },
                        ]}
                      >
                        (₹{srv.price} each)
                      </Text>
                    )}
                  </View>
                </View>

                {i < serviceList.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No items found for order
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Please go back and select a product or service
            </Text>
          </View>
        )}

        {serviceList.length > 0 && (
          <>
            {/* Wallet Balance Card */}
            <View style={styles.walletCard}>
              <View style={styles.walletHeader}>
                <Image
                  source={require('../../assets/wallet.png')}
                  style={styles.walletIcon}
                />
                <Text style={styles.walletTitle}>Salon Wallet</Text>
              </View>

              {loadingWallet ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={styles.walletLoader}
                />
              ) : (
                <>
                  <Text style={styles.walletBalanceLabel}>
                    Available Balance
                  </Text>
                  <Text style={styles.walletBalanceAmount}>
                    ₹ {walletBalance.toLocaleString('en-IN')}
                  </Text>

                  <View style={styles.balanceStatus}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: hasSufficientBalance
                            ? '#4CAF50'
                            : '#F44336',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: hasSufficientBalance ? '#4CAF50' : '#F44336' },
                      ]}
                    >
                      {hasSufficientBalance
                        ? 'Sufficient balance for order'
                        : 'Insufficient balance'}
                    </Text>
                  </View>

                  {/* Show required amount when insufficient */}
                  {!hasSufficientBalance && (
                    <View style={styles.requiredAmountContainer}>
                      <Text style={styles.requiredAmountText}>
                        Required: ₹
                        {(totalPrice - walletBalance).toLocaleString('en-IN')}
                      </Text>
                      <TouchableOpacity
                        style={styles.addFundsButton}
                        onPress={navigateToAddFunds}
                      >
                        <Text style={styles.addFundsButtonText}>Add Funds</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.textPrimary, marginTop: hp('2%') },
              ]}
            >
              Payment Method
            </Text>

            {/* Only Wallet Payment Option */}
            <RadioItem
              label="Wallet / Salon Credits"
              selected={method === 'wallet'}
              onPress={handleRadioPress}
              primary={COLORS.primary}
              theme={theme}
            />

            {/* Total Amount */}
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
                Total Payable:
              </Text>
              <Text style={[styles.totalValue, { color: theme.textPrimary }]}>
                ₹ {totalPrice.toLocaleString('en-IN')}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer Order Button */}
      {serviceList.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          {hasSufficientBalance ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.payBtn,
                {
                  backgroundColor: COLORS.primary,
                  opacity: processingPayment ? 0.7 : 1,
                },
              ]}
              onPress={handleOrder}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>
                  Confirm Order - ₹{totalPrice.toLocaleString('en-IN')}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.insufficientBalanceFooter}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.confirmBtn, { backgroundColor: '#CCCCCC' }]}
                disabled={true}
              >
                <Text style={[styles.confirmBtnText, { color: '#666' }]}>
                  Insufficient Balance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.addFundsBtn}
                onPress={navigateToAddFunds}
              >
                <Image
                  source={require('../../assets/wallet.png')}
                  style={styles.addFundsIcon}
                />
                <Text style={styles.addFundsBtnText}>
                  Add ₹{(totalPrice - walletBalance).toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Success Popup */}
      {SuccessPopup}

      {/* Error Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        title={popupTitle}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

// RadioItem Component
function RadioItem({ label, selected, onPress, primary, theme }) {
  return (
    <TouchableOpacity
      style={styles.radioRow}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.radioOuter,
          selected && { borderColor: primary, backgroundColor: '#FFF5E0' },
        ]}
      >
        {selected && (
          <View style={[styles.radioDot, { backgroundColor: primary }]} />
        )}
      </View>
      <Text style={[styles.radioText, { color: theme.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0 },
  contentContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  },

  // Loading styles
  loadingScroll: {
    flex: 1,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('20%'),
  },

  serviceCard: {
    borderRadius: wp('3.5%'),
    backgroundColor: '#fff',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },

  serviceBlock: { marginBottom: hp('1.5%') },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  serviceTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    flex: 1,
    marginRight: wp('2%'),
  },
  serviceTag: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1%'),
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.3%'),
  },
  quantityLabel: {
    fontSize: wp('3.6%'),
    marginRight: wp('2%'),
    fontWeight: '500',
  },
  quantityBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
    marginRight: wp('2%'),
  },
  quantityValue: {
    fontSize: wp('3.6%'),
    fontWeight: '700',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    alignItems: 'flex-start',
  },
  priceDetails: {
    flex: 1,
  },
  addOnText: { fontSize: wp('3.8%'), fontWeight: '500' },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: { fontSize: wp('4%'), fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginTop: hp('1.2%'),
    marginBottom: hp('1.2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  radioOuter: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: wp('4%'),
    borderWidth: 2,
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
  },
  radioDot: { width: wp('3.6%'), height: wp('3.6%'), borderRadius: wp('1.8%') },
  radioText: { fontSize: wp('4%'), fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: { fontSize: wp('5%'), fontWeight: '900' },
  totalValue: { marginLeft: 'auto', fontSize: wp('5%'), fontWeight: '900' },

  footer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  payBtn: {
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: {
    fontSize: wp('4.3%'),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  emptySubtext: {
    fontSize: wp('3.8%'),
    textAlign: 'center',
  },

  // Wallet Card Styles
  walletCard: {
    backgroundColor: COLORS.primary,
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  walletIcon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: '#fff',
    marginRight: wp('3%'),
  },
  walletTitle: {
    fontSize: wp('4.5%'),
    color: '#fff',
    fontWeight: '700',
  },
  walletLoader: {
    marginVertical: hp('2%'),
  },
  walletBalanceLabel: {
    color: '#fff',
    fontSize: wp('3.8%'),
    opacity: 0.9,
    marginTop: hp('1%'),
  },
  walletBalanceAmount: {
    color: '#fff',
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  balanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
  },
  statusIndicator: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('2%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },

  // Required Amount Container (inside wallet card)
  requiredAmountContainer: {
    marginTop: hp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requiredAmountText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    flex: 1,
  },
  addFundsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  addFundsButtonText: {
    color: COLORS.primary,
    fontSize: wp('3.8%'),
    fontWeight: '700',
  },

  // Insufficient Balance Footer
  insufficientBalanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  confirmBtnText: {
    fontSize: wp('4%'),
    fontWeight: '700',
  },
  addFundsBtn: {
    flex: 1,
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
  },
  addFundsIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#fff',
    marginRight: wp('2%'),
  },
  addFundsBtnText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
  },

  // Success Popup Styles
  successPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  successPopupContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    width: '100%',
    maxWidth: wp('85%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successImage: {
    width: wp('25%'),
    height: wp('25%'),
    marginBottom: hp('2%'),
  },
  successPopupTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  successPopupMessage: {
    fontSize: wp('4%'),
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  successLoader: {
    marginBottom: hp('1%'),
  },
  successRedirectText: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Additional styles
  detailRow: {
    marginVertical: hp('0.5%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
  },
  quantityNote: {
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
  },
  unitPrice: {
    fontSize: wp('3.2%'),
    marginTop: hp('0.2%'),
  },
  originalPrice: {
    fontSize: wp('3.2%'),
    marginTop: hp('0.2%'),
  },
});

export default CartPaymentScreen;
