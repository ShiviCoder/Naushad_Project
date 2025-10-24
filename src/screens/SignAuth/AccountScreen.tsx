import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import settingData from '../../components/EditProfileData';
import RadioButton from '../../components/RadioButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Head from '../../components/Head';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountScreen = () => {
  const [theme, setTheme] = useState('Light'); // track selected theme
  const navigation = useNavigation<any>();
  const [showLogout, setShowLogout] = useState(false);
  const backgroundColor = theme === 'Dark' ? '#121212' : '#fff';
  const textColor = theme === 'Dark' ? '#fff' : '#333';
  const subTextColor = theme === 'Dark' ? '#bbb' : '#757575BA';
  const textPrimary = theme === 'Dark' ? '#fff' : '#000';

  const handleLogoutConfirm = () => {
    setShowLogout(false);
    console.log('User logged out');
    navigation.navigate('Signin');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Head
        title="Account"
        showBack={false}
        rightComponent={
          <RadioButton
            type="toggle"
            selected={theme}
            labels={[
              <Image
                source={require('../../assets/sun.png')}
                style={styles.themeIcon}
              />,
              <Image
                source={require('../../assets/moon.png')}
                style={styles.themeIcon}
              />,
            ]}
            onSelect={isDark => {
              const value = isDark ? 'Dark' : 'Light';
              setTheme(value);
            }}
          />
        }
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.con}>
          <View style={styles.imgSection}>
            <Image
              source={require('../../assets/images/user-img.png')}
              style={styles.userImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.name, { color: textColor }]}>
              Aanchal Jain
            </Text>
            <Text style={[styles.email, { color: subTextColor }]}>
              aachalsethi38881@gmail.com
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Settings List */}
      <FlatList
        data={settingData}
        style={styles.detailsContainer}
        contentContainerStyle={{
          margin: wp('2%'),
          paddingBottom: hp('12%'),
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <>
              {/* Left Icon */}
              <TouchableOpacity
                style={styles.detailsCon}
                onPress={() => {
                  if (item.title === 'Edit Profile') {
                    navigation.push('MyProfile');
                  } else if (item.title === 'Cart') {
                    navigation.navigate('Cart');
                  } else if (item.title === 'Catalog') {
                    navigation.navigate('Catelog');
                  } else if (item.title === 'Refer a friend') {
                    navigation.navigate('ReferFriend');
                  } else if (item.title === 'About us') {
                    navigation.navigate('AboutUs');
                  } else if (item.title === 'Privacy Policy') {
                    navigation.navigate('PrivacyPolicy');
                  } else if (item.title === 'Terms & Conditions') {
                    navigation.navigate('TermsAndConditions');
                  } else if (item.title === 'App Version: v1.0.0') {
                    navigation.navigate('AppVersion');
                  } else if (item.title === 'Logout') {
                    setShowLogout(true);
                  }
                }}
              >
                {/* Left Icon */}
                <Image style={styles.leftIcon} source={item.image} />

                {/* Right Content */}
                <View style={styles.textCon}>
                  <Text style={[styles.text, { color: textColor }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.subText, { color: subTextColor }]}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          );
        }}
      />

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
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    justifyContent: 'center',
  },
  headText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
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
    width: wp('14%'),
    height: wp('14%'),
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
  edit: {
    width: wp('6%'),
    height: wp('6%'),
    marginBottom: hp('2%'),
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
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
  themeIcon: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
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
    backgroundColor: 'red',
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
