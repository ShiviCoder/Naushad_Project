import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation} from '@react-navigation/native';
import COLORS from '../../utils/Colors'; // Use your COLORS config
import Popup from '../../components/PopUp';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SERVICE_PRICE = 1498;

const PaymentScreen = () => {
  const [method, setMethod] = useState('card');
  const navigation = useNavigation();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  const {theme} = useTheme();

  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const handlePayment = () => {
    if (method === 'wallet') {
      // Show coming soon popup for Wallet / Salon Credits
      showPopup('Coming Soon', 'Wallet / Salon Credits payment option will be available soon.');
      return;
    }
    const options = {
      description: 'Product Payment - Naushad Hair Salon',
      image: 'https://i.imgur.com/3g7nmJC.png', // Your logo URL
      currency: 'INR',
      key: 'rzp_test_RB4DVzPPSyg8yG', // Razorpay TEST KEY
      amount: SERVICE_PRICE * 100, // Amount in paise
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
        // On success, navigate to PaymentSuccessScreen with payment id
        navigation.replace('PaymentSuccessScreen', { paymentId: data.razorpay_payment_id });
      })
      .catch(error => {
        const errMsg ='Payment cancelled by user.';
        showPopup('Payment Failed', errMsg);
      });
  };

  return (
    <SafeAreaView style={[styles.safe,{backgroundColor : theme.background}]}>
      {/* Header */}
      <Head title="Payment"/>
      <ScrollView
        contentContainerStyle={[styles.contentContainer,{backgroundColor : theme.background}]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card with yellow glow */}
        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <View style={styles.titleRow}>
              <Text style={styles.service}>Haircut</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tier}>Premium</Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.infoText}>Fri, 15 Aug</Text>
              <Text style={styles.midDot}>•</Text>
              <Text style={styles.infoText}>3:30pm</Text>
            </View>

            <View style={[styles.infoRow, { marginTop: hp('1.2%') }]}>
              <MaterialIcons name="person" size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.infoText}>Pro: Assigned before visit</Text>
            </View>

            <View style={styles.addonsRow}>
              <Text style={styles.addonsLabel}>Add ons</Text>
              <Text style={styles.addonsPrice}>₹ {SERVICE_PRICE.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={styles.warmGlow} />
        </View>

        {/* Section Title */}
        <Text style={[styles.sectionTitle,{color : theme.textPrimary}]}>
          Select Payment Method
        </Text>

        {/* Radios */}
        <RadioItem
          label="Credit / Debit Card"
          selected={method === 'card'}
          onPress={() => setMethod('card')}
          primary={COLORS.primary}
        />
        <RadioItem
          label="UPI / Google pay / Paytm"
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
          <Text style={styles.totalValue}>₹ {SERVICE_PRICE.toLocaleString('en-IN')}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer,{backgroundColor : theme.background}]}>
        <TouchableOpacity activeOpacity={0.9} style={[styles.payBtn, { backgroundColor: COLORS.primary }]} onPress={handlePayment}>
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

function RadioItem({ label, selected, onPress, primary }) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity style={styles.radioRow} activeOpacity={0.8} onPress={onPress}>
      <View style={[
        styles.radioOuter,
        selected && { borderColor: primary, backgroundColor: '#FFF5E0' }
      ]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: primary }]} />}
      </View>
      <Text style={[styles.radioText,{color : theme.textPrimary}]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? hp('1.1%') : 0,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.7%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#FFF',
    marginTop: hp('5%'), // Added margin top 5%
  },
  backHit: { width: wp('12%'), height: wp('12%'), justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: '#18181A',
    letterSpacing: 0.2,
  },

  contentContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('7%'), // enough bottom margin for footer
  },

  // Card + yellow glow
  cardWrap: { marginTop: hp('1.6%'), marginBottom: hp('3.2%') },
  card: {
    backgroundColor: '#FFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
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
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary || '#F6B745',
        shadowOpacity: 0.42,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {},
    }),
  },

  // Title row
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: hp('0.3%') },
  service: { fontSize: wp('4.6%'), fontWeight: '700', color: '#080808', lineHeight: wp('6%') },
  bullet: { fontSize: wp('4.3%'), marginHorizontal: wp('2%'), color: '#28A47C', fontWeight: 'bold' },
  tier: { fontSize: wp('4.6%'), fontWeight: '700', color: '#28A47C', lineHeight: wp('6%') },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('1%') },
  infoText: { marginLeft: wp('2%'), fontSize: wp('3.8%'), color: '#1A1A1A', lineHeight: wp('5.5%') },
  midDot: { marginHorizontal: wp('2%'), fontSize: wp('4%'), color: '#808080', lineHeight: wp('5.5%') },

  // Add-ons
  addonsRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('2%') },
  addonsLabel: { fontSize: wp('3.8%'), fontWeight: '600', color: '#111' },
  addonsPrice: { marginLeft: 'auto', fontSize: wp('4.3%'), fontWeight: '700', color: '#171717' },

  // Section title
  sectionTitle: {
    marginTop: hp('0.5%'),
    fontSize: wp('4.3%'),
    fontWeight: '700',
    color: '#222',
    marginBottom: hp('1.3%'),
  },

  // Radios
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
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
    backgroundColor: '#FFF',
  },
  radioDot: { width: wp('3.6%'), height: wp('3.6%'), borderRadius: wp('1.8%'), backgroundColor: '#F6B745' },
  radioText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    lineHeight: wp('5.5%'),
    letterSpacing: 0.1,
  },

  // Total
  totalRow: { flexDirection: 'row', alignItems: 'center', marginTop: hp('4%'), marginBottom: hp('1%') },
  totalLabel: { fontSize: wp('5%'), fontWeight: '900', color: '#181818', letterSpacing: 0.1 },
  totalValue: { marginLeft: 'auto', fontSize: wp('5%'), fontWeight: '900', color: '#090909' },

  // Footer
  footer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.2%'),
    paddingBottom: Platform.OS === 'ios' ? hp('3.3%') : hp('2%'),
    backgroundColor: '#FFF',
    borderTopWidth: 0,
  },
  payBtn: {
    height: hp('6.5%'),
    borderRadius: wp('3.8%'),
    backgroundColor: '#F6B745',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('0.8%'),
  },
  payText: { fontSize: wp('4.3%'), fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.1 },
  terms: { textAlign: 'center', marginTop: hp('1%'), fontSize: wp('3%'), color: '#C6C6C6' ,marginBottom: hp('1%') },
});

export default PaymentScreen;