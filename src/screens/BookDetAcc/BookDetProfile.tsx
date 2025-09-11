import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const BookDetProfile = () => {
    return (
        <View style={styles.outerContainer}>
            <Image source={require('../../assets/BookDetAcc/userImage.png')} />
            <View>
                <Text style={styles.name}>Rahul sharma</Text>
                <Text style={styles.mobile}>+91 9876543210</Text>
            </View>
        </View>
    )
}

export default BookDetProfile

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 40
    },
    name: {
        fontSize: 24,
        fontWeight: 500
    },
    mobile: {
        fontSize: 24,
        fontWeight: 500
    }
})