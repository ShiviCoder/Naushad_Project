import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Animated } from 'react-native';
import BottomNavbar from './BottomNavbar';

const BottomNavbarWrapper = (props: any) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const bottomAnim = useRef(new Animated.Value(1)).current; // useRef is better for Animated.Value
  
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

  return (
    <Animated.View
      style={{
        opacity: bottomAnim,
        transform: [{ scale: bottomAnim }],
      }}>
      {!keyboardVisible && <BottomNavbar {...props} />}
    </Animated.View>
  );
};

export default BottomNavbarWrapper;
