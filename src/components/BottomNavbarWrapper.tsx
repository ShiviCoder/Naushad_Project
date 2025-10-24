import React, { useState, useEffect } from 'react';
import { Keyboard, Animated } from 'react-native';
import BottomNavbar from './BottomNavbar'; // existing BottomNavbar

const BottomNavbarWrapper = (props: any) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const bottomAnim = new Animated.Value(1); // for fade animation

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(bottomAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return <BottomNavbar {...props} />;
};

export default BottomNavbarWrapper;
