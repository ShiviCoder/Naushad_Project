import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const demoCategories = [
    { id: '1', name: 'Hair Treatment' },
    { id: '2', name: 'Facial' },
    { id: '3', name: 'Nail Arts' },
    { id: '4', name: 'Medicure' },
    { id: '5', name: 'Pennicure' },
    { id: '6', name: 'Pennicure' },
];

const Catelog = () => {
    const { theme } = useTheme();

    const renderItem = ({ item }: { item: typeof demoCategories[0] }) => (
        <View style={[styles.categoryCard, { backgroundColor: theme.dark ? '#333' : '#f5f5f5', borderColor: '#F6B745' }]}>
            <Text style={[styles.categoryText, { color: theme.textPrimary }]}>{item.name}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Head title="Catelog" />
            <FlatList
                data={demoCategories}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: wp('4%') }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Catelog;

const CARD_WIDTH = (wp('100%') - wp('12%')) / 2; // 2 cards per row + padding/margin

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryCard: {
        flex : 1,
        aspectRatio: 1, // height = width
        borderRadius: wp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginBottom: hp('2%'),
        borderColor: '#F6B745',
        elevation: 3,
        paddingHorizontal: wp('2%'), // text wrap
        marginHorizontal : wp('4%')
    },
    categoryText: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        textAlign: 'center',
        flexShrink: 1, // allow text to wrap
    },
});
