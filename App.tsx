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
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LikedProductsProvider>
          <CartProvider> 
            <RootNavigator />
          </CartProvider>
        </LikedProductsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App
const styles = StyleSheet.create({})