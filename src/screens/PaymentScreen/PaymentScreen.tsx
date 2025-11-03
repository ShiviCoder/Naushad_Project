import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
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

  const services = Array.isArray(params.services)
    ? params.services
    : params.serviceName
      ? [params]
      : [];

  console.log(services);
  console.log(params)

  // ✅ Load stored services
  useEffect(() => {
    const loadStored = async () => {
      const stored = await AsyncStorage.getItem('selectedServices');
      if (stored) setServiceList(JSON.parse(stored));
    };
    loadStored();
  }, []);

  // ✅ Add new services if passed via route
  useEffect(() => {
    const syncServices = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedServices');
        let existing = stored ? JSON.parse(stored) : [];

        if (services && services.length > 0) {
          const newServices = Array.isArray(services) ? services : [services];
          newServices.forEach(s => {
            const serviceWithMeta = {
              ...s,
              date: params.selectedDate || s.date || '',
              time: params.selectedTime || s.time || '',
            };

            if (
              !existing.some(
                m =>
                  m.serviceName === serviceWithMeta.serviceName &&
                  m.price === serviceWithMeta.price &&
                  m.date === serviceWithMeta.date &&
                  m.time === serviceWithMeta.time
              )
            ) {
              existing.push(serviceWithMeta);
            }
          });
        }

        await AsyncStorage.setItem('selectedServices', JSON.stringify(existing));
        setServiceList(existing);
        console.log('🧾 Final serviceList:', existing);
      } catch (err) {
        console.error('⚠️ Error syncing services:', err);
      }
    };

    syncServices();
  }, [JSON.stringify(services), params.selectedDate, params.selectedTime]);

  // ✅ Calculate total
  const totalPrice = useMemo(() => {
    return serviceList.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
  }, [serviceList]);

  // ✅ Popup helper
  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // ✅ Clear storage after successful payment
  const clearCart = async () => {
    await AsyncStorage.removeItem('selectedServices');
    setServiceList([]);
  };

  // ✅ Payment
  const handlePayment = () => {
    if (method === 'wallet') {
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }

    const options = {
      description: 'Service Payment - Naushad Hair Salon',
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
        clearCart();
        navigation.replace('PaymentSuccessScreen', {
          paymentId: data.razorpay_payment_id,
          bookedServices: serviceList,
        });
      })
      .catch(() => {
        showPopup('Payment Failed', 'Payment cancelled by user.');
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // Wed
      month: 'short',   // Nov
      day: 'numeric',   // 12
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Handle formats like "12.00", "9.30", etc.
    let [hours, minutes] = timeString.split('.').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeString;

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 → 12 for 12-hour clock
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Head title="Payment" />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Single combined card for all selected services */}
        {serviceList.length > 0 && (
          <View style={styles.serviceCard}>
            {serviceList.map((srv, i) => (
              <View key={i} style={styles.serviceBlock}>
                {/* Header Row: Service Name + Tag */}
                <View style={styles.serviceHeader}>
                  <Text style={[styles.serviceTitle, { color: theme.textPrimary }]}>
                    {srv.serviceName || srv.name || 'Unnamed'}
                  </Text>
                  <Text style={styles.serviceTag}>Premium</Text>
                </View>

                {/* Date & Time - only show if available */}
                {(srv.date || srv.time) && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                      🕒 {formatDate(srv.date)} {srv.time ? `• ${formatTime(srv.time)}` : ''}
                    </Text>
                  </View>
                )}
                
                {/* Assigned Pro */}
                <View style={styles.detailRow}>
                  <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                    👤 Pro: Assigned before visit
                  </Text>
                </View>

                {/* Add-ons + Price */}
                <View style={styles.footerRow}>
                  <Text style={[styles.addOnText, { color: theme.textPrimary }]}>Add ons</Text>
                  <Text style={[styles.price, { color: COLORS.primary }]}>₹ {srv.price}</Text>
                </View>

                {/* Divider (except last item) */}
                {i < serviceList.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* ✅ Payment method options */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Select Payment Method
        </Text>

        <RadioItem label="Credit / Debit Card" selected={method === 'card'} onPress={() => setMethod('card')} primary={COLORS.primary} />
        <RadioItem label="UPI / Google Pay / Paytm" selected={method === 'upi'} onPress={() => setMethod('upi')} primary={COLORS.primary} />
        <RadioItem label="Wallet / Salon Credits" selected={method === 'wallet'} onPress={() => setMethod('wallet')} primary={COLORS.primary} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Payable:</Text>
          <Text style={[styles.totalValue, { color: theme.textPrimary }]}>₹ {totalPrice.toLocaleString('en-IN')}</Text>
        </View>
      </ScrollView>

      {/* ✅ Footer button */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.payBtn, { backgroundColor: COLORS.primary }]}
          onPress={handlePayment}
        >
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      <Popup visible={popupVisible} message={popupMessage} title={popupTitle} onClose={() => setPopupVisible(false)} />
    </SafeAreaView>
  );
};

function RadioItem({ label, selected, onPress, primary }) {
  const { theme } = useTheme();
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
  },
  serviceTitle: { fontSize: wp('4.2%'), fontWeight: '700' },
  serviceTag: { color: '#3CB371', fontSize: wp('3.8%'), fontWeight: '600' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('0.3%') },
  detailText: { fontSize: wp('3.6%') },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('1%') },
  addOnText: { fontSize: wp('3.8%'), fontWeight: '500' },
  price: { fontSize: wp('4%'), fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#EEE', marginTop: hp('1.2%') },

  sectionTitle: { fontSize: wp('4.5%'), fontWeight: '700', marginTop: hp('2.5%') },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp('1.5%') },
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
  totalRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('3%') },
  totalLabel: { fontSize: wp('5%'), fontWeight: '900' },
  totalValue: { marginLeft: 'auto', fontSize: wp('5%'), fontWeight: '900' },
  footer: { paddingHorizontal: wp('5%'), paddingVertical: hp('2%') },
  payBtn: { height: hp('6.5%'), borderRadius: wp('3.8%'), alignItems: 'center', justifyContent: 'center' },
  payText: { fontSize: wp('4.3%'), fontWeight: '800', color: '#FFFFFF' },
});
export default PaymentScreen;
