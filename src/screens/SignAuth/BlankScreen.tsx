import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors';

const copyToClipboard = text => {
  try {
    const { Clipboard } = require('react-native');
    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(text);
      return true;
    }
  } catch (error) {
    console.log('Clipboard error:', error);
  }
  return false;
};

const ReferFriendScreen = () => {
  const [referralCode] = useState('NAUS6U3MXT');
  const [copiedCode, setCopiedCode] = useState(false);
  const { theme } = useTheme();

  const copyCodeToClipboard = () => {
    try {
      const success = copyToClipboard(referralCode);
      if (success) {
        setCopiedCode(true);
      } else {
        Alert.alert(
          'Copy Referral Code',
          `Your referral code: ${referralCode}\n\nPress and hold to copy manually.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Share Instead', onPress: shareWithFriends },
          ],
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to copy code');
    }
  };

  const shareWithFriends = async () => {
    try {
      const shareMessage = `Join me on our salon app! Discover premium beauty and grooming services tailored just for you. Use my referral code: ${referralCode}`;
      await Share.share({
        message: shareMessage,
        title: 'Invite Friends',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
        <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
          Share Salon Luxury
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('5%'), paddingTop: hp('10%') }} // added top padding for header space
      >
        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Invite your friends to experience the finest hair, beauty, and spa
            services from our professional stylists. Let them enjoy the same
            premium care that you already love.
          </Text>

          <View
            style={[
              styles.referralCodeCard,
              { backgroundColor: COLORS.primary, shadowColor: theme.shadow },
            ]}
          >
            <Text style={[styles.referralCodeLabel, { color: theme.text }]}>
              Your Referral Code
            </Text>
            <Text style={[styles.referralCodeText, { color: theme.text }]} selectable>
              {referralCode}
            </Text>

            <TouchableOpacity
              style={[
                styles.copyButton,
                copiedCode
                  ? { backgroundColor: '#4CAF50' }
                  : { backgroundColor: '#fff' },
              ]}
              onPress={copyCodeToClipboard}
            >
              <Text style={styles.copyButtonText}>
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: COLORS.primary }]}
            onPress={shareWithFriends}
          >
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>

          {/* How It Works Section */}
          <View style={styles.howItWorksSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              How It Works
            </Text>

            {[ 
              {
                step: '1',
                title: 'Share Your Code',
                text: 'Send your unique referral code to friends directly through the app or via social platforms like WhatsApp, Instagram, or SMS.',
              },
              {
                step: '2',
                title: 'Friends Join',
                text: 'When your friends sign up using your referral code, they’ll get instant access to exclusive salon services and offers.',
              },
              {
                step: '3',
                title: 'Enjoy Together',
                text: 'Book appointments together and experience our personalized beauty and spa treatments with your friends.',
              },
            ].map(({ step, title, text }) => (
              <View key={step} style={styles.stepContainer}>
                <Text style={[styles.stepNumber, { color: COLORS.primary }]}>{step}</Text>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>{title}</Text>
                  <Text style={[styles.stepText, { color: theme.textSecondary }]}>{text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
    paddingVertical: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  content: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  mainTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
    lineHeight: hp('3%'),
    marginBottom: hp('4%'),
  },
  referralCodeCard: {
    borderRadius: wp('3%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('3%'),
    elevation: 4,
    alignItems: 'center',
  },
  referralCodeLabel: {
    fontSize: wp('4.5%'),
    marginBottom: hp('1.5%'),
  },
  referralCodeText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: hp('2%'),
  },
  copyButton: {
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2%'),
  },
  copyButtonText: {
    color: COLORS.primary,
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  signupButton: {
    paddingVertical: hp('1.3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: '98%',
    alignSelf: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  howItWorksSection: {
    marginTop: hp('4%'),
  },
  sectionTitle: {
    fontSize: wp('5.2%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: hp('2.5%'),
  },
  stepNumber: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    width: wp('10%'),
    textAlign: 'center',
  },
  stepTextContainer: {
    flex: 1,
    paddingLeft: wp('2%'),
  },
  stepTitle: {
    fontSize: wp('4.3%'),
    fontWeight: '600',
    marginBottom: hp('0.5%'),
  },
  stepText: {
    fontSize: wp('3.8%'),
    lineHeight: hp('2.8%'),
  },
});

export default ReferFriendScreen;
