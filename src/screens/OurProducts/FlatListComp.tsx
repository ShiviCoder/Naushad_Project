import { StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
import { Product, products } from './ProductsArray';
import ProductCard from './ProductCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';

const FlatListComp = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyExtractor={(item: Product) => String(item.id)}
                renderItem={({ item }) => <ProductCard product={item} />}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.row}
            />
        </View>
    )
}

export default FlatListComp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingBottom: hp('4%'),
        paddingVertical: wp('2%'),
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: hp('1%')
    }
});
