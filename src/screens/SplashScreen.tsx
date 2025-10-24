import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../utils/Colors';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};


export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const timer = setTimeout(() => {
          if (userData) {
            // If user data found, navigate directly to MainTabs (Home)
            navigation.replace('MainTabs');
          } else {
            // Else go to Signin
            navigation.replace('Signin');
          }
        }, 3000);
        return () => clearTimeout(timer);
      } catch (error) {
        // In case of error, navigate to Signin after delay
        const timer = setTimeout(() => {
          navigation.replace('Signin');
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    checkLoginStatus();
  }, [navigation]);


  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.primary }]}
    >
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp('60%'),
    height: hp('20%'),
  },
});
