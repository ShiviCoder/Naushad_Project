import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
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
  const [referralCode, setReferralCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://naushad.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.user && data.user.referralCode) {
        setReferralCode(data.user.referralCode);
      } else {
        setReferralCode('NAU21NHJ7K'); // fallback
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setReferralCode('NAU21NHJ7K'); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const copyCodeToClipboard = () => {
    try {
      const success = copyToClipboard(referralCode);
      if (success) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000); // reset after 2s
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
        title: 'Invite Friends to Salon App',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <Head title="Refer a Friend" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Head title="Refer a Friend" showBack={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('5%') }}
      >
        <View style={styles.content}>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>
            Share Salon Luxury
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Invite your friends to experience the finest hair, beauty, and spa
            services from our professional stylists. Let them enjoy the same
            premium care that you already love.
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
            <Text style={[styles.referralCodeLabel, { color: '#fff' }]}>
              Your Referral Code
            </Text>
            <Text
              style={[styles.referralCodeText, { color: '#fff' }]}
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
            style={[styles.signupButton, { backgroundColor: COLORS.primary }]}
            onPress={shareWithFriends}
          >
            <Text style={styles.shareButtonText}>Share with Friends</Text>
          </TouchableOpacity>

          <View style={styles.howItWorksSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              How It Works
            </Text>

            <View style={styles.stepContainer}>
              <Text style={[styles.stepNumber, { color: COLORS.primary }]}>
                1
              </Text>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Share Your Code
                </Text>
                <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                  Send your unique referral code to your friends directly
                  through the app or any messaging platform.
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <Text style={[styles.stepNumber, { color: COLORS.primary }]}>
                2
              </Text>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Friends Join
                </Text>
                <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                  When your friend signs up using your referral code, they'll
                  join our salon app community instantly.
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <Text style={[styles.stepNumber, { color: COLORS.primary }]}>
                3
              </Text>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Enjoy Together
                </Text>
                <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                  You both can now book appointments, browse services, and enjoy
                  an exceptional salon experience together.
                </Text>
              </View>
            </View>
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
  content: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('0%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: wp('30%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  copyButtonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: COLORS.primary,
  },
  signupButton: {
    paddingVertical: hp('1.3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('0%'),
    marginBottom: hp('0%'),
    width: '98%',
    alignSelf: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
    textAlign: 'center',
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
    alignItems: 'flex-start',
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
