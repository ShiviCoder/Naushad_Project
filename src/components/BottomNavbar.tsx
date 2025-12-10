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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { MySvgIcon } from '../components/Svg';
import COLORS from '../utils/Colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width: screenWidth } = Dimensions.get('window');

/* --------------------------------------------- */
/* TAB META */
/* --------------------------------------------- */
const TAB_META = {
  HomeScreen: {
    icon: isActive => (
      <Icon
        name="home-outline"
        size={24}
        color={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Home',
  },
  BookingScreen: {
    icon: isActive => (
      <MySvgIcon
        width={24}
        height={24}
        fill={isActive ? '#FFFFFF' : COLORS.primary}
      />
    ),
    label: 'Bookings',
  },
  BookAppointmentTab: {
    icon: isActive => (
      <Image
        source={require('../assets/plus.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
        }}
      />
    ),
    label: 'Book',
  },
  BlankScreen: {
    icon: isActive => (
      <Image
        source={require('../assets/order.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: isActive ? '#FFFFFF' : COLORS.primary,
        }}
      />
    ),
    label: 'Order History',
  },
  AccountScreen: {
    icon: isActive => (
      <Icon
        name="person-outline"
        size={24}
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
  const tabs = Object.keys(TAB_META);
  const tabCount = tabs.length;
  const tabWidth = screenWidth / tabCount;

  const animatedLabel = useRef({});
  const circleX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [selectedTab, setSelectedTab] = useState('HomeScreen');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useExitAppBackHandler(selectedTab, true);

  /* INIT LABEL ANIM */
  const initAnimations = useCallback(() => {
    tabs.forEach(t => {
      animatedLabel.current[t] = new Animated.Value(0);
    });
  }, []);

  useEffect(() => {
    initAnimations();
    const initial = state.routeNames[state.index];

    setSelectedTab(initial);
    animatedLabel.current[initial]?.setValue(1);

    circleX.setValue(getPos(tabs.indexOf(initial)));
    setInitialized(true);
  }, []);

  /* SYNC NAVIGATION */
  useEffect(() => {
    if (!initialized) return;
    const current = state.routeNames[state.index];
    if (current !== selectedTab) {
      setSelectedTab(current);
      animateTo(current);
    }
  }, [state.index]);

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
  /* POSITION CALC — FIXED (circle perfectly centered) */
  /* --------------------------------------------- */
  const getPos = index => index * tabWidth + tabWidth / 2 - 32; // 32 = half of circle width

  /* --------------------------------------------- */
  /* ANIMATIONS */
  /* --------------------------------------------- */
  const animateTo = tab => {
    if (isAnimating) return;

    setIsAnimating(true);

    const index = tabs.indexOf(tab);
    const targetX = getPos(index);

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
    animateTo(tab);
    navigation.navigate(tab);
  };

  if (keyboardVisible) return null;

  /* --------------------------------------------- */
  /* RENDER */
  /* --------------------------------------------- */
  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { paddingBottom: insets.bottom }]}>
        {/* ACTIVE FLOATING CIRCLE */}
        <Animated.View
          style={[
            styles.activeCircle,
            {
              transform: [{ translateX: circleX }, { scale }],
            },
          ]}
        >
          {TAB_META[selectedTab].icon(true)}
        </Animated.View>

        {/* TABS */}
        <View style={styles.tabsRow}>
          {tabs.map(tab => {
            const isActive = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, { width: tabWidth }]}
                onPress={() => onPressTab(tab)}
                activeOpacity={0.85}
              >
                {/* Inactive Icon */}
                {!isActive && (
                  <View style={styles.iconWrap}>
                    {TAB_META[tab].icon(false)}
                  </View>
                )}

                {/* Active Label */}
                <Animated.Text
                  style={[
                    styles.tabLabel,
                    {
                      opacity: animatedLabel.current[tab] || 0,
                      transform: [
                        {
                          translateY: animatedLabel.current[tab]
                            ? animatedLabel.current[tab].interpolate({
                                inputRange: [0, 1],
                                outputRange: [8, 0],
                              })
                            : 0,
                        },
                      ],
                    },
                  ]}
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
  container: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  innerContainer: {
    backgroundColor: '#FEFBFB',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    height: 82,
  },
  activeCircle: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFBEF',
    zIndex: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingTop: 18,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default BottomNavbar;
