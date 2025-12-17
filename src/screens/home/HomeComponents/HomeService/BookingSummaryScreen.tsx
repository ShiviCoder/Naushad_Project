import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../../utils/Colors';
import Head from '../../../../components/Head';

const SALON_CONTACT = '+91 98765 43210';

const BookingSummaryScreen = () => {
  const route = useRoute<any>();
  const { services } = route.params;

  const total = services.reduce((sum: number, s: any) => sum + s.price, 0);

  const [popupVisible, setPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animated loader
  const loaderAnim = useRef(new Animated.Value(0)).current;

  const startLoaderAnimation = () => {
    loaderAnim.setValue(0);
    Animated.loop(
      Animated.timing(loaderAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const stopLoaderAnimation = () => {
    loaderAnim.stopAnimation();
  };

  const handleSendRequest = () => {
    if (isLoading) return;

    setIsLoading(true);
    startLoaderAnimation();

    // Simulate API / processing delay
    setTimeout(() => {
      stopLoaderAnimation();
      setIsLoading(false);
      setPopupVisible(true);
    }, 2000);
  };

  // translateX from -width to +width (we use percentage-based approximation)
  const translateX = loaderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-wp('40%'), wp('40%')],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Head title="Booking Summary" />

      <View style={styles.container}>
        {/* Salon Contact */}
        <View style={styles.contactBox}>
          <Text style={styles.contactLabel}>Salon Contact Number</Text>
          <Text style={styles.contactValue}>{SALON_CONTACT}</Text>
          <Text style={styles.contactHint}>
            Please contact on this number to confirm your booking.
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Selected Services</Text>

          {services.map((item: any) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.price}>₹{item.price}</Text>
            </View>
          ))}

          <View style={styles.separator} />

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{total}</Text>
          </View>
        </View>

        {/* Send Request Button */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleSendRequest}
            disabled={isLoading}
          >
            <Text style={styles.sendBtnText}>
              {isLoading ? 'Sending Request...' : 'Send Booking Request'}
            </Text>
          </TouchableOpacity>

          {/* Loader bar under the button */}
          {isLoading && (
            <View style={styles.loaderContainer}>
              <View style={styles.loaderTrack}>
                <Animated.View
                  style={[
                    styles.loaderThumb,
                    {
                      transform: [{ translateX }],
                    },
                  ]}
                />
              </View>
              <Text style={styles.loaderText}>Processing your booking...</Text>
            </View>
          )}
        </View>
      </View>

      {/* Success Popup */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../../../../assets/sucess.png')}
              style={styles.successImage}
              resizeMode="contain"
            />
            <Text style={styles.modalTitle}>Booking Request Sent</Text>
            <Text style={styles.modalMessage}>
              Your booking request has been sent successfully.
            </Text>
            <Text style={styles.modalNote}>
              Note: Please contact on this number to confirm your booking:
            </Text>
            <Text style={styles.modalContact}>{SALON_CONTACT}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
  },

  contactBox: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 2,
  },
  contactLabel: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },
  contactValue: {
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-Medium',
    marginVertical: hp('0.5%'),
  },
  contactHint: {
    fontSize: wp('3.2%'),
    color: '#777',
    fontFamily: 'Poppins-Medium',
  },

  summaryCard: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    elevation: 2,
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    marginBottom: hp('1.5%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('0.8%'),
  },
  name: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    flex: 1,
    marginRight: wp('4%'),
  },
  price: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: wp('4.8%'),
    fontFamily: 'Poppins-Medium',
  },

  buttonWrapper: {
    marginTop: hp('3%'),
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-Medium',
  },

  // Loader styles
  loaderContainer: {
    marginTop: hp('1.5%'),
    alignItems: 'center',
  },
  loaderTrack: {
    width: '80%',
    height: hp('0.8%'),
    borderRadius: hp('0.4%'),
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  loaderThumb: {
    width: '30%',
    height: '100%',
    borderRadius: hp('0.4%'),
    backgroundColor: COLORS.primary,
  },
  loaderText: {
    marginTop: hp('0.8%'),
    fontSize: wp('3.4%'),
    fontFamily: 'Poppins-Medium',
    color: '#555',
  },

  // Popup styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  successImage: {
    width: wp('18%'),
    height: wp('18%'),
    marginBottom: hp('1.5%'),
  },
  modalTitle: {
    fontSize: wp('4.6%'),
    fontFamily: 'Poppins-Medium',
    marginBottom: hp('0.8%'),
  },
  modalMessage: {
    fontSize: wp('3.6%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  modalNote: {
    fontSize: wp('3.4%'),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: '#555',
  },
  modalContact: {
    fontSize: wp('3.9%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
    marginBottom: hp('2%'),
    color: COLORS.primary,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: wp('3%'),
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('10%'),
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
});
