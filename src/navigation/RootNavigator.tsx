import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import Signin from '../screens/SignAuth/Signin';
import HomeScreen from '../screens/home/HomeScreen';
import SignUp from '../screens/SignAuth/SignUp';
import VerificationScreen from '../screens/SignAuth/VerificationScreen';
import CodeVerification from '../screens/SignAuth/CodeVerification';
import Services from '../screens/SignAuth/Services';
import OurProducts from '../screens/OurProducts/OurProducts';
import OfferScreen from '../screens/OfferScreen/OfferScreen';
import ProductDetails from '../screens/ProductDetails/ProductDetails';
import OurPackages from '../screens/SignAuth/OurPackages';
import PackageDetails from '../screens/SignAuth/PackageDetails';
import ServiceDetails from '../screens/SignAuth/ServiceDetails';
import AccountScreen from '../screens/SignAuth/AccountScreen';
import PackagesScreen from '../screens/SignAuth/PackagesScreen';
import ProductPackageScreen from '../screens/SignAuth/ProductPackageScreen';
import BookAppointmentScreen from '../screens/SignAuth/BookAppointmentScreen';
import Head from '../components/Head';

export type RootStackParamList = {
  Splash: undefined;
  Enter: undefined;
  Login: undefined;
  Tabs: undefined;
  Signin: undefined;
  SignUp: undefined;
  main: undefined;
  HomeScreen: undefined;
  VerificationScreen: undefined;
  CodeVerification: undefined;
  Services: undefined;
  OurProducts: undefined;
  OfferScreen: undefined;
  ProductDetails: undefined;
  OurPackages: undefined;
  PackageDetails: undefined;
  ServiceDetails: undefined;
  AccountScreen: undefined;
  PackagesScreen: undefined;
  ProductPackageScreen: undefined;
  BookAppointmentScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="main" component={HomeScreen} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen
          name="VerificationScreen"
          component={VerificationScreen}
        />
        <Stack.Screen name="CodeVerification" component={CodeVerification} />
        <Stack.Screen name="Services" component={Services} />
        <Stack.Screen name="OurProducts" component={OurProducts} />
        <Stack.Screen name="OfferScreen" component={OfferScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="OurPackages" component={OurPackages} />
        <Stack.Screen name="PackageDetails" component={PackageDetails} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="PackagesScreen" component={PackagesScreen} />
        <Stack.Screen
          name="ProductPackageScreen"
          component={ProductPackageScreen}
        />
        <Stack.Screen
          name="BookAppointmentScreen"
          component={BookAppointmentScreen}
        />
        {/* <Stack.Screen name="BookDetAcc" component={BookDetAcc}/> */}
      </Stack.Navigator>
      <Stack.Screen name='Head' component={Head} />
    </NavigationContainer>
  );
}
