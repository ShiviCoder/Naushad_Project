import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const BookDetMiddle = () => {
    return (
        <View style={styles.outerContainer}>
            <Text style={styles.status}>Accepted</Text>
            <View style={styles.dateContainer}>
                <Image style={styles.dateImg} source={require('../../assets/BookDetAcc/date.png')} />
                <Text style={styles.dateTxt}>
                    15 Aug 2025
                </Text>
            </View>
            <View style={styles.statContain}>
                <Text style={styles.statTxt}>
                    Accepted
                </Text>
            </View>
            <Text style={styles.priceTxt}>
                ₹ 500
            </Text>
            <Text style={styles.desc}>
                Professional haircut with styling
                included.
            </Text>
        </View>
    )
}

export default BookDetMiddle

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 40,
        gap: 20
    },
    status: {
        fontSize: 28,
        fontWeight: 500
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 20
    },
    dateImg: {
        height: 20,
        width: 20
    },
    dateTxt: {
        fontWeight: 500,
        fontSize: 15
    },
    statContain: {
        width: 114,
        height: 30,
        backgroundColor: '#42BA86',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statTxt: {
        fontWeight: 500,
        fontSize: 15,
        color: '#FFFFFF'
    },
    priceTxt: {
        fontSize: 27,
        fontWeight: 600
    },
    desc: {
        fontSize: 20,
        fontWeight: 400
    }


})