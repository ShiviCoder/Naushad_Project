<<<<<<< HEAD
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LikedProductsProvider } from './src/context/LikedProductsContext';
import { requestAppPermissions } from './src/utils/Permission';
import { CartProvider } from './src/context/CartContext';

// import Services from './src/screens/SignAuth/Services'
const App = () => {
  useEffect(() => {
    requestAppPermissions();
=======
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {LikedProductsProvider} from './src/context/LikedProductsContext';
import { requestAppPermissions } from './src/utils/Permission';
import { CartProvider } from './src/context/CartContext';

  

// import Services from './src/screens/SignAuth/Services'
const App = () => {
  useEffect(() => {
    requestAppPermissions(); 
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LikedProductsProvider>
<<<<<<< HEAD
          <CartProvider>
=======
          <CartProvider> 
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
            <RootNavigator />
          </CartProvider>
        </LikedProductsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
<<<<<<< HEAD
  );
};

export default App;
const styles = StyleSheet.create({});
=======
  )
}

export default App
const styles = StyleSheet.create({})
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
