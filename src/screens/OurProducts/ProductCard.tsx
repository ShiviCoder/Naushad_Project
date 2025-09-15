import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Product } from "./ProductsArray";
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
    product: Product;
}



const ProductCard: React.FC<Props> = ({ product }) => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.productCard}>
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product })}>
                <Image
                    resizeMode='cover'
                    source={product.image[0]} style={styles.ImageStyle} />
                <Text
                    numberOfLines={1}
                    style={styles.productName}>{product.name}</Text>
                <View style={styles.OuterPriceContainer}>
                    <View style={styles.InnerPriceContainer}>
                        <Text style={styles.priceStyle}>₹{product.price}</Text>
                        <Text style={styles.oldPriceStyle}>{product.oldPrice}</Text>
                    </View>
                    <Text style={styles.DiscountStyle}>{product.discount}</Text>
                </View>
                <View style={styles.descContain}>
                    <Image
                        resizeMode='contain'
                        source={product.featureIcon}
                        style={styles.featureIconStyle} />
                    <Text style={styles.DescStyle} numberOfLines={1} ellipsizeMode="tail"> {product.description}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.OutRatContain} >
                <View style={styles.InnerRatContain}>
                    <Text style={styles.ratingTextStyle}>{product.rating}</Text>
                    <Image
                        resizeMode='contain'
                        style={styles.starStyle}
                        source={require('../../assets/OurProduct/star1.png')} />
                </View>
                <Text style={styles.reviewStyle}>({product.reviews})</Text>
            </View>

            <TouchableOpacity style={styles.likeImgContainer}>

                <Image
                    style={styles.iconImage}
                    resizeMode='contain'
                    source={require('../../assets/OurProduct/Like.png')} />

            </TouchableOpacity>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: "white",
        width: wp('44%'),
        borderRadius: wp('7%'),
        alignItems: 'center',
        elevation: 5,
        marginVertical: hp('1%'),
        marginHorizontal: wp('2%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('2%')
    },
    ImageStyle: {
        width: wp('40%'),
        height: wp('30%'),
        borderRadius: wp('5%'),
        marginBottom: hp('3%')
    },
    OuterPriceContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        gap: wp('2.5%'),
        marginBottom: hp('1%')
    },
    InnerPriceContainer: {
        flexDirection: 'row',
        gap: wp('1.5%')

    },
    priceStyle: {
        fontSize: wp('3.8%'),
        fontWeight: '500'
    },
    featureIconStyle: {
        width: wp('4%'),
        height: hp('2%')
    },
    starStyle: {
        width: wp('3.2%'),
        height: wp('3.2%'),
    },
    starContainer: {
        backgroundColor: '#f1ff23'
    },
    descContain: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-start',
        gap: wp('1%'),
        marginBottom: hp('1%')
    },
    OutRatContain: {
        width: '100%',
        flexDirection: 'row',
        gap: wp('2%'),
        alignItems: 'center'
    },
    InnerRatContain: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#09932B',
        borderRadius: wp('3%'),
        paddingVertical: hp('0.2%'),
        paddingHorizontal: wp('1.5%')
    },
    ratingTextStyle: {
        color: '#fff',
        fontSize: wp('3.2%'),
        marginRight: wp('1%'),
    },
    productName: {
        fontSize: wp('4%'),
        alignSelf: 'flex-start',
        fontWeight: '700',
        marginBottom: hp('1%')
    },
    DescStyle: {
        flex: 1,
        fontSize: wp('3.5%'),
        fontWeight: '600'
    },
    oldPriceStyle: {
        color: 'gray',
        fontSize: wp('3.5%'),
        opacity: 0.6,
        textDecorationLine: 'line-through',
    },
    DiscountStyle: {
        color: '#42BA86',
        fontSize: wp('3.5%'),
        fontWeight: '600'
    },
    reviewStyle: {
        marginLeft: wp('1%'),
        fontSize: wp('3.2%'),
        color: '#ACACAC',
    },
    iconImage: {
        height: '70%',
        width: '70%',
        alignSelf: 'center'
    },
    likeImgContainer: {
        height: wp('7%'),
        marginVertical: hp('1%'),
        width: wp('7%'),
        backgroundColor: '#9387871F',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        borderRadius: wp('10%')
    }
})