import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors'; // make sure COLORS has primary, pink, green, red, gray
import Head from '../../components/Head';

const transactions = [
    { id: '1', title: 'Hair Spa Service', amount: '- ₹899', date: 'Nov 2, 2025', type: 'debit' },
    { id: '2', title: 'Added Wallet Balance', amount: '+ ₹1,000', date: 'Nov 1, 2025', type: 'credit' },
    { id: '3', title: 'Tip to Stylist', amount: '- ₹100', date: 'Oct 30, 2025', type: 'debit' },
];

const WalletScreen = () => {
    return (
        <>
            <Head title="Wallet" />
            <View style={styles.container}>

                {/* Wallet Header Card */}
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <Image
                            source={require('../../assets/wallet.png')}
                            style={styles.walletIcon}
                        />
                        <Text style={styles.cardTitle}>Salon Wallet</Text>
                    </View>

                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>₹ 2,340.50</Text>

                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addText}>+ Add Money</Text>
                    </TouchableOpacity>
                </View>

                {/* Transaction History */}
                <Text style={styles.sectionTitle}>Transaction History</Text>
                <FlatList
                    data={transactions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionItem}>
                            <View style={styles.leftRow}>
                                <Image
                                    source={
                                        item.type === 'credit'
                                            ? require('../../assets/wallet.png')
                                            : require('../../assets/wallet.png')
                                    }
                                    style={styles.transactionIcon}
                                />
                                <View>
                                    <Text style={styles.transactionTitle}>{item.title}</Text>
                                    <Text style={styles.transactionDate}>{item.date}</Text>
                                </View>
                            </View>

                            <Text
                                style={[
                                    styles.transactionAmount,
                                    { color: item.type === 'credit' ? COLORS.green : COLORS.red },
                                ]}
                            >
                                {item.amount}
                            </Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </>
    );
};

export default WalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: wp('3%'),
    },
    card: {
        backgroundColor: COLORS.primary,// salon pink
        borderRadius: 25,
        padding: wp('6%'),
        marginBottom: hp('3%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIcon: {
        width: wp('8%'),
        height: wp('8%'),
        tintColor: '#fff',
        marginRight: 10,
    },
    cardTitle: {
        fontSize: wp('5%'),
        color: '#fff',
        fontWeight: '700',
    },
    balanceLabel: {
        color: '#fff',
        fontSize: wp('3.8%'),
        marginTop: hp('2%'),
        opacity: 0.9,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: wp('9%'),
        fontWeight: 'bold',
        marginTop: hp('0.5%'),
    },
    addButton: {
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('6%'),
        alignSelf: 'flex-start',
        marginTop: hp('2%'),
    },
    addText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: wp('4%'),
    },
    sectionTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#333',
        marginBottom: hp('1.5%'),
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fdfdfd',
        borderRadius: 20,
        padding: wp('4%'),
        marginBottom: hp('1.2%'),
        elevation: 2,
        shadowColor: '#ccc',
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: wp('7%'),
        height: wp('7%'),
        tintColor: COLORS.primary,
        marginRight: 10,
    },
    transactionTitle: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#333',
    },
    transactionDate: {
        fontSize: wp('3.2%'),
        color: '#888',
    },
    transactionAmount: {
        fontSize: wp('4%'),
        fontWeight: '700',
    },
});
