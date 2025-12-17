// BottomNavbar.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../components/Svg';
import COLORS from '../utils/Colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper function to check if device is a tablet
const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  const isTabletBySize = Math.min(width, height) > 600;
  const isTabletByRatio = aspectRatio < 1.6 && Math.max(width, height) > 900;
  return isTabletBySize || isTabletByRatio;
};

// Custom hook for orientation changes using Dimensions
const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const isPortrait = window.height > window.width;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
};

// Dynamic responsive values function
const getResponsiveValues = (screenHeight, screenWidth) => {
  const tablet = isTablet();
  const isPortrait = screenHeight > screenWidth;

  // Base scaling factors
  const baseScale = tablet ? 0.85 : 1;
  const widthScale = Math.min(screenWidth / 375, 1.5); // Max 1.5x scaling
  const heightScale = Math.min(screenHeight / 667, 1.5); // Max 1.5x scaling
  const scale = Math.min(widthScale, heightScale) * baseScale;

  // For tablets, use different approach
  if (tablet) {
    const isLargeTablet = screenWidth > 900;

    return {
      iconSize: isLargeTablet ? screenWidth * 0.032 : screenWidth * 0.035,
      circleSize: isLargeTablet ? screenWidth * 0.12 : screenWidth * 0.14,
      labelFontSize: isLargeTablet ? screenWidth * 0.022 : screenWidth * 0.024,
      navbarHeight: isPortrait
        ? isLargeTablet
          ? screenHeight * 0.08
          : screenHeight * 0.085
        : isLargeTablet
        ? screenHeight * 0.1
        : screenHeight * 0.11,
      circleTop: -(screenWidth * (isLargeTablet ? 0.055 : 0.06)),
      iconMarginBottom: screenHeight * 0.003,
      tabPaddingVertical: screenHeight * 0.015,
      activeCircleBorderWidth: 1,
      baseScale: scale,
    };
  }

  // For phones
  const isSmallPhone = screenHeight < 700;
  const isLargePhone = screenHeight > 800;

  return {
    iconSize: Platform.select({
      ios: isSmallPhone ? screenWidth * 0.05 : screenWidth * 0.045,
      android: isSmallPhone ? screenWidth * 0.052 : screenWidth * 0.048,
      default: screenWidth * 0.048,
    }),
    circleSize: Platform.select({
      ios: isSmallPhone ? screenWidth * 0.14 : screenWidth * 0.15,
      android: isSmallPhone ? screenWidth * 0.145 : screenWidth * 0.155,
      default: screenWidth * 0.15,
    }),
    labelFontSize: Platform.select({
      ios: isSmallPhone ? screenWidth * 0.026 : screenWidth * 0.028,
      android: isSmallPhone ? screenWidth * 0.025 : screenWidth * 0.027,
      default: screenWidth * 0.027,
    }),
    navbarHeight: Platform.select({
      ios: isSmallPhone ? screenHeight * 0.08 : screenHeight * 0.085,
      android: isSmallPhone ? screenHeight * 0.085 : screenHeight * 0.09,
      default: screenHeight * 0.085,
    }),
    circleTop: Platform.select({
      ios: isSmallPhone ? -(screenWidth * 0.065) : -(screenWidth * 0.07),
      android: isSmallPhone ? -(screenWidth * 0.07) : -(screenWidth * 0.075),
      default: -(screenWidth * 0.072),
    }),
    iconMarginBottom: Platform.select({
      ios: isSmallPhone ? screenHeight * 0.003 : screenHeight * 0.004,
      android: isSmallPhone ? screenHeight * 0.0025 : screenHeight * 0.0035,
      default: screenHeight * 0.003,
    }),
    tabPaddingVertical: screenHeight * 0.01,
    activeCircleBorderWidth: 0.8,
    baseScale: scale,
  };
};

/* --------------------------------------------- */
/* TAB META */
/* --------------------------------------------- */
const TAB_META = {
  HomeScreen: {
    icon: (isActive, size) => (
      <Icon
        name="home-outline"
        size={size}
        color={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Home',
  },
  BookingScreen: {
    icon: (isActive, size) => (
      <MySvgIcon
        width={size}
        height={size}
        fill={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Bookings',
  },
  BookAppointmentTab: {
    icon: (isActive, size) => (
      <Image
        source={require('../assets/plus.png')}
        style={{
          width: size,
          height: size,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
          resizeMode: 'contain',
        }}
      />
    ),
    label: 'Book',
  },
  BlankScreen: {
    icon: (isActive, size) => (
      <Image
        source={require('../assets/order.png')}
        style={{
          width: size,
          height: size,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
          resizeMode: 'contain',
        }}
      />
    ),
    label: 'Order History',
  },
  AccountScreen: {
    icon: (isActive, size) => (
      <Icon
        name="person-outline"
        size={size}
        color={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Account',
  },
};

/* --------------------------------------------- */
/* EXIT HANDLER */
/* --------------------------------------------- */
const useExitAppBackHandler = (selectedTab, isNavigatorFocused) => {
  const [exitApp, setExitApp] = useState(false);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (!isNavigatorFocused || selectedTab !== 'HomeScreen') return false;

      if (!exitApp) {
        setExitApp(true);
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);

        exitTimerRef.current = setTimeout(() => {
          setExitApp(false);
        }, 2000);

        return true;
      }

      BackHandler.exitApp();
      return true;
    };

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      handler.remove();
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [exitApp, selectedTab, isNavigatorFocused]);
};

/* --------------------------------------------- */
/* MAIN NAVBAR */
/* --------------------------------------------- */
const BottomNavbar = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const orientation = useOrientation();
  const tabs = Object.keys(TAB_META);
  const tabCount = tabs.length;

  // Dynamic screen dimensions
  const [dimensions, setDimensions] = useState({
    width: screenWidth,
    height: screenHeight,
  });
  const tabWidth = dimensions.width / tabCount;

  const animatedLabel = useRef({});
  const circleX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [selectedTab, setSelectedTab] = useState('HomeScreen');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [responsiveValues, setResponsiveValues] = useState(
    getResponsiveValues(screenHeight, screenWidth),
  );

  useExitAppBackHandler(selectedTab, true);

  // Handle dynamic dimensions changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
      setResponsiveValues(getResponsiveValues(window.height, window.width));
    });

    return () => subscription?.remove();
  }, []);

  /* INIT LABEL ANIM */
  const initAnimations = useCallback(() => {
    tabs.forEach(t => {
      animatedLabel.current[t] = new Animated.Value(0);
    });
  }, [tabs]);

  useEffect(() => {
    initAnimations();
    const initial = state.routeNames[state.index];

    setSelectedTab(initial);
    animatedLabel.current[initial]?.setValue(1);

    circleX.setValue(getPos(tabs.indexOf(initial), dimensions.width));
    setInitialized(true);
  }, []);

  /* SYNC NAVIGATION */
  useEffect(() => {
    if (!initialized) return;
    const current = state.routeNames[state.index];
    if (current !== selectedTab) {
      setSelectedTab(current);
      animateTo(current, dimensions.width);
    }
  }, [state.index, initialized]);

  /* KEYBOARD LISTENER */
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* --------------------------------------------- */
  /* POSITION CALC — Responsive */
  /* --------------------------------------------- */
  const getPos = (index, currentWidth) => {
    return (
      index * (currentWidth / tabCount) +
      currentWidth / tabCount / 2 -
      responsiveValues.circleSize / 2
    );
  };

  /* --------------------------------------------- */
  /* ANIMATIONS */
  /* --------------------------------------------- */
  const animateTo = (tab, currentWidth) => {
    if (isAnimating) return;

    setIsAnimating(true);

    const index = tabs.indexOf(tab);
    const targetX = getPos(index, currentWidth);

    const labelAnim = tabs.map(t =>
      Animated.timing(animatedLabel.current[t], {
        toValue: t === tab ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    );

    Animated.parallel([
      Animated.parallel(labelAnim),
      Animated.timing(circleX, {
        toValue: targetX,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 140,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => setIsAnimating(false));
  };

  const onPressTab = tab => {
    if (isAnimating || tab === selectedTab) return;
    setSelectedTab(tab);
    animateTo(tab, dimensions.width);
    navigation.navigate(tab);
  };

  if (keyboardVisible) return null;

  /* --------------------------------------------- */
  /* RENDER */
  /* --------------------------------------------- */
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.innerContainer,
          {
            paddingBottom: insets.bottom,
            height: Math.max(responsiveValues.navbarHeight, 60 + insets.bottom),
          },
        ]}
      >
        {/* ACTIVE FLOATING CIRCLE */}
        <Animated.View
          style={[
            styles.activeCircle,
            {
              transform: [{ translateX: circleX }, { scale }],
              width: responsiveValues.circleSize,
              height: responsiveValues.circleSize,
              borderRadius: responsiveValues.circleSize / 2,
              top: responsiveValues.circleTop,
              borderWidth: responsiveValues.activeCircleBorderWidth,
            },
          ]}
        >
          {TAB_META[selectedTab].icon(true, responsiveValues.iconSize)}
        </Animated.View>

        {/* TABS */}
        <View
          style={[
            styles.tabsRow,
            { paddingTop: responsiveValues.iconSize * 0.5 },
          ]}
        >
          {tabs.map(tab => {
            const isActive = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  {
                    width: tabWidth,
                    paddingVertical: responsiveValues.tabPaddingVertical,
                  },
                ]}
                onPress={() => onPressTab(tab)}
                activeOpacity={0.85}
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
              >
                {/* Inactive Icon */}
                {!isActive && (
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        marginBottom: responsiveValues.iconMarginBottom,
                      },
                    ]}
                  >
                    {TAB_META[tab].icon(false, responsiveValues.iconSize)}
                  </View>
                )}

                {/* Active Label */}
                <Animated.Text
                  style={[
                    styles.tabLabel,
                    {
                      opacity: animatedLabel.current[tab] || 0,
                      fontSize: responsiveValues.labelFontSize,
                      transform: [
                        {
                          translateY: animatedLabel.current[tab]
                            ? animatedLabel.current[tab].interpolate({
                                inputRange: [0, 1],
                                outputRange: [
                                  responsiveValues.iconMarginBottom * 2,
                                  0,
                                ],
                              })
                            : 0,
                        },
                      ],
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}
                >
                  {TAB_META[tab].label}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

/* --------------------------------------------- */
/* STYLES */
/* --------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FEFBFB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  innerContainer: {
    backgroundColor: '#FEFBFB',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    overflow: 'visible',
  },
  activeCircle: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderColor: '#FFFBEF',
    zIndex: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    height: '100%',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontWeight: Platform.select({
      ios: '600',
      android: '700',
      default: '600',
    }),
    color: COLORS.primary,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default BottomNavbar;
