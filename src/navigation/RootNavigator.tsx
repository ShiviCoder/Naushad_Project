import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";

import { NavigationContainer } from "@react-navigation/native";

import Signin from "../screens/SignAuth/Signin";
import HomeScreen from "../screens/home/HomeScreen";
import SignUp from "../screens/SignAuth/SignUp";
import VerificationScreen from "../screens/SignAuth/VerificationScreen";



export type RootStackParamList = {
  Splash: undefined;
  Enter: undefined;
  Login: undefined;
  Tabs: undefined;
  Signin:undefined;
  SignUp:undefined;
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
            <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
