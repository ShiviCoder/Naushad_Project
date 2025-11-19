import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
  Keyboard,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../components/Svg';
import COLORS from '../utils/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('window');

const TAB_META = {
  HomeScreen: {
    icon: (isActive: boolean) => (
      <Icon name="home" size={wp('8%')} color={'#fff'} />
    ),
    label: 'Home',
  },
  BookingScreen: {
    icon: (isActive: boolean) => (
      <MySvgIcon
        width={wp('8%')}
        height={hp('3.3%')}
        fill={'#fff'}
      />
    ),
    label: 'Bookings',
  },
  BookAppointmentScreen: {
    icon: (isActive: boolean) =>
      isActive ? (
        // When active → icon only (inside floating circle)
        <Icon name="add" size={wp('8%')} color="#fff" />
      ) : (
        // When inactive → circle with primary bg and white icon
        <View
          style={{
            width: wp('12%'),
            height: wp('12%'),
            borderRadius: wp('6%'),
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="add" size={wp('8%')} color="#fff" />
        </View>
      ),
    label: 'Book',
  },
  BlankScreen: {
    icon: (isActive: boolean) => (
      <Image
        source={require('../assets/referral.png')}
        style={{
          width: wp('8%'),
          height: wp('8%'),
          tintColor: '#fff' ,
          resizeMode: 'contain',
        }}
      />
    ),
    label: 'Refer',
  },
  AccountScreen: {
    icon: (isActive: boolean) => (
      <Icon
        name="person-outline"
        size={wp('8%')}
        color={'#fff'}
      />
    ),
    label: 'Account',
  },
};

const useExitAppBackHandler = (selectedTab) => {
  const [exitApp, setExitApp] = useState(false);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (selectedTab !== 'HomeScreen') return false;
      if (!exitApp) {
        setExitApp(true);
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        exitTimerRef.current = setTimeout(() => setExitApp(false), 2000);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const handler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      handler.remove();
      clearTimeout(exitTimerRef.current);
    };
  }, [exitApp, selectedTab]);
};

const BottomNavbar = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const animatedScales = useRef({}).current;
  const tabs = Object.keys(TAB_META);
  const circleTranslateX = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const [selectedTab, setSelectedTab] = useState('HomeScreen');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useExitAppBackHandler(selectedTab);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  tabs.forEach(tab => {
    if (!animatedScales[tab]) animatedScales[tab] = new Animated.Value(1);
  });

  const getTabPosition = index => {
    const tabWidth = screenWidth / tabs.length;
    const circleWidth = 64;
    return index * tabWidth + tabWidth / 2 - circleWidth / 2;
  };

  const animateToTab = tabName => {
    const index = tabs.indexOf(tabName);
    const target = getTabPosition(index);

    Animated.parallel([
      Animated.timing(circleTranslateX, {
        toValue: target,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(circleScale, {
          toValue: 1.05,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleTabPress = (tabName) => {
    if (selectedTab === tabName) return;
    setSelectedTab(tabName);
    animateToTab(tabName);
    requestAnimationFrame(() => {
      navigation.navigate(tabName, { from: 'bottomBar' });
    });
  };

  if (keyboardVisible) return null;

  return (
    <View style={[styles.bottomNavContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {/* 🔹 Floating Active Circle */}
        <Animated.View
          style={[
            styles.activeCircle,
            {
              backgroundColor: COLORS.primary,
              transform: [
                { translateX: circleTranslateX },
                { scale: circleScale },
              ],
            },
          ]}
        >
          {TAB_META[selectedTab]?.icon(true)}
        </Animated.View>

        {/* 🔹 Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => {
            const meta = TAB_META[tab];
            const isActive = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={[styles.tabItem, { width: screenWidth / tabs.length }]}
                activeOpacity={0.8}
              >
                {/* Always render icon to preserve space */}
                <View style={{ opacity: isActive ? 0 : 1 }}>
                  {meta.icon(false)}
                </View>

                {/* Label only when active */}
                {isActive && (
                  <View style={{ position: 'absolute', top: selectedTab === 'BookAppointmentScreen' ? wp('7.5%') : wp('4%'), }}>
                    <Text style={styles.labelActive}>{meta.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    height: hp('9%'),
    backgroundColor: '#1A1A1A',
    borderTopColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  activeCircle: {
    position: 'absolute',
    top: -28,
    left: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#1A1A1A',
    zIndex: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: hp('3%'),
    paddingTop: hp('2%'),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelActive: {
    color: '#fff',
    fontSize: wp('3.2%'),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default BottomNavbar;
