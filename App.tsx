import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import BookAppoinment from "./src/components/BookAppoinment"
// import RootNavigator from './src/navigation/RootNavigator'
// import Frame from "./src/components/Frame"
// import RootNavigator from './src/navigation/RootNavigator'
// import ServicesScreen from './src/screens/SignAuth/Services'
import Cart from './src/screens/SignAuth/Cart'
import ServicesScreen from './src/screens/SignAuth/Services'
import RootNavigator from './src/navigation/RootNavigator'
import Booking from './src/screens/SignAuth/BookingDetails'
import BookingDetail from './src/screens/SignAuth/BookingDetail'
import { ThemeProvider } from "./src/context/ThemeContext";

// import Services from './src/screens/SignAuth/Services'
const App = () => {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
      
  )
}

export default App

const styles = StyleSheet.create({})