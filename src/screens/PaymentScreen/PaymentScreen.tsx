import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  BackHandler,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentScreen = () => {
  const [method, setMethod] = useState('card');
  const [serviceList, setServiceList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  console.log('📥 PaymentScreen - Route Params:', params);


  useEffect(() => {
  const backAction = () => {
    navigation.goBack(); // 👈 सिर्फ पिछली screen पर ले जाएगा
    return true; // 👈 global exit handler को block करेगा
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);
  // ✅ Process incoming data based on source screen
  useEffect(() => {
    const processIncomingData = async () => {
      let processedServices = [];

      // Case 1: Coming from ProductDetails (single product)
      if (params.serviceName && params.price) {
        console.log('🛍️ Processing ProductDetails data');
        processedServices = [{
          type: 'product',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1, // Get quantity from ProductDetails
          date: params.date || '',
          time: params.time || null,
          source: 'ProductDetails'
        }];
      }
      // Case 2: Coming from ProductPackages (single package)
      else if (params.item && (params.item.name || params.item.title)) {
        console.log('📦 Processing ProductPackages data');
        processedServices = [{
          type: 'package',
          serviceName: params.item.name || params.item.title,
          name: params.item.name || params.item.title,
          price: params.item.price,
          quantity: params.quantity || 1, // Get quantity from ProductPackages
          date: params.date || '',
          time: params.time || null,
          source: 'ProductPackages'
        }];
      }
      // Case 3: Coming from ServiceDetails with quantity
      else if (params.services && Array.isArray(params.services)) {
        console.log('💇 Processing ServiceDetails data with quantity');
        processedServices = params.services.map(service => ({
          type: 'service',
          serviceName: service.serviceName || service.name,
          name: service.serviceName || service.name,
          price: service.price,
          quantity: service.quantity || 1, // Get quantity from ServiceDetails
          date: service.date || params.selectedDate || '',
          time: service.time || params.selectedTime || null,
          source: 'ServiceDetails'
        }));
      }
      // Case 4: Single service from ServiceDetails with quantity
      else if (params.serviceName && params.price) {
        console.log('💇 Processing single ServiceDetails data with quantity');
        processedServices = [{
          type: 'service',
          serviceName: params.serviceName,
          name: params.serviceName,
          price: params.price,
          quantity: params.quantity || 1, // Get quantity
          date: params.selectedDate || '',
          time: params.selectedTime || null,
          source: 'ServiceDetails'
        }];
      }
      // Case 5: Direct quantity parameter
      else if (params.quantity) {
        console.log('🔢 Processing direct quantity data');
        processedServices = [{
          type: 'item',
          serviceName: params.serviceName || 'Item',
          name: params.serviceName || 'Item',
          price: params.price || 0,
          quantity: params.quantity, // Direct quantity
          date: params.date || '',
          time: params.time || null,
          source: params.source || 'Direct'
        }];
      }

      console.log('✅ Processed Services with Quantities:', processedServices);

      // Store only the incoming services (don't mix with previous)
      if (processedServices.length > 0) {
        await AsyncStorage.setItem('currentPaymentServices', JSON.stringify(processedServices));
        setServiceList(processedServices);
      } else {
        // Fallback: try to load from storage
        const stored = await AsyncStorage.getItem('currentPaymentServices');
        if (stored) {
          const storedData = JSON.parse(stored);
          console.log('📂 Loaded stored services with quantities:', storedData);
          setServiceList(storedData);
        }
      }
    };

    processIncomingData();
  }, [params]);

  // ✅ Calculate total with quantity
  const totalPrice = useMemo(() => {
    const total = serviceList.reduce((acc, curr) => {
      const itemPrice = Number(curr.price || 0);
      const itemQuantity = Number(curr.quantity || 1);
      return acc + (itemPrice * itemQuantity);
    }, 0);
    console.log('💰 Total Price Calculation:', total);
    return total;
  }, [serviceList]);

  // ✅ Calculate subtotal for each item (price * quantity)
  const getItemSubtotal = (item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);
    const subtotal = price * quantity;
    console.log(`📊 Item Subtotal: ${price} × ${quantity} = ${subtotal}`);
    return subtotal;
  };

  // ✅ Get total quantity of all items
  const getTotalQuantity = () => {
    const totalQty = serviceList.reduce((acc, curr) => acc + Number(curr.quantity || 1), 0);
    console.log('📦 Total Quantity:', totalQty);
    return totalQty;
  };

  // ✅ Popup helper
  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // ✅ Clear storage after successful payment
  const clearPaymentData = async () => {
    await AsyncStorage.removeItem('currentPaymentServices');
    setServiceList([]);
  };

  // ✅ Payment
  const handlePayment = () => {
    if (serviceList.length === 0) {
      showPopup('No Items', 'No items found for payment');
      return;
    }

    if (method === 'wallet') {
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }

    const options = {
      description: 'Payment - Naushad Hair Salon',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_RB4DVzPPSyg8yG',
      amount: totalPrice * 100,
      name: 'Naushad Hair Salon',
      prefill: {
        email: 'customer@example.com',
        contact: '9876543210',
        name: 'Test User',
      },
      theme: { color: COLORS.primary },
    };

    RazorpayCheckout.open(options)
      .then(data => {
        clearPaymentData();
        navigation.replace('PaymentSuccessScreen', {
          paymentId: data.razorpay_payment_id,
          bookedServices: serviceList,
          totalAmount: totalPrice,
        });
      })
      .catch((error) => {
        console.log('Payment Error:', error);
        showPopup('Payment Failed', 'Payment was not completed. Please try again.');
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Handle formats like "12.00", "9.30", etc.
    let [hours, minutes] = timeString.split('.').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeString;

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getServiceTypeLabel = (type) => {
    switch (type) {
      case 'product': return 'Product';
      case 'package': return 'Package';
      case 'service': return 'Service';
      default: return 'Item';
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Head title="Payment" />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Services/Products List */}
        {serviceList.length > 0 ? (
          <View style={styles.serviceCard}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: hp('2%') }]}>
              Order Summary ({getTotalQuantity()} {getTotalQuantity() === 1 ? 'item' : 'items'})
            </Text>
            
            {serviceList.map((srv, i) => (
              <View key={i} style={styles.serviceBlock}>
                {/* Header Row: Service Name + Type Tag */}
                <View style={styles.serviceHeader}>
                  <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>
                    {srv.serviceName || srv.name || 'Unnamed'}
                  </Text>
                  <Text style={[styles.serviceTag, { 
                    backgroundColor: srv.type === 'product' ? '#E3F2FD' : 
                                   srv.type === 'package' ? '#E8F5E8' : '#FFF3E0',
                    color: srv.type === 'product' ? '#1976D2' : 
                          srv.type === 'package' ? '#2E7D32' : '#F57C00'
                  }]}>
                    {getServiceTypeLabel(srv.type)}
                  </Text>
                </View>

                {/* Quantity Display - Show for all item types */}
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
                      ({srv.quantity} units selected)
                    </Text>
                  )}
                </View>

                {/* Date & Time - only show if available */}
                {(srv.date || srv.time) && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                      🕒 {formatDate(srv.date)} {srv.time ? `• ${formatTime(srv.time)}` : ''}
                    </Text>
                  </View>
                )}
                
                {/* Source information */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    📱 From: {srv.source || 'Unknown'}
                  </Text>
                </View>

                {/* Price Breakdown */}
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

                {/* Divider (except last item) */}
                {i < serviceList.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No items found for payment
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Please go back and select a product or service
            </Text>
          </View>
        )}

        {/* ✅ Payment method options */}
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

            {/* Total Breakdown */}
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

      {/* ✅ Footer button */}
      {serviceList.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.payBtn, { backgroundColor: COLORS.primary }]}
            onPress={handlePayment}
          >
            <Text style={styles.payText}>Pay ₹{totalPrice.toLocaleString('en-IN')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Popup 
        visible={popupVisible} 
        message={popupMessage} 
        title={popupTitle} 
        onClose={() => setPopupVisible(false)} 
      />
    </SafeAreaView>
  );
};

function RadioItem({ label, selected, onPress, primary, theme }) {
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
});

export default PaymentScreen;