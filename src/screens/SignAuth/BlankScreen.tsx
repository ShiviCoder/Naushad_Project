import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Head from '../../components/Head'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../../components/BottomNavbar';


export default function BlankScreen() {
   const navigation = useNavigation();
    const { theme } = useTheme();
  return (
    <View style={[styles.mainContainer,{backgroundColor : theme.background}]}>
        <View style={styles.headContainer}>
             
              <Text style={[styles.headText, { color: theme.textPrimary}]}>Blank Screen</Text>
            </View>
      
      
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer : {
      flex : 1,
  },
   headContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp("5%"),
      paddingVertical: hp("2%"),
      justifyContent: "center",
      
    },
    headText: {
      fontSize: wp("5%"),
      fontWeight: 'bold',
    },
})