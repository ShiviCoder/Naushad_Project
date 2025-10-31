import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentScreen = () => {
  const [method, setMethod] = useState('card');
  const navigation = useNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const { theme } = useTheme();

  // ✅ Get params from navigation
  const route = useRoute();
  const { serviceName, price, date, time } = route.params || {};

  // ✅ Convert price safely
  const totalPrice = price ? Number(price) : 0;

  // ✅ Convert date to readable format (e.g., Fri, 15 Aug)
  const readableDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
    : 'Select Date';

  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const handlePayment = () => {
    if (method === 'wallet') {
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }

    const options = {
      description: 'Product Payment - Naushad Hair Salon',
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
        navigation.replace('PaymentSuccessScreen', { paymentId: data.razorpay_payment_id });
      })
      .catch(() => {
        showPopup('Payment Failed', 'Payment cancelled by user.');
      });
  };

  // ✅ Convert 24-hour time to 12-hour AM/PM format
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';

    // Split hours & minutes (handles both "12.00" and "12:00" formats)
    const [hoursRaw, minutesRaw] = timeStr.replace('.', ':').split(':');
    let hours = parseInt(hoursRaw, 10);
    const minutes = minutesRaw || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert 0 → 12
    return `${hours}:${minutes.padStart(2, '0')} ${ampm}`;
  };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Head title="Payment" />
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Summary Card */}
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <Text style={styles.service}>{serviceName || 'Selected Service'}</Text>
            </View>

            {date && time ? (
              <View style={styles.infoRow}>
                <MaterialIcons name="access-time" size={wp('4.5%')} color={COLORS.primary} />
                <Text style={styles.infoText}>{readableDate}</Text>
                <Text style={styles.midDot}>•</Text>
                <Text style={styles.infoText}>{formatTime(time)}</Text>
              </View>
            ) : null}
            <View style={[styles.infoRow, { marginTop: hp('1.2%') }]}>
              <MaterialIcons name="person" size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.infoText}>Pro: Assigned before visit</Text>
            </View>

            <View style={styles.addonsRow}>
              <Text style={styles.addonsLabel}>Service Price</Text>
              <Text style={styles.addonsPrice}>₹ {totalPrice.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.warmGlow} />
        </View>

        {/* Section Title */}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Select Payment Method
        </Text>

        {/* Payment Method Radio Buttons */}
        <RadioItem
          label="Credit / Debit Card"
          selected={method === 'card'}
          onPress={() => setMethod('card')}
          primary={COLORS.primary}
        />
        <RadioItem
          label="UPI / Google Pay / Paytm"
          selected={method === 'upi'}
          onPress={() => setMethod('upi')}
          primary={COLORS.primary}
        />
        <RadioItem
          label="Wallet / Salon Credits"
          selected={method === 'wallet'}
          onPress={() => setMethod('wallet')}
          primary={COLORS.primary}
        />

        {/* Total row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable:</Text>
          <Text style={styles.totalValue}>₹ {totalPrice.toLocaleString('en-IN')}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.payBtn, { backgroundColor: COLORS.primary }]}
          onPress={handlePayment}
        >
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>
          By proceeding, you agree to Terms & Conditions
        </Text>
      </View>

      <Popup
        visible={popupVisible}
        message={popupMessage}
        title={popupTitle}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

// Reusable radio button
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

// styles (same as your file)
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0,
  },
  contentContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('7%'),
  },
  cardWrap: { marginTop: hp('1.6%'), marginBottom: hp('3.2%') },
  card: {
    backgroundColor: '#FFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  warmGlow: {
    height: hp('1.7%'),
    marginHorizontal: wp('3%'),
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.3%') },
  service: { fontSize: wp('4.6%'), fontWeight: '700', color: '#080808' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('1%') },
  infoText: { marginLeft: wp('2%'), fontSize: wp('3.8%'), color: '#1A1A1A' },
  midDot: { marginHorizontal: wp('2%'), fontSize: wp('4%'), color: '#808080' },
  addonsRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('2%') },
  addonsLabel: { fontSize: wp('3.8%'), fontWeight: '600', color: '#111' },
  addonsPrice: { marginLeft: 'auto', fontSize: wp('4.3%'), fontWeight: '700', color: '#171717' },
  sectionTitle: { fontSize: wp('4.3%'), fontWeight: '700', marginBottom: hp('1.3%') },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: hp('1.8%') },
  radioOuter: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: wp('4%'),
    borderWidth: 2,
    borderColor: '#D7D7D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('4%'),
    backgroundColor: '#FFF',
  },
  radioDot: { width: wp('3.6%'), height: wp('3.6%'), borderRadius: wp('1.8%') },
  radioText: { fontSize: wp('4%'), fontWeight: '700' },
  totalRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('4%'), marginBottom: hp('1%') },
  totalLabel: { fontSize: wp('5%'), fontWeight: '900' },
  totalValue: { marginLeft: 'auto', fontSize: wp('5%'), fontWeight: '900' },
  footer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.2%'),
    paddingBottom: Platform.OS === 'ios' ? hp('3.3%') : hp('2%'),
  },
  payBtn: {
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: { fontSize: wp('4.3%'), fontWeight: '800', color: '#FFFFFF' },
  terms: { textAlign: 'center', marginTop: hp('1%'), fontSize: wp('3%'), color: '#C6C6C6' },
});

export default PaymentScreen;
