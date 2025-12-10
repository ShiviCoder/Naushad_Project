import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  Platform,
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
    icon: (isActive) => (
      <Icon 
        name="home-outline" 
        size={24} 
        color={isActive ? '#FFFFFF' : COLORS.primary} 
      />
    ),
    label: 'Home',
  },
  BookingScreen: {
    icon: (isActive) => (
      <MySvgIcon
        width={24}
        height={24}
        fill={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Bookings',
  },
  BookAppointmentTab: {
    icon: (isActive) => (
      <Image
        source={require('../assets/plus.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
          resizeMode: 'contain',
        }}
      />
    ),
    label: 'Book',
  },
  BlankScreen: {
    icon: (isActive) => (
      <Image
        source={require('../assets/order.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
          resizeMode: 'contain',
        }}
      />
    ),
    label: 'Order History',
  },
  AccountScreen: {
    icon: (isActive) => (
      <Icon
        name="person-outline"
        size={24}
        color={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Account',
  },
};

const useExitAppBackHandler = (selectedTab, isNavigatorFocused) => {
  const [exitApp, setExitApp] = useState(false);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (!isNavigatorFocused || selectedTab !== 'HomeScreen') {
        return false;
      }

      if (!exitApp) {
        setExitApp(true);
        ToastAndroid.showWithGravity(
          'Press again to exit',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );

        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

        exitTimerRef.current = setTimeout(() => {
          setExitApp(false);
          exitTimerRef.current = null;
        }, 2000);

        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [exitApp, selectedTab, isNavigatorFocused]);

  return exitApp;
};

const BottomNavbar = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const tabs = Object.keys(TAB_META);
  const [isNavigatorFocused, setIsNavigatorFocused] = useState(true);
  
  // Initialize all animated values safely
  const animatedScales = useRef({});
  const labelOpacities = useRef({});
  const circleTranslateX = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  
  const [selectedTab, setSelectedTab] = useState('HomeScreen');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const exitApp = useExitAppBackHandler(selectedTab, isNavigatorFocused);

  // Initialize all animated values for tabs
  const initializeAnimations = useCallback(() => {
    tabs.forEach((tab) => {
      if (!animatedScales.current[tab]) {
        animatedScales.current[tab] = new Animated.Value(1);
      }
      if (!labelOpacities.current[tab]) {
        labelOpacities.current[tab] = new Animated.Value(0);
      }
    });
  }, [tabs]);

  // Initial setup
  useEffect(() => {
    initializeAnimations();
    
    // Set initial selected tab
    if (state?.index !== undefined && state.routeNames) {
      const initialTab = state.routeNames[state.index];
      if (tabs.includes(initialTab)) {
        setSelectedTab(initialTab);
        labelOpacities.current[initialTab]?.setValue(1);
        
        // Set initial circle position
        const index = tabs.indexOf(initialTab);
        if (index !== -1) {
          const initialX = getTabPosition(index);
          circleTranslateX.setValue(initialX);
        }
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Sync with navigation state
  useEffect(() => {
    if (state?.index !== undefined && state.routeNames && isInitialized) {
      const currentTab = state.routeNames[state.index];
      if (tabs.includes(currentTab) && selectedTab !== currentTab) {
        setSelectedTab(currentTab);
        animateToTab(currentTab);
      }
    }
  }, [state?.index]);

  // Keyboard listener
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', 
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', 
      () => setKeyboardVisible(false)
    );

    return () => {
      showSub?.remove();
      hideSub?.remove();
    };
  }, []);

  const getTabPosition = (index) => {
    const tabWidth = screenWidth / tabs.length;
    const circleWidth = 64;
    return index * tabWidth + tabWidth / 2 - circleWidth / 2;
  };

  const animateToTab = (tabName) => {
    if (isAnimating || !labelOpacities.current[tabName] || !animatedScales.current[tabName]) {
      return;
    }

    setIsAnimating(true);
    const index = tabs.indexOf(tabName);
    const target = getTabPosition(index);

    // Label animations - hide all, show current
    const labelAnimations = tabs.map((tab) => 
      Animated.timing(labelOpacities.current[tab], {
        toValue: tab === tabName ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      })
    );
    Animated.stagger(50, labelAnimations).start();

    // Icon scale animation for new tab
    Animated.sequence([
      Animated.timing(animatedScales.current[tabName], {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(animatedScales.current[tabName], {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Circle movement
    Animated.parallel([
      Animated.timing(circleTranslateX, {
        toValue: target,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(circleScale, {
          toValue: 1.1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const handleTabPress = (tabName) => {
    if (selectedTab !== tabName && !isAnimating) {
      setSelectedTab(tabName);
      animateToTab(tabName);
      
      const params = { from: 'bottomBar' };
      if (tabName === 'BookAppointmentTab') {
        params.showTab = true;
      }
      
      navigation.navigate(tabName, params);
    }
  };

  const renderCircleIcon = () => {
    const meta = TAB_META[selectedTab];
    if (!meta) return null;
    
    return meta.icon(true); // Pass true for active state (white color)
  };

  const renderTabIcon = (tabName) => {
    const meta = TAB_META[tabName];
    if (!meta) return null;
    
    const isActive = selectedTab === tabName;
    const scaleValue = animatedScales.current[tabName];
    const scaleAnim = scaleValue ? [{ scale: scaleValue }] : [];
    
    return (
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: isActive ? 0 : 1,
            transform: scaleAnim,
          },
        ]}
      >
        {meta.icon(false)} {/* Pass false for inactive state (primary color) */}
      </Animated.View>
    );
  };

  if (keyboardVisible) return null;

  return (
    <View style={styles.bottomNavContainer}>
      {/* Background that extends to bottom with safe area */}
      <View style={[
        styles.backgroundContainer, 
        { 
          paddingBottom: insets.bottom,
          height: (Platform.OS === 'ios' ? 85 : 70) + insets.bottom,
        }
      ]}>
        {/* Moving Active Circle */}
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
          {renderCircleIcon()}
        </Animated.View>

        {/* Tab Items */}
        <View style={[
          styles.tabsContainer,
          { 
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 20,
          }
        ]}>
          {tabs.map((tab) => {
            const meta = TAB_META[tab];
            const isActive = selectedTab === tab;
            const opacityValue = labelOpacities.current[tab];

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => handleTabPress(tab)}
                style={[styles.tabItem, { width: screenWidth / tabs.length }]}
                activeOpacity={0.8}
              >
                {renderTabIcon(tab)}

                {isActive && opacityValue && (
                  <Animated.Text
                    style={[
                      styles.tabLabel,
                      { opacity: opacityValue },
                    ]}
                  >
                    {meta.label}
                  </Animated.Text>
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
  backgroundContainer: {
    backgroundColor: '#fefbfbff', //COLORS.secondary
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'visible',
  },
  activeCircle: {
    position: 'absolute',
    top: -30,
    left: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFF8F0',
    zIndex: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
    minHeight: 48,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    height: 28,
  },
  tabLabel: {
    fontSize: wp('3%'),
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
    lineHeight: 13,
    marginTop: 4,
  },
});

export default BottomNavbar;
