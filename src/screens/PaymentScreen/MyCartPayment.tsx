import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';

const MyCartPayment = () => {
  const [method, setMethod] = useState<'wallet'>('wallet');
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};

  const [processingPayment, setProcessingPayment] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // LOG ALL INCOMING PARAMS
  console.log('📥 MY CART PAYMENT - Route Params:', params);

  // Memoized totalPrice
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + itemPrice * itemQuantity;
    }, 0);
    console.log('💰 MyCart Total Payable Amount:', total);
    return total;
  }, [serviceList]);

  // Memoized hasSufficientBalance
  const hasSufficientBalance = useMemo(
    () => walletBalance >= totalPrice,
    [walletBalance, totalPrice],
  );

  // Memoized getItemSubtotal
  const getItemSubtotal = useCallback((item: any) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    return price * quantity;
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
  const getServiceTypeLabel = useCallback((type: string) => {
    const labelMap: Record<string, string> = {
      product: 'Product',
      package: 'Package',
      service: 'Service',
      cart: 'Cart Item',
    };
    return labelMap[type] || 'Item';
  }, []);

  // LOAD PRODUCT FOR "BUY NOW" OR SINGLE ITEM
  const loadProductFromStorage = useCallback(async () => {
    try {
      console.log('💾 [MyCart] Loading product from AsyncStorage...');

      const savedProduct = await AsyncStorage.getItem('buyNowProduct');

      if (savedProduct) {
        console.log('✅ [MyCart] Found saved product in AsyncStorage');
        const productData = JSON.parse(savedProduct);
        console.log('📦 [MyCart] Loaded Product Data:', productData);

        return [productData];
      } else {
        console.log('❌ [MyCart] No saved product found in AsyncStorage');
        return [];
      }
    } catch (error) {
      console.error(
        '❌ [MyCart] Error loading product from AsyncStorage:',
        error,
      );
      return [];
    }
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      console.log('💰 [MyCart] Fetching wallet balance...');

      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('💰 [MyCart] Wallet API Response:', data);

      if (data.success) {
        setWalletBalance(data.data.totalWalletAmount || 0);
        console.log('💰 [MyCart] Wallet Balance:', data.data.totalWalletAmount);
      } else {
        console.log(
          '❌ [MyCart] Failed to fetch wallet balance (success false)',
        );
      }
    } catch (error: any) {
      console.error('❌ [MyCart] Wallet fetch error:', error);
    } finally {
      setLoadingWallet(false);
    }
  }, []);

  // Process incoming params + storage
  const processIncomingData = useCallback(async () => {
    console.log('🔄 [MyCart] Processing incoming data');

    let processedServices: any[] = [];

    // Load from AsyncStorage if flag is set
    if (params.loadFromStorage === true || params.source === 'ProductDetails') {
      console.log('🔄 [MyCart] Loading from AsyncStorage (buyNow)');
      const storageProducts = await loadProductFromStorage();

      if (storageProducts.length > 0) {
        console.log('✅ [MyCart] Using product from AsyncStorage');
        processedServices = storageProducts;
      } else if (params.serviceName && params.price) {
        console.log(
          '🔄 [MyCart] Storage empty, using single item params as fallback',
        );
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
    // When a services array is passed from Cart
    else if (params.services && Array.isArray(params.services)) {
      console.log('✅ [MyCart] Processing services array from params');
      processedServices = params.services.map((service: any) => ({
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
    // Single item params
    else if (params.serviceName && params.price) {
      console.log('✅ [MyCart] Processing single service parameters');
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

    console.log('📋 [MyCart] Processed Services:', processedServices);

    if (processedServices.length > 0) {
      await AsyncStorage.setItem(
        'myCartCurrentPaymentServices',
        JSON.stringify(processedServices),
      );
      setServiceList(processedServices);
    } else {
      const stored = await AsyncStorage.getItem('myCartCurrentPaymentServices');
      if (stored) {
        const storedData = JSON.parse(stored);
        console.log('📂 [MyCart] Loaded stored services:', storedData);
        setServiceList(storedData);
      } else {
        console.log('❌ [MyCart] No services found for MyCartPayment');
      }
    }
  }, [params, loadProductFromStorage]);

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await processIncomingData();
      await fetchWalletBalance();
    } finally {
      setIsLoading(false);
    }
  }, [processIncomingData, fetchWalletBalance]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const showPopup = useCallback((title: string, message: string) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  }, []);

  const showSuccessPopup = useCallback(
    (message: string) => {
      setSuccessMessage(message);
      setSuccessPopupVisible(true);

      setTimeout(() => {
        setSuccessPopupVisible(false);
        navigation.replace('CartPaymentSuccess', {
          bookedServices: serviceList,
          totalAmount: totalPrice,
          paymentMethod: method,
        });
      }, 2000);
    },
    [serviceList, totalPrice, method, navigation],
  );

  const clearPaymentData = useCallback(async () => {
    console.log('🗑️ [MyCart] Clearing payment data');
    await AsyncStorage.removeItem('myCartCurrentPaymentServices');
    await AsyncStorage.removeItem('buyNowProduct');
    setServiceList([]);
  }, []);

  const processOrder = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log('🔑 [MyCart] Token:', token ? 'Present' : 'Missing');
      console.log('👤 [MyCart] User ID:', userId);

      if (!token) {
        console.log('❌ [MyCart] No token found');
        return {
          success: false,
          error: 'Authentication required. Please login again.',
        };
      }

      if (!hasSufficientBalance) {
        console.log('❌ [MyCart] Insufficient wallet balance');
        return {
          success: false,
          error:
            'Insufficient wallet balance. Please add money to your wallet.',
        };
      }

      console.log('🛒 [MyCart] Processing order for services:', serviceList);

      const service = serviceList[0];
      const hasProductPackageId =
        service?.productPackageId && service.productPackageId !== null;

      const orderData: any = {
        productDescription: service?.description || '',
        productName: service?.name || service?.serviceName || 'Product',
        amount: totalPrice,
        quantity: service?.quantity || 1,
        ...(hasProductPackageId
          ? { productPackageId: service.productPackageId }
          : { productId: service?.productId || null }),
      };

      console.log('📤 [MyCart] Sending order to API:');
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
      console.log('📥 [MyCart] API Response:', result);

      if (result.success) {
        console.log('✅ [MyCart] Order created successfully:', result);
        return {
          success: true,
          data: result.data,
          message: result.message || 'Order created successfully!',
        };
      } else {
        console.log('❌ [MyCart] Order creation failed:', result);
        return {
          success: false,
          error: result.message || 'Order creation failed',
          data: result.data || null,
        };
      }
    } catch (error: any) {
      console.error('❌ [MyCart] Order processing error:', error);
      return {
        success: false,
        error: `Network error: ${error.message}`,
      };
    }
  }, [serviceList, totalPrice, hasSufficientBalance]);

  const handleOrder = useCallback(async () => {
    console.log('🔄 [MyCart] handleOrder - Starting order process');

    if (serviceList.length === 0) {
      console.log('❌ [MyCart] No services found');
      showPopup('No Items', 'No items found for order.');
      return;
    }

    if (!hasSufficientBalance) {
      console.log('❌ [MyCart] Insufficient wallet balance');
      showPopup(
        'Insufficient Balance',
        `You need ₹${
          totalPrice - walletBalance
        } more in your wallet.\n\nCurrent Balance: ₹${walletBalance}\nOrder Total: ₹${totalPrice}`,
      );
      return;
    }

    try {
      console.log('🛒 [MyCart] Starting order processing');
      setProcessingPayment(true);

      const orderResult = await processOrder();

      if (orderResult.success) {
        console.log('✅ [MyCart] Order processed successfully');
        console.log('✅ [MyCart] Order Details:', orderResult.data);

        await clearPaymentData();
        showSuccessPopup('Order confirmed successfully!');
      } else {
        console.log('❌ [MyCart] Order processing failed');
        console.log('❌ [MyCart] Error:', orderResult.error);

        showPopup(
          'Order Failed',
          orderResult.error || 'Order was not completed. Please try again.',
        );
      }
    } catch (error) {
      console.log('❌ [MyCart] Order Error:', error);
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

  const handleRadioPress = useCallback(() => {
    setMethod('wallet');
  }, []);

  const SuccessPopup = useMemo(
    () => (
      <Modal
        visible={successPopupVisible}
        transparent
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

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <Head title="My Cart Payment" />
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
      <Head title="My Cart Payment" />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
                        {
                          color: hasSufficientBalance ? '#4CAF50' : '#F44336',
                        },
                      ]}
                    >
                      {hasSufficientBalance
                        ? 'Sufficient balance for order'
                        : 'Insufficient balance'}
                    </Text>
                  </View>
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
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.payBtn,
              {
                backgroundColor: hasSufficientBalance
                  ? COLORS.primary
                  : '#CCCCCC',
                opacity: hasSufficientBalance ? 1 : 0.7,
              },
            ]}
            onPress={handleOrder}
            disabled={processingPayment || !hasSufficientBalance}
          >
            {processingPayment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payText}>
                {hasSufficientBalance
                  ? `Confirm Order - ₹${totalPrice.toLocaleString('en-IN')}`
                  : 'Insufficient Balance'}
              </Text>
            )}
          </TouchableOpacity>
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

type RadioItemProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  primary: string;
  theme: any;
};

function RadioItem({
  label,
  selected,
  onPress,
  primary,
  theme,
}: RadioItemProps) {
  return (
    <TouchableOpacity
      style={styles.radioRow}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.radioOuter,
          selected && {
            borderColor: primary,
            backgroundColor: '#FFF5E0',
          },
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
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0,
  },
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

  // Product Image (if you want to show product thumbnail later)
  productImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    backgroundColor: '#f5f5f5',
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

  // Optional Product Details
  productDetails: {
    marginVertical: hp('1%'),
  },
  productDescription: {
    fontSize: wp('3.6%'),
    marginBottom: hp('1%'),
    lineHeight: hp('2.2%'),
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
  quantityNote: {
    fontSize: wp('3.2%'),
  },

  detailRow: {
    marginTop: hp('0.5%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
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
  unitPrice: { fontSize: wp('3.4%'), marginTop: hp('0.3%') },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: { fontSize: wp('4%'), fontWeight: '700' },
  originalPrice: {
    fontSize: wp('3.4%'),
    marginTop: hp('0.3%'),
    textDecorationLine: 'none',
  },
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
  radioDot: {
    width: wp('3.6%'),
    height: wp('3.6%'),
    borderRadius: wp('1.8%'),
  },
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

  // Footer
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
});

export default MyCartPayment;
