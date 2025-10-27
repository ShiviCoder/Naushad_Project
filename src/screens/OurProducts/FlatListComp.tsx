import { StyleSheet, View, FlatList, useWindowDimensions } from 'react-native';
import React from 'react';
import { Product, products } from './ProductsArray';
import ProductCard from './ProductCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
type FlatListCompProps = {
    products: Product[];
    likedProducts: string[];
    onToggleLike: (id: string) => void;
};
const FlatListComp: React.FC<FlatListCompProps> = ({ products, likedProducts, onToggleLike }) => {
    const { width, height } = useWindowDimensions();
    const { theme } = useTheme();
    const isPortrait = height >= width;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={isPortrait ? 2 : 4}
                columnWrapperStyle={{
                justifyContent: 'flex-start'
  }}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        liked={likedProducts.includes(item.id)}
                        onToggleLike={() => onToggleLike(item.id)}
                    />
                )}
            />
        </SafeAreaView>
    )
}

export default FlatListComp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp('2%')
    },
    listContainer: {
        paddingBottom: hp('4%'),
        paddingVertical: wp('2%'),
    },
    row: {
        justifyContent: 'flex-start',
        marginBottom: hp('1%')
    }
});
