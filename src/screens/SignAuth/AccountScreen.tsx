import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../../components/Svg';
import { StarSvgIcon } from '../../components/Svg';
import BottomNavbar from '../../components/BottomNavbar';

const AccountScreen = () => {
  const [theme, setTheme] = useState('Light'); // track selected theme
  const navigation = useNavigation<any>()
  const backgroundColor = theme === 'Dark' ? '#121212' : '#fff';
  const textColor = theme === 'Dark' ? '#fff' : '#333';
  const subTextColor = theme === 'Dark' ? '#bbb' : '#757575BA';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Head title="Account"></Head>
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
            <Text style={[styles.name, { color: textColor }]}>Anchal Jain</Text>
            <Text style={[styles.email, { color: subTextColor }]}>
              aachalsethi38881@gmail.com
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.push('MyProfile')}>
          <Image
            style={styles.edit}
            source={require('../../assets/edit.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

    <View style={styles.separator} />

      {/* Settings List */}
      <FlatList
        data={settingData}
        style={styles.detailsContainer}
        contentContainerStyle={{ margin: wp('2%'),    paddingBottom: hp('12%')  }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.detailsCon}>
              {/* Left Icon */}
              <Image style={styles.leftIcon} source={item.image} />

              {/* Right Content */}
              <View style={styles.textCon}>
                {item.title === 'Theme' ? (
                  <>
                    <Text style={[styles.text, { color: textColor }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.subText, { color: subTextColor }]}>
                      {item.description}
                    </Text>

                    {/* ✅ Custom RadioButton for Theme */}
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
                  </>
                ) : (
                  <>
                   <TouchableOpacity>
                     <Text style={[styles.text, { color: textColor }]}>
                      {item.title}
                    </Text>
                   </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={[styles.subText, { color: subTextColor }]}>
                      {item.description}
                    </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
        </View>
          );
        }}
      />

     <BottomNavbar/>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp('1.5%'),
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    gap: wp('30%'),
  },
  headText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
  },
  headIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
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
    fontFamily: 'Poppins-Medium',
  },
  email: {
    fontSize: wp('3%'),
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
    paddingVertical : hp('3%')
  },
  leftIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  detailsCon: {
    flexDirection: 'row',
    gap: wp('5%'),
    marginBottom: hp('2%'),
    alignItems: 'flex-start',
  },
  text: {
    fontSize: wp('5%'),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  subText: {
    fontSize: wp('3%'),
    fontWeight: '400',
    fontFamily: 'Poppins-Medium',
  },
  textCon: {
    flexDirection: 'column',
    flex: 1,
  },
  themeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
 
});

export default AccountScreen;
