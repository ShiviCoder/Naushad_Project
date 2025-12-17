import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingData from '../../components/EditProfileData';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';

const AccountScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false); // activity indicator
  const [isInitialLoad, setIsInitialLoad] = useState(true); // to avoid flicker on refocus

  // ✅ Fetch stored user data
  const fetchUserFromAPI = useCallback(async () => {
    try {
      // only show loader on first load, not every focus
      if (isInitialLoad) {
        setIsLoading(true);
      }

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log('❌ No token found');
        setUser(null);
        return;
      }

      console.log('🔄 Refreshing user profile...');
      const response = await fetch(
        'https://naushad.onrender.com/api/auth/profile',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const json = await response.json();
      console.log('📡 API User Response:', json);

      const userData = json.data || json.user || json;
      setUser(userData || null);

      if (userData) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      } else {
        console.log('⚠ No user data received from API');
      }
    } catch (error) {
      console.log('❌ API Fetch Error:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // ✅ Initial load only once
  useEffect(() => {
    fetchUserFromAPI();
  }, [fetchUserFromAPI]);

  // ✅ Refresh on focus WITHOUT extra loader (no flicker)
  useFocusEffect(
    useCallback(() => {
      // on focus, refresh silently (no spinner because isInitialLoad is already false)
      fetchUserFromAPI();
    }, [fetchUserFromAPI]),
  );

  const handleLogoutConfirm = async () => {
    setShowLogout(false);

    // ✅ Clear both token and user data completely
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    } catch (e) {
      console.log('Error clearing storage on logout', e);
    }

    // ✅ Reset local user state as well
    setUser(null);

    // ✅ Go to Signin stack
    navigation.replace('Signin');
  };

  // ✅ Show full-screen loader only on very first load
  if (isLoading && isInitialLoad) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background || '#fff',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <Head title="Account" showBack={false} />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.con}>
          <View style={styles.imgSection}>
            <Image
              style={styles.userImg}
              source={
                user?.avatar && user?.avatar !== '' && user?.avatar !== 'null'
                  ? { uri: user.avatar }
                  : user?.image && user?.image !== '' && user?.image !== 'null'
                  ? { uri: user.image }
                  : require('../../assets/user.png')
              }
            />
          </View>

          <View style={styles.profileText}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>
              {user
                ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                  'User Name'
                : 'User Name'}
            </Text>
            <Text style={[styles.email, { color: theme.textPrimary }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: COLORS.primary }]} />

      {/* Settings List */}
      <ScrollView>
        <FlatList
          data={settingData}
          scrollEnabled={false}
          style={styles.detailsContainer}
          contentContainerStyle={{
            margin: wp('2%'),
            paddingBottom: hp('6%'),
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.detailsCon}
              onPress={() => {
                if (item.title === 'Edit Profile') {
                  navigation.getParent()?.navigate('MyProfile');
                } else if (item.title === 'Cart') {
                  navigation.navigate('Cart');
                } else if (item.title === 'Catalog') {
                  navigation.navigate('Catelog');
                } else if (item.title === 'Refer a friend') {
                  navigation.navigate('ReferFriend');
                } else if (item.title === 'Wallet') {
                  navigation.navigate('WalletScreen');
                } else if (item.title === 'Settings') {
                  navigation.navigate('SettingScreen');
                } else if (item.title === 'About us') {
                  navigation.navigate('AboutUs');
                } else if (item.title === 'Privacy Policy') {
                  navigation.navigate('PrivacyPolicy');
                } else if (item.title === 'Terms & Conditions') {
                  navigation.navigate('TermsAndConditions');
                } else if (item.title === 'Logout') {
                  setShowLogout(true);
                }
              }}
            >
              <Image
                style={[styles.leftIcon, { tintColor: COLORS.primary }]}
                source={item.image}
              />
              <View style={styles.textCon}>
                <Text style={[styles.text, { color: theme.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.subText, { color: theme.textPrimary }]}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <Text
              style={{
                textAlign: 'center',
                color: theme.textPrimary,
                marginTop: hp('0.2%'),
              }}
            >
              App Version: v1.0.0
            </Text>
          }
        />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Confirm Logout</Text>
            <Text style={styles.popupMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.popupActions}>
              <TouchableOpacity
                onPress={() => setShowLogout(false)}
                style={[styles.popupBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupBtn, styles.logoutBtn]}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp('3%'),
  },
  profileSection: {
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  con: {
    marginVertical: hp('2%'),
    flexDirection: 'row',
    gap: wp('4%'),
    alignItems: 'center',
  },
  imgSection: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7%'),
    overflow: 'hidden',
  },
  userImg: {
    width: '100%',
    height: '100%',
  },
  profileText: {
    flexDirection: 'column',
  },
  name: {
    fontSize: wp('4.5%'),
    fontWeight: '500',
  },
  email: {
    fontSize: wp('3.3%'),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  separator: {
    height: 1,
    marginVertical: hp('1%'),
  },
  detailsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
  },
  leftIcon: {
    width: wp('5.7%'),
    height: wp('5.7%'),
    resizeMode: 'contain',
    marginTop: hp('1.2%'),
  },
  detailsCon: {
    flexDirection: 'row',
    gap: wp('5%'),
    marginBottom: hp('2%'),
    alignItems: 'flex-start',
  },
  text: {
    fontSize: wp('4.5%'),
    fontWeight: '500',
  },
  subText: {
    fontSize: wp('3.3%'),
    fontWeight: '400',
  },
  textCon: {
    flexDirection: 'column',
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: COLORS.primary,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AccountScreen;
