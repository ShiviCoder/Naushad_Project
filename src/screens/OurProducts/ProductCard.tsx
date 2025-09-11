import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Product } from "./ProductsArray";
import { useNavigation } from '@react-navigation/native';

type Props = {
    product: Product;
}



const ProductCard: React.FC<Props> = ({ product }) => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', {product})}>
                <Image source={product.image} style={styles.ImageStyle} />
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.OuterPriceContainer}>
                    <View style={styles.InnerPriceContainer}>
                        <Text>₹{product.price}</Text>
                        <Text style={styles.oldPriceStyle}>{product.oldPrice}</Text>
                    </View>
                    <Text style={styles.DiscountStyle}>{product.discount}</Text>
                </View>
                <View style={styles.descContain}>
                    <Image source={product.featureIcon} style={styles.featureIconStyle} />
                    <Text style={styles.DescStyle} numberOfLines={1} ellipsizeMode="tail"> {product.description}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.OutRatContain} >
                <View style={styles.InnerRatContain}>
                    <Text style={styles.ratingTextStyle}>{product.rating}</Text>
                    <Image style={styles.starStyle} source={require('../../assets/OurProduct/star1.png')} />
                </View>
                <Text style={styles.reviewStyle}>({product.reviews})</Text>
            </View>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: "white",
        width: 180,
        height: 286,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 10,
        margin: 10,
        justifyContent: 'space-between',
        padding: 8
    },
    ImageStyle: {
        width: 160,
        height: 135,
        borderRadius: 20
    },
    OuterPriceContainer: {
        flexDirection: 'row',
        width: '95%',
        justifyContent: 'space-between'
    },
    InnerPriceContainer: {
        flexDirection: 'row',
        width: '45%',
        justifyContent: 'space-between'
    },
    featureIconStyle: {
        width: 15.032294273376465,
        height: 10.689141273498535
    },
    starStyle: {
        width: 10,
        height: 10
    },
    starContainer: {
        backgroundColor: '#f1ff23'
    },
    descContain: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        justifyContent: 'space-between'
    },
    OutRatContain: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: '10%',
        alignItems: 'center'
    },
    InnerRatContain: {
        alignItems: 'center',
        width: '40%',
        flexDirection: 'row',
        backgroundColor: '#09932B',
        borderRadius: 12,
        justifyContent: 'space-evenly',
        padding: 2
    },
    ratingTextStyle: {
        color: '#ffffff'
    },
    productName: {
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    DescStyle: {
        width: '80%'
    },
    oldPriceStyle: {
        color: 'gray',
        opacity: 0.6,
        textDecorationLine: 'line-through',
    },
    DiscountStyle: {
        color: '#42BA86'
    },
    reviewStyle: {
        color: '#ACACAC'
    }
})