import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const BookDetHead = () => {
  return (
     <View style={styles.heading}>
            <Image  style={styles.image} source={require('../../assets/BookDetAcc/Vector.png')} />
            <Text style={styles.text}>Booking Details</Text>
        </View>
  )
}

export default BookDetHead

const styles = StyleSheet.create({
    heading : {
    marginTop: 40,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'flex-start',
    gap: '25%',
    alignItems: 'center',
   
},
image: {
    width: 9,
    height: 16
}
,
text: {
    fontWeight: 700,
    fontSize: 20
}
})