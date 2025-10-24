<<<<<<< HEAD
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
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
=======
import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../utils/Colors";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
};

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
<<<<<<< HEAD
      navigation.replace('Signin');
=======
      navigation.replace("Signin");
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
<<<<<<< HEAD
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.primary }]}
    >
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
=======
    <SafeAreaView style={[styles.container,{backgroundColor : COLORS.primary}]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
       
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======
    justifyContent: "center",
    alignItems: "center",
   
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  },
  logo: {
    width: wp('60%'),
    height: hp('20%'),
  },
});
