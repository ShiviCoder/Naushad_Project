import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { Product, products } from './ProductsArray'
import ProductCard from './ProductCard'
const FlatListComp = () => {
    return (
        <FlatList
            showsVerticalScrollIndicator={false} data={products} keyExtractor={(item: Product) => item.id} renderItem={({ item }) =>
                <ProductCard product={item} />
            } numColumns={2} contentContainerStyle={styles.listContainer} columnWrapperStyle={styles.row} />
    )
}
export default FlatListComp
const styles = StyleSheet.create({
listContainer: {
    paddingBottom: 10,
    justifyContent: 'center',
},
row: {
   gap: 10,
   justifyContent: 'flex-start',
   marginLeft: '2.5%'
}
})