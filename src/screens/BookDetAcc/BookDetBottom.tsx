import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const BookDetBottom = () => {
    return (
        <View style={styles.OuterContainer}>
            <TouchableOpacity style={styles.call}>
                <Text style={styles.callTxt}>
                    Call
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.message}>
                <Text style={styles.messageTxt}>
                    Message
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default BookDetBottom

const styles = StyleSheet.create({
    call: {
        width: 144,
        height: 41,
        backgroundColor: '#42BA86',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:15
    },
    callTxt: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 500
    },
    message: {
        width: 144,
        height: 41,
        backgroundColor: '#237BCE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    messageTxt: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 500
    },
    OuterContainer: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
})