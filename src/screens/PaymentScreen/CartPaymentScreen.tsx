import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartPaymentScreen = () => {
  const [method, setMethod] = useState('card');
  const [serviceList, setServiceList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const [processingPayment, setProcessingPayment] = useState(false);

  // New state for success popup
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  console.log('📥 PaymentScreen - Route Params:', params);

  // Process incoming services from different params
  useEffect(() => {
    const processIncomingData = async () => {
      console.log('🔄 processIncomingData - Starting data processing');

      let processedServices = [];

      console.log('🔄 processIncomingData - Processing params:', params);

      // Handle different parameter structures
      if (params.services && Array.isArray(params.services)) {
        console.log('✅ processIncomingData - Processing services array');
        processedServices = params.services.map(service => ({
          type: service.type || 'cart',
          serviceName: service.serviceName || service.name,
          name: service.serviceName || service.name,
          price: service.price,
          quantity: service.quantity || 1,
          image: service.image,
          source: service.source || 'Cart'
        }));
      }
      else if (params.serviceName && params.price) {
        console.log('✅ processIncomingData - Processing single service');
        processedServices = [{
          type: 'product',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          source: 'ProductDetails'
        }];
      }
      else if (params.item && (params.item.name || params.item.title)) {
        console.log('✅ processIncomingData - Processing package item');
        processedServices = [{
          type: 'package',
          serviceName: params.item.name || params.item.title,
          name: params.item.name || params.item.title,
          price: params.item.price,
          quantity: params.quantity || 1,
          source: 'ProductPackages'
        }];
      }
      else if (params.serviceName && params.price) {
        console.log('✅ processIncomingData - Processing service details');
        processedServices = [{
          type: 'service',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1,
          source: 'ServiceDetails'
        }];
      }

      console.log('📋 processIncomingData - Processed Services:', processedServices);

      // Storage update
      if (processedServices.length > 0) {
        console.log('💾 processIncomingData - Saving to AsyncStorage');
        await AsyncStorage.setItem('currentPaymentServices', JSON.stringify(processedServices));
        setServiceList(processedServices);
      } else {
        console.log('📂 processIncomingData - No processed services, loading from storage');
        // fallback load from storage
        const stored = await AsyncStorage.getItem('currentPaymentServices');
        if (stored) {
          const storedData = JSON.parse(stored);
          console.log('📂 processIncomingData - Loaded stored services:', storedData);
          setServiceList(storedData);
        } else {
          console.log('❌ processIncomingData - No services found in storage');
        }
      }
    };

    processIncomingData();
  }, [params]);

  // Calculate total price based on services and quantities
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + (itemPrice * itemQuantity);
    }, 0);
    console.log('💰 Total Price Calculation:', total);
    return total;
  }, [serviceList]);

  // Function to get subtotal per item
  const getItemSubtotal = (item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const subtotal = price * quantity;
    console.log(`📦 getItemSubtotal - ${item.serviceName}: ${price} × ${quantity} = ${subtotal}`);
    return subtotal;
  };

  // Total quantity for all items
  const getTotalQuantity = () => {
    const totalQty = serviceList.reduce((acc, curr) => acc + Number(curr.quantity || 1), 0);
    console.log('📊 getTotalQuantity:', totalQty);
    return totalQty;
  };

  // Popup control helper
  const showPopup = (title, message) => {
    console.log('📢 showPopup:', title, message);
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // Success popup helper
  const showSuccessPopup = (message) => {
    console.log('🎉 showSuccessPopup:', message);
    setSuccessMessage(message);
    setSuccessPopupVisible(true);

    // Auto navigate after 2 seconds
    setTimeout(() => {
      console.log('🔄 showSuccessPopup - Auto navigating to success screen');
      setSuccessPopupVisible(false);
      navigation.replace('PaymentSuccessScreen', {
        bookedServices: serviceList,
        totalAmount: totalPrice,
        paymentMethod: method,
      });
    }, 2000);
  };

  const clearPaymentData = async () => {
    console.log('🗑️ clearPaymentData - Clearing payment data from storage');
    await AsyncStorage.removeItem('currentPaymentServices');
    setServiceList([]);
  };

  // Process order API call
  const processOrder = async (services) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log('🔑 Token from storage:', token ? 'Present' : 'Missing');
      console.log('👤 User ID from storage:', userId);

      if (!token) {
        console.log('❌ No token found');
        return { success: false, error: 'Authentication required. Please login again.' };
      }

      console.log('🛒 Processing order for services:', services);

      const requestBody = {
        services: services,
        totalAmount: totalPrice,
        paymentMethod: method,
        userId: userId,
        type: 'product_purchase'
      };

      console.log('📤 Sending to backend:', JSON.stringify(requestBody, null, 2));

      // For now, use mock since the endpoint might not be ready
      return await processMockOrder(services);

    } catch (error) {
      console.error('❌ Order processing error:', error);
      return await processMockOrder(services); // Fallback to mock
    }
  };

  // Mock order function for development
  const processMockOrder = async (services) => {
    console.log('🛒 MOCK: Processing order for development');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful response
    const mockResponse = {
      success: true,
      data: {
        orderId: 'order_' + Date.now(),
        status: 'confirmed',
        transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
        amount: totalPrice,
        services: services,
        message: 'Order confirmed successfully!'
      }
    };

    console.log('✅ MOCK: Order processed successfully');
    return { success: true, data: mockResponse };
  };

  // Handle order process
  const handleOrder = async () => {
    console.log('🔄 handleOrder - Starting order process');

    if (serviceList.length === 0) {
      console.log('❌ handleOrder - No services found');
      showPopup('No Items', 'No items found for order.');
      return;
    }

    if (method === 'wallet') {
      console.log('ℹ️ handleOrder - Wallet method selected (not available)');
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }

    try {
      console.log('🛒 handleOrder - Starting order processing');
      setProcessingPayment(true);

      // Process order
      const servicesArray = serviceList.map(service => ({
        name: service.serviceName,
        price: service.price,
        quantity: service.quantity,
        type: service.type
      }));

      console.log('🛒 Final Order Data:');
      console.log('   Services:', servicesArray);
      console.log('   Total Amount:', totalPrice);
      console.log('   Payment Method:', method);

      const orderResult = await processOrder(servicesArray);

      if (orderResult.success) {
        console.log('✅ handleOrder - Order processed successfully');
        // Clear stored payment services data
        await clearPaymentData();
        // Show success popup with image
        showSuccessPopup('Order confirmed successfully!');
      } else {
        console.log('❌ handleOrder - Order processing failed');
        showPopup('Order Failed', `Order processing failed: ${orderResult.error}`);
      }
    } catch (error) {
      console.log('❌ Order Error:', error);
      showPopup('Order Failed', 'Order was not completed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getServiceTypeLabel = (type) => {
    const labelMap = {
      'product': 'Product',
      'package': 'Package',
      'service': 'Service',
      'cart': 'Cart Item'
    };
    const label = labelMap[type] || 'Item';
    console.log(`🏷️ getServiceTypeLabel - ${type} -> ${label}`);
    return label;
  };

  // Success Popup Component
  const SuccessPopup = () => (
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
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.successLoader} />
          <Text style={styles.successRedirectText}>Redirecting to confirmation...</Text>
        </View>
      </View>
    </Modal>
  );

  // Log navigation state for debugging
  useEffect(() => {
    const state = navigation.getState();
    console.log("📌 Full Navigation State:", state);
    console.log("📌 All Routes:", state.routes);
    console.log("📌 Current Route:", state.routes[state.index]);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Head title="Payment" />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Services list */}
        {serviceList.length > 0 ? (
          <View style={styles.serviceCard}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: hp('2%') }]}>
              Order Summary ({getTotalQuantity()} {getTotalQuantity() === 1 ? 'item' : 'items'})
            </Text>

            {serviceList.map((srv, i) => (
              <View key={i} style={styles.serviceBlock}>
                <View style={styles.serviceHeader}>
                  <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>
                    {srv.serviceName || srv.name || 'Unnamed'}
                  </Text>
                  <Text style={[styles.serviceTag, {
                    backgroundColor: srv.type === 'product' ? '#E3F2FD' :
                      srv.type === 'package' ? '#E8F5E8' :
                        srv.type === 'cart' ? '#E8EAF6' : '#FFF3E0',
                    color: srv.type === 'product' ? '#1976D2' :
                      srv.type === 'package' ? '#2E7D32' :
                        srv.type === 'cart' ? '#5C6BC0' : '#F57C00'
                  }]}>
                    {getServiceTypeLabel(srv.type)}
                  </Text>
                </View>

                <View style={styles.quantityRow}>
                  <Text style={[styles.quantityLabel, { color: theme.textSecondary }]}>
                    Quantity:
                  </Text>
                  <View style={styles.quantityBadge}>
                    <Text style={[styles.quantityValue, { color: '#fff' }]}>
                      {srv.quantity || 1}
                    </Text>
                  </View>
                  {srv.quantity > 1 && (
                    <Text style={[styles.quantityNote, { color: theme.textSecondary }]}>
                      ({srv.quantity} units)
                    </Text>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    📱 From: {srv.source || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.footerRow}>
                  <View style={styles.priceDetails}>
                    <Text style={[styles.addOnText, { color: theme.textPrimary }]}>
                      {srv.quantity > 1 ? `₹${srv.price} × ${srv.quantity}` : 'Price'}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text style={[styles.unitPrice, { color: theme.textSecondary }]}>
                        Unit price: ₹{srv.price}
                      </Text>
                    )}
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: COLORS.primary }]}>
                      ₹{getItemSubtotal(srv)}
                    </Text>
                    {srv.quantity > 1 && (
                      <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                        (₹{srv.price} each)
                      </Text>
                    )}
                  </View>
                </View>

                {i < serviceList.length - 1 && (
                  <View style={styles.divider} />
                )}
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
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: hp('2%') }]}>
              Select Payment Method
            </Text>

            <RadioItem
              label="Credit / Debit Card"
              selected={method === 'card'}
              onPress={() => setMethod('card')}
              primary={COLORS.primary}
              theme={theme}
            />
            <RadioItem
              label="UPI / Google Pay / Paytm"
              selected={method === 'upi'}
              onPress={() => setMethod('upi')}
              primary={COLORS.primary}
              theme={theme}
            />
            <RadioItem
              label="Wallet / Salon Credits"
              selected={method === 'wallet'}
              onPress={() => setMethod('wallet')}
              primary={COLORS.primary}
              theme={theme}
            />

            <View style={styles.totalBreakdown}>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
                  Subtotal ({getTotalQuantity()} items):
                </Text>
                <Text style={[styles.breakdownValue, { color: theme.textPrimary }]}>
                  ₹{serviceList.reduce((acc, curr) => acc + getItemSubtotal(curr), 0).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
                  GST (10%):
                </Text>
                <Text style={[styles.breakdownValue, { color: theme.textPrimary }]}>
                  ₹{Math.round(totalPrice * 0.1).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable:</Text>
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
            style={[styles.payBtn, { backgroundColor: COLORS.primary }]}
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
        </View>
      )}

      {/* Success Popup */}
      <SuccessPopup />

      {/* Error Popup */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        title={popupTitle}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
}

function RadioItem({ label, selected, onPress, primary, theme }) {
  console.log(`🔘 RadioItem - ${label}: ${selected ? 'selected' : 'not selected'}`);
  return (
    <TouchableOpacity style={styles.radioRow} activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          styles.radioOuter,
          selected && { borderColor: primary, backgroundColor: '#FFF5E0' },
        ]}
      >
        {selected && <View style={[styles.radioDot, { backgroundColor: primary }]} />}
      </View>
      <Text style={[styles.radioText, { color: theme.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0 },
  contentContainer: { paddingHorizontal: wp('5%'), paddingVertical: hp('1.5%') },

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
  quantityNote: {
    fontSize: wp('3.2%'),
    fontStyle: 'italic',
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('0.3%') },
  detailText: { fontSize: wp('3.6%') },
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
  unitPrice: {
    fontSize: wp('3.2%'),
    marginTop: hp('0.2%'),
    fontStyle: 'italic',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: { fontSize: wp('4%'), fontWeight: '700' },
  originalPrice: {
    fontSize: wp('3%'),
    marginTop: hp('0.2%'),
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
  radioDot: { width: wp('3.6%'), height: wp('3.6%'), borderRadius: wp('1.8%') },
  radioText: { fontSize: wp('4%'), fontWeight: '700' },
  totalBreakdown: {
    marginTop: hp('2%'),
    paddingTop: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  breakdownLabel: {
    fontSize: wp('3.8%'),
  },
  breakdownValue: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
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
    justifyContent: 'center'
  },
  payText: { fontSize: wp('4.3%'), fontWeight: '800', color: '#FFFFFF' },
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

export default CartPaymentScreen;