import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import all your screens
import SplashScreen from '../screens/SplashScreen';
import Signin from '../screens/SignAuth/Signin';
import HomeScreen from '../screens/home/HomeScreen';
import SignUp from '../screens/SignAuth/SignUp';
import VerificationScreen from '../screens/SignAuth/VerificationScreen';
import CodeVerification from '../screens/SignAuth/CodeVerification';
import Services from '../screens/SignAuth/Services';
import OurProducts from '../screens/OurProducts/OurProducts';
import ProductDetails from '../screens/ProductDetails/ProductDetails';
import OurPackages from '../screens/SignAuth/OurPackages';
import PackageDetails from '../screens/SignAuth/PackageDetails';
import ServiceDetails from '../screens/SignAuth/ServiceDetails';
import AccountScreen from '../screens/SignAuth/AccountScreen';
import PackagesScreen from '../screens/SignAuth/PackagesScreen';
import ProductPackageScreen from '../screens/SignAuth/ProductPackageScreen';
import BookAppointmentScreen from '../screens/SignAuth/BookAppointmentScreen';
import MyProfile from '../screens/SignAuth/MyProfile';
import Notification from '../screens/home/Notification';
import Cart from '../screens/home/Cart';
import BookingScreen from '../screens/SignAuth/BookingScreen';
import BlankScreen from '../screens/SignAuth/BlankScreen';
import BookingAccepted from '../screens/SignAuth/BookingAccepted';
import BookingPending from '../screens/SignAuth/BookingPending';
import PreviousBooking from '../screens/SignAuth/PreviousBooking';
import BookAppoinment2 from '../screens/SignAuth/BookAppoinment2';
import ProductPakage from '../screens/SignAuth/ProductPakage';
import Catelog from '../screens/SignAuth/Catelog';
import ReferFriend from '../screens/SignAuth/ReferFriend';
import AboutUs from '../screens/SignAuth/AboutUs';
import PrivacyPolicy from '../screens/SignAuth/PrivacyPolicy';
import TermsAndConditions from '../screens/SignAuth/TermsAndConditions';
import AppVersion from '../screens/SignAuth/AppVersion';
import OfferScreen from '../screens/SignAuth/OfferScreen';
import Certificates from '../screens/SignAuth/Certificates';
import HomeServices from '../screens/SignAuth/HomeServices';
import ForgotPassword from '../screens/SignAuth/ForgetPassword';
import PaymentScreen from '../screens/PaymentScreen/PaymentScreen';
import PaymentSuccessScreen from '../screens/PaymentScreen/PaymentSuccessScreen';
import VideosScreen from '../screens/SignAuth/VideosScreen';
import WalletScreen from '../screens/SignAuth/WalletScreen';
import LikedProductScreen from '../screens/SignAuth/LikedProductScreen';
import SettingScreen from '../screens/SignAuth/SettingScreen';
import BookingSeats from '../screens/SignAuth/BookingSeats';

// Import the tab version
import BookAppointmentTabScreen from '../components/BookAppointmentTabScreen';
import BottomNavbarWrapper from '../components/BottomNavbarWrapper';
import CartPaymentScreen from '../screens/PaymentScreen/CartPaymentScreen';

export type RootStackParamList = {
  Splash: undefined;
  Signin: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  VerificationScreen: undefined;
  CodeVerification: undefined;
  Services: undefined;
  OurProducts: undefined;
  ProductDetails: undefined;
  OurPackages: undefined;
  PackageDetails: undefined;
  ServiceDetails: undefined;
  AccountScreen: undefined;
  PackagesScreen: undefined;
  ProductPackageScreen: undefined;
  BookAppointmentTab: {
    image?: any;
    showTab?: boolean;
    from?: any;
    serviceName?: string;
    price?: string;
  };
  BookAppointmentScreen: {
    image?: any;
    showTab?: boolean;
    from?: any;
    serviceName?: string;
    price?: string;
  };
  MyProfile: undefined;
  Notification: undefined;
  Cart: undefined;
  BookingScreen: undefined;
  BlankScreen: undefined;
  BookingAccepted: undefined;
  BookingPending: undefined;
  PreviousBooking: undefined;
  BookAppoinment2: undefined;
  ProductPakage: undefined;
  Catelog: undefined;
  ReferFriend: undefined;
  AboutUs: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  AppVersion: undefined;
  OfferScreen: undefined;
  Certificates: undefined;
  HomeServices: undefined;
  ForgetPassword: undefined;
  VidoesScreen: undefined;
  CloneBookAppointment: undefined;
  WalletScreen: undefined;
  LikedProductScreen: undefined;
  SettingScreen: undefined;
  BookingSeats: undefined;
  BookingSeats1: undefined;
  PaymentScreen: undefined;
  PaymentSuccessScreen: undefined;
  VideosScreen: undefined;
  CartPaymentScreen : undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomNavbarWrapper {...props} />}
      initialRouteName="HomeScreen"
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="BookingScreen" component={BookingScreen} />
      <Tab.Screen name="BlankScreen" component={BlankScreen} />
      <Tab.Screen name="BookAppointmentTab" component={BookAppointmentTabScreen} />
      <Tab.Screen name="AccountScreen" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="CodeVerification" component={CodeVerification} />
        <Stack.Screen name="Services" component={Services} />
        <Stack.Screen name="OurProducts" component={OurProducts} />
        <Stack.Screen name="OfferScreen" component={OfferScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="OurPackages" component={OurPackages} />
        <Stack.Screen name="PackageDetails" component={PackageDetails} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="PackagesScreen" component={PackagesScreen} />
        <Stack.Screen name="ProductPackageScreen" component={ProductPackageScreen} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="BookingAccepted" component={BookingAccepted} />
        <Stack.Screen name="BookingPending" component={BookingPending} />
        <Stack.Screen name="PreviousBooking" component={PreviousBooking} />
        <Stack.Screen name="BookAppoinment2" component={BookAppoinment2} />
        <Stack.Screen name="ProductPakage" component={ProductPakage} />
        <Stack.Screen name="Catelog" component={Catelog} />
        <Stack.Screen name="ReferFriend" component={ReferFriend} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="AppVersion" component={AppVersion} />
        <Stack.Screen name="Certificates" component={Certificates} />
        <Stack.Screen name="HomeServices" component={HomeServices} />
        <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
        <Stack.Screen name="VideosScreen" component={VideosScreen} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="LikedProductScreen" component={LikedProductScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="BookingSeats" component={BookingSeats} />
<Stack.Screen name='CartPaymentScreen' component={CartPaymentScreen}/>

        {/* Standalone BookAppointmentScreen without bottom tabs */}
        <Stack.Screen name="BookAppointmentScreen" component={BookAppointmentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}