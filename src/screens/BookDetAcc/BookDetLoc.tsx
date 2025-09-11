import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const BookDetLoc = () => {
    return (
        <View style={styles.outerContainer} >
            <Image  source={require('../../assets/BookDetAcc/loc.png')} />
            <Text style={styles.text}>123, Main Street,City</Text>
        </View>
    )
}

export default BookDetLoc

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 20,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 500
    }
   
})