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
import MyProfile from '../screens/SignAuth/MyProfile';
import Notification from '../screens/home/Notification';
import Cart from '../screens/home/Cart'
import BookingScreen from '../screens/SignAuth/BookingScreen';
import BlankScreen from '../screens/SignAuth/BlankScreen';
import BookingAccepted from '../screens/SignAuth/BookingAccepted';
import BookingPending from '../screens/SignAuth/BookingPending';
import PreviousBooking from '../screens/SignAuth/PreviousBooking';
import BookAppoinment2 from '../screens/SignAuth/BookAppoinment2';
import ProductPakage from '../screens/SignAuth/ProductPakage'

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
  MyProfile : undefined;
  Notification : undefined;
  Cart : undefined;
  BookingScreen : undefined;
  BlankScreen : undefined;
  BookingAccepted : undefined;
  BookingPending : undefined;
  PreviousBooking : undefined;
  BookAppoinment2 : undefined;
  ProductPakage : undefined
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
        <Stack.Screen name='MyProfile' component={MyProfile} />
        <Stack.Screen name='Notification' component={Notification} />
                <Stack.Screen name='Cart' component={Cart} />
                <Stack.Screen name='BookingScreen' component={BookingScreen} />
                 <Stack.Screen name='BlankScreen' component={BlankScreen} />
                   <Stack.Screen name='BookingAccepted' component={BookingAccepted} />
                     <Stack.Screen name='BookingPending' component={BookingPending} />
                       <Stack.Screen name='PreviousBooking' component={PreviousBooking} />
                                    <Stack.Screen name='BookAppoinment2' component={BookAppoinment2} />
                                    <Stack.Screen name='ProductPakage' component={ProductPakage} />

        
        {/* <Stack.Screen name="BookDetAcc" component={BookDetAcc}/> */}
      </Stack.Navigator>
      <Stack.Screen name='Head' component={Head} />
    </NavigationContainer>
  );
}
