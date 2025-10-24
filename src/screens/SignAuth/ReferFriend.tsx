import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors';

const copyToClipboard = (text) => {
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
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to copy code');
    }
  };

  const shareWithFriends = async () => {
    try {
      const shareMessage = `Join me on this amazing app and earn ₹100 Digital Gold! Use my referral code: ${referralCode}`;

      await Share.share({
        message: shareMessage,
        title: 'Invite Friends & Earn Rewards',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Head title="Refer a Friend" showBack={true}/>

      <View style={styles.content}>
        <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
          Invite & Get Rewards
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Share the love of great hair and beauty! Invite your friends to try
          our premium salon services and earn rewards when they book their first
          appointment.
        </Text>

        <View
          style={[
            styles.referralCodeCard,
            {
              backgroundColor: COLORS.primary,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <Text style={[styles.referralCodeLabel, { color: theme.text }]}>
            Your Referral Code
          </Text>
          <Text
            style={[styles.referralCodeText, { color: theme.text }]}
            selectable
          >
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
          style={[styles.shareButton, {backgroundColor : COLORS.primary}]}
          onPress={shareWithFriends}
        >
          <Text style={styles.shareButtonText}>Share with Friends</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  mainTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
    color: '#F6B745',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  shareButton: {
    paddingVertical: hp('2.5%'),
    borderRadius: wp('3%'),
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ReferFriendScreen;
