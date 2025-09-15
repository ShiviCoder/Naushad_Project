import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { Product, products } from './ProductsArray'
import ProductCard from './ProductCard'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
const FlatListComp = () => {
    return (
        <FlatList
            showsVerticalScrollIndicator={false} 
            data={products} 
            keyExtractor={(item: Product) => String(item.id)} renderItem={({ item }) =>
                <ProductCard product={item} />
            } 
            numColumns={2} 
            contentContainerStyle={styles.listContainer} columnWrapperStyle={styles.row} />
    )
}
export default FlatListComp
const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: hp('4%'),
        paddingVertical : wp('2%'),
    },
    row: {
      justifyContent: 'space-between',
      marginBottom : hp('1%')
    }
})