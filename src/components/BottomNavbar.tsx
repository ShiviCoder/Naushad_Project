// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { MySvgIcon } from '../components/Svg';
// import { StarSvgIcon } from '../components/Svg';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import COLORS from '../utils/Colors';

// const BottomNavbar = (props: any) => {
//   const { state, navigation } = props;
//   const handlePress = (tab: any) => {
//     if (tab.name === 'BookAppointmentScreen') {
//       navigation.navigate('BookAppointmentScreen', { from: 'bottomBar' });
//     } else {
//       navigation.navigate(tab.name);
//     }
//   };
//   // Fixed order of tabs
//   const tabs = [
//     { name: 'HomeScreen', icon: <Icon name="home" /> },
//     { name: 'BookingScreen', icon: <MySvgIcon /> },
//     {
//       name: 'BookAppointmentScreen', icon: (
//         <View style={[styles.fabCircle, { backgroundColor: COLORS.primary }]}>
//           <Icon name="add" size={wp('7%')} color="#000" />
//         </View>
//       )
//     },
//     {
//       name: 'BlankScreen',
//       icon: (
//         <Image
//           source={require('../assets/referall.png')}
//           style={{ width: wp('9%'), height: wp('9%'), resizeMode: 'contain' }}
//         />
//       ),
//     },
//     { name: 'AccountScreen', icon: <Icon name="person-outline" /> },
//   ];
//   return (
//     <View style={styles.bottomBarWrap}>
//       <View style={styles.bottomNav}>
//         {tabs.map((tab, index) => {
//           const isActive = state?.routes?.[state.index]?.name === tab.name;
//           let iconElement = tab.icon;
//           // Set dynamic color for icons except FAB
//           if (tab.name !== 'BookAppointmentScreen') {
//             if (tab.name === 'HomeScreen') {
//               iconElement = <Icon name="home" size={wp('7%')} color={isActive ? COLORS.primary : '#fff'} />;
//             } else if (tab.name === 'BookingScreen') {
//               iconElement = <MySvgIcon width={wp('7%')} height={hp('3%')} fill={isActive ? COLORS.primary : '#fff'} />;
//             } else if (tab.name === 'BlankScreen') {
//               iconElement = (
//                 <Image
//                   source={require('../assets/referral.png')}
//                   style={{
//                     width: wp('9%'),
//                     height: wp('9%'),
//                     tintColor: isActive ? COLORS.primary : '#fff', // optional tint
//                     resizeMode: 'contain',
//                   }}
//                 />
//               );
//             } else if (tab.name === 'AccountScreen') {
//               iconElement = <Icon name="person-outline" size={wp('7%')} color={isActive ? COLORS.primary : '#fff'} />;
//             }
//           }  

//           return (
//             <TouchableOpacity key={tab.name} onPress={() => handlePress(tab)}>
//               <View style={[styles.iconWrapper, isActive && tab.name !== 'BookAppointmentScreen' ? styles.activeWrapper : {}]}>
//                 {iconElement}
//               </View>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bottomBarWrap: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: hp('4%'), // Increased from 16
//     alignItems: 'center',
//   },
//   bottomNav: {
//     backgroundColor: '#1A1A1A', // Darker
//     width: '90%', // Reduced from 92%
//     height: hp('8%'), // Increased from 54
//     borderRadius: wp('205'), // Increased from 28
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   fabCircle: {
//     width: wp('13%'),
//     height: wp('13%'),
//     borderRadius: wp('50%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 0,
//   },
//   iconWrapper: {
//     width: wp('11%'),
//     height: wp('11%'),
//     borderRadius: wp('50%'),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   activeWrapper: {
//     backgroundColor: '#fff',
//     borderRadius: '50%'
//   },
// })


// export default BottomNavbar;


import React, { useRef, useState, useEffect } from 'react';
import {
  View,
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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('window');

const TAB_META = {
  HomeScreen: {
    icon: (isActive: boolean) => (
      <Icon name="home" size={wp('8%')} color={isActive ? '#fff' : COLORS.primary} />
    ),
    label: 'Home',
  },
  BookingScreen: {
    icon: (isActive: boolean) => (
      <MySvgIcon
        width={wp('8%')}
        height={hp('3.3%')}
        fill={isActive ? '#fff' : COLORS.primary}
      />
    ),
    label: 'Bookings',
  },
  BookAppointmentScreen: {
    icon: () => (
      <View
        style={[
          styles.fabCircle,
          { backgroundColor: COLORS.primary },
        ]}>
        <Icon name="add" size={wp('9%')} color="#000" />
      </View>
    ),
    label: 'Book',
  },
  BlankScreen: {
    icon: (isActive: boolean) => (
      <Image
        source={require('../assets/referral.png')}
        style={{
          width: wp('9%'),
          height: wp('9%'),
          tintColor: isActive ? '#fff' : COLORS.primary,
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
        color={isActive ? '#fff' : COLORS.primary}
      />
    ),
    label: 'Account',
  },
};

const useExitAppBackHandler = selectedTab => {
  const [exitApp, setExitApp] = useState(false);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (selectedTab !== 'HomeScreen') return false;
      if (!exitApp) {
        setExitApp(true);
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        exitTimerRef.current = setTimeout(() => setExitApp(false), 200);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
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
        duration: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(circleScale, {
          toValue: 1.05,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleTabPress = (tabName) => {
  if (selectedTab === tabName) return;

  setSelectedTab(tabName); // 🔹 Immediate state update (icon changes instantly)
  
  // 🔹 Start animation at the same time
  animateToTab(tabName);

  // 🔹 Trigger navigation after a short delay — to avoid layout jank
  requestAnimationFrame(() => {
    navigation.navigate(tabName, { from: 'bottomBar' });
  });
};
  if (keyboardVisible) return null;

  return (
    <View style={[styles.bottomNavContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {/* 🔹 Animated Circle for Active Tab */}
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

        {/* 🔹 All Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => {
            const meta = TAB_META[tab];
            const isActive = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={[styles.tabItem, { width: screenWidth / tabs.length }]}
                activeOpacity={0.8}>
                {/* Render icons normally — circle will overlay active */}
                {meta.icon(isActive)}
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
    top: -25,
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
  fabCircle: {
    width: wp('13%'),
    height: wp('13%'),
    borderRadius: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('-1%')
  },
});
export default BottomNavbar;
