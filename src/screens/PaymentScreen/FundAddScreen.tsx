import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RazorpayCheckout from 'react-native-razorpay';
import COLORS from '../../utils/Colors';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const FundAddScreen = ({ navigation, route }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [walletBalance, setWalletBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const fetchWalletBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setWalletBalance(data.data.totalWalletAmount || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const showPopup = (msg, type = 'success') => {
    setPopupMessage(msg);
    setPopupType(type);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handleQuickAmountSelect = amount => {
    if (selectedAmount === amount) {
      setSelectedAmount(null);
      setCustomAmount('');
    } else {
      setSelectedAmount(amount);
      setCustomAmount(amount.toString());
    }
  };

  const handleCustomAmountChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    if (numericValue) {
      setSelectedAmount(parseInt(numericValue));
    } else {
      setSelectedAmount(null);
    }
  };

  // Generate Order ID API
  const generateOrderId = async amount => {
    try {
      console.log('Generating order ID for amount:', amount);
      const response = await fetch(
        'https://naushad.onrender.com/api/razorpay/generate-order-id',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
          }),
        },
      );

      const data = await response.json();
      console.log('Order ID API Response:', data);

      if (data.success) {
        return data.data.id;
      } else {
        throw new Error(data.error || 'Failed to generate order ID');
      }
    } catch (error) {
      console.error('Error generating order ID:', error);
      throw error;
    }
  };

  // Verify Payment API
  const verifyPayment = async (
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  ) => {
    try {
      console.log('Verifying payment with:', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      const response = await fetch(
        'https://naushad.onrender.com/api/razorpay/verify-order-id',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
          }),
        },
      );

      const data = await response.json();
      console.log('Verify Payment API Response:', data);

      if (data.success || data.msg === 'success') {
        return data;
      } else {
        throw new Error(
          data.error || data.msg || 'Payment verification failed',
        );
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  // Update Wallet API
  const updateWallet = async (amount, paymentId) => {
    try {
      console.log('Updating wallet with amount:', amount);
      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          paymentId: paymentId,
        }),
      });

      const data = await response.json();
      console.log('Update Wallet API Response:', data);

      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to update wallet');
      }
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  };

  // Refund API
  const processRefund = async paymentId => {
    try {
      console.log('Processing refund for paymentId:', paymentId);
      const response = await fetch(
        'https://naushad.onrender.com/api/razorpay/refund',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentId,
          }),
        },
      );

      const data = await response.json();
      console.log('Refund API Response:', data);

      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || 'Refund failed');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  };

  const initiatePayment = async () => {
    const amount = selectedAmount;
    if (!amount || amount < 49) {
      showPopup('Please enter a valid amount (minimum ₹ 49)', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderId = await generateOrderId(amount);

      const options = {
        description: 'Add Money to Fund',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_RB4DVzPPSyg8yG',
        amount: amount * 100,
        name: 'SMS App',
        order_id: orderId,
        prefill: {
          email: 'customer@rajmanijewellers.com',
          contact: '9999999999',
          name: 'Rajmani Customer',
        },
        theme: { color: COLORS.primary },
        notes: {
          purpose: 'Fund Top-up',
        },
      };

      console.log('Razorpay Options:', options);

      const razorpayData = await RazorpayCheckout.open(options);
      console.log('Razorpay Payment Success Data:', razorpayData);

      const razorpayOrderId = razorpayData.razorpay_order_id;
      const razorpayPaymentId = razorpayData.razorpay_payment_id;
      const razorpaySignature = razorpayData.razorpay_signature;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new Error('Payment data incomplete. Please try again.');
      }

      const verification = await verifyPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      );

      console.log('Payment Verification Result:', verification);

      const walletUpdate = await updateWallet(amount, razorpayPaymentId);

      fetchWalletBalance();

      // Show success popup first, then navigate back to CartPaymentScreen
      showPopup('Funds added successfully! Redirecting...', 'success');

      setTimeout(() => {
        const returnScreen = route.params?.returnScreen;
        if (returnScreen === 'CartPaymentScreen') {
          // Refresh CartPaymentScreen wallet balance
          navigation.navigate(returnScreen, {
            ...route.params?.returnParams,
            refreshWallet: true,
          });
        } else {
          navigation.replace('MainTabs');
        }
      }, 2000);
    } catch (error) {
      console.error('Payment Error:', error);

      let errorMessage = 'Payment failed. Please try again.';

      if (error.error) {
        const errorObj = error.error;
        if (errorObj.code === 2) {
          errorMessage = 'Payment cancelled by user';
        } else if (errorObj.description) {
          errorMessage = errorObj.description;
        }
      } else if (error.message) {
        if (error.message === 'success') {
          errorMessage =
            'Payment completed but there was an issue updating your wallet. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }

      showPopup(errorMessage, 'error');

      if (error.razorpay_payment_id) {
        try {
          await processRefund(error.razorpay_payment_id);
          console.log('Refund processed successfully');
        } catch (refundError) {
          console.error('Refund error:', refundError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    initiatePayment();
  };

  const WalletIcon = ({ size = 24, color = '#333' }) => (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color === '#333' ? '#e0e0e0' : COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
      }}
    >
      <Text style={{ fontSize: size * 0.6, color: '#fff', fontWeight: 'bold' }}>
        ₹
      </Text>
    </View>
  );

  const closeIcon = require('../../assets/close.png');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../assets/back.png')}
            style={[styles.backIcon, { tintColor: '#000' }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Funds</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Current Balance - Reduced Size */}
          <View style={styles.currentBalanceContainer}>
            <View style={styles.walletIconWrapper}>
              <WalletIcon size={wp('10%')} color={COLORS.primary} />
            </View>
            <Text style={styles.currentBalanceLabel}>Current Balance</Text>
            {balanceLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.currentBalanceAmount}>
                ₹ {walletBalance.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Amount Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Amount</Text>
            <View style={styles.quickAmountsGrid}>
              {quickAmounts.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.amountButton,
                    selectedAmount === amount && styles.amountButtonSelected,
                  ]}
                  onPress={() => handleQuickAmountSelect(amount)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.amountButtonText,
                      selectedAmount === amount &&
                        styles.amountButtonTextSelected,
                    ]}
                  >
                    ₹{amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Amount - Proper Height */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
            <View style={styles.customAmountContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.customAmountInput}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={customAmount}
                onChangeText={handleCustomAmountChange}
                maxLength={6}
                returnKeyType="done"
              />
            </View>
            <Text style={styles.minAmountText}>Min. ₹ 49</Text>
          </View>

          {/* Benefits Section - Reduced Size */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Fund Benefits</Text>
            <View style={styles.benefitItem}>
              <WalletIcon size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.benefitText}>Instant refunds to fund</Text>
            </View>
            <View style={styles.benefitItem}>
              <WalletIcon size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.benefitText}>
                Quick checkout for services
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <WalletIcon size={wp('4.5%')} color={COLORS.primary} />
              <Text style={styles.benefitText}>
                Special offers for fund users
              </Text>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By proceeding, you agree to our Terms & Conditions. Fund balance is
            non-refundable and non-transferable.
          </Text>

          {/* Spacer for footer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalSubLabel}>Including all charges</Text>
            </View>
            <Text style={styles.totalAmount}>₹{selectedAmount || 0}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.proceedButton,
              (!selectedAmount || selectedAmount < 49 || loading) &&
                styles.proceedButtonDisabled,
            ]}
            onPress={proceedToPayment}
            disabled={!selectedAmount || selectedAmount < 49 || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.proceedButtonText}>
                Proceed to Secure Payment
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Error/Success Popup Modal */}
      <Modal
        transparent
        visible={popupVisible}
        animationType="fade"
        onRequestClose={closePopup}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={closePopup}
            >
              <Image
                source={closeIcon}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.popupText}>{popupMessage}</Text>
            <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles remain exactly the same
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: wp('10%'),
    alignItems: 'flex-start',
  },
  backIcon: {
    width: wp('4%'),
    height: wp('4%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  headerSpacer: {
    width: wp('10%'),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('16%'),
  },
  currentBalanceContainer: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    backgroundColor: '#f8f9fa',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    borderRadius: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  walletIconWrapper: {
    position: 'absolute',
    top: -wp('4%'),
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('0.8%'),
    borderWidth: 3,
    borderColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  currentBalanceLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.3%'),
    marginTop: hp('1.8%'),
    fontWeight: '500',
  },
  currentBalanceAmount: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  section: {
    paddingHorizontal: wp('4%'),
    marginTop: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: wp('28%'),
    height: hp('7%'),
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.5%'),
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
  },
  amountButtonSelected: {
    backgroundColor: COLORS.primary + '10',
    borderColor: COLORS.primary,
  },
  amountButtonText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: '#333',
  },
  amountButtonTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    paddingHorizontal: wp('3.5%'),
    height: hp('6.5%'),
    marginBottom: hp('0.8%'),
  },
  currencySymbol: {
    fontSize: wp('5.5%'),
    fontWeight: '600',
    color: '#333',
    marginRight: wp('1.5%'),
  },
  customAmountInput: {
    flex: 1,
    height: hp('6%'),
    fontSize: wp('5.5%'),
    fontWeight: '600',
    color: '#333',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('1%'),
  },
  minAmountText: {
    fontSize: wp('3.2%'),
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  benefitsContainer: {
    marginHorizontal: wp('4%'),
    marginTop: hp('3%'),
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#e1f0ff',
  },
  benefitsTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: hp('1.5%'),
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  benefitText: {
    fontSize: wp('3.5%'),
    color: '#333',
    flex: 1,
    marginLeft: wp('2%'),
    lineHeight: wp('4.5%'),
  },
  termsText: {
    fontSize: wp('3%'),
    color: '#666',
    textAlign: 'center',
    lineHeight: wp('4%'),
    marginTop: hp('2.5%'),
    paddingHorizontal: wp('8%'),
    marginBottom: hp('2%'),
  },
  bottomSpacer: {
    height: hp('1.5%'),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.8%'),
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('3%'),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.8%'),
  },
  totalLabel: {
    fontSize: wp('3.8%'),
    color: '#666',
    fontWeight: '500',
  },
  totalSubLabel: {
    fontSize: wp('3%'),
    color: '#999',
    marginTop: hp('0.2%'),
    fontWeight: '400',
  },
  totalAmount: {
    fontSize: wp('6.5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  proceedButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    height: hp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  proceedButtonDisabled: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  popupBox: {
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  popupText: {
    fontSize: width * 0.038,
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.018,
    lineHeight: height * 0.023,
    fontWeight: '400',
  },
  popupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: width * 0.018,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: width * 0.032,
  },
  closeIconWrapper: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.025,
    padding: width * 0.008,
  },
  closeIcon: {
    width: width * 0.04,
    height: width * 0.04,
    tintColor: '#333',
  },
});

export default FundAddScreen;
