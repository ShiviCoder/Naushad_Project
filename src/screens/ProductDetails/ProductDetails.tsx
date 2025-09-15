import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';

type RootStackParamList = {
    OurProducts: undefined;
    ProductDetails: undefined;
};

type ProductDetailsProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

const ProductDetails = ({ navigation }: ProductDetailsProps) => {
    const route = useRoute<any>();
    const { product } = route.params;
    const [count, setCount] = useState(1);

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <TouchableOpacity onPress={() => navigation.navigate('OurProducts')}>  <Icon style={styles.headingIcon} name="chevron-left" size={30} color="#000" /> </TouchableOpacity>
                <Text style={styles.headingTxt} >Our Products</Text>
            </View>
            <Image style={styles.image} source={product.image[1]} />
            <View style={styles.detailContain}>
                <Text style={styles.prodName} >{product.name}</Text>
                <Text style={styles.prodName} >₹ {product.price}</Text>
                <View style={styles.ratingContain}>
                    <View style={styles.starContain}>
                        <Icon name="star" size={20} style={styles.star} ></Icon>
                        <Icon name="star" size={20} style={styles.star} ></Icon>
                        <Icon name="star" size={20} style={styles.star} ></Icon>
                        <Icon name="star" size={20} style={styles.star} ></Icon>
                        <Icon name="star" size={20} color={'#ACACAC'} ></Icon>
                    </View>
                    <Text style={styles.reviews}>({product.reviews} views)</Text>
                </View>
            </View>
            <Text style={styles.desc}>{product.description}</Text>
            <View style={styles.countContain}>
                <TouchableOpacity style={styles.countBtn} onPress={() => setCount(count > 1 ? count - 1 : count)}><Text style={styles.countBtnTxt}>-</Text></TouchableOpacity>
                <Text style={styles.countTxt}>{count}</Text>
                <TouchableOpacity style={styles.countBtn} onPress={() => setCount(count + 1)}><Text style={styles.countBtnTxt}>+</Text></TouchableOpacity>
            </View>
            <View style={styles.btnContain}>
                <TouchableOpacity style={styles.cartButton} >
                    <Text style={styles.cartTxt}>Add to cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyTxt}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ProductDetails

const styles = StyleSheet.create({
    container: {
        gap: 40
    },
    heading: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 90,
        width: '85%',
        alignItems: 'center',
        marginTop: 40,
        alignSelf: 'center'
    },
    headingIcon: {

    },
    headingTxt: {
        fontSize: 20,
        fontWeight: 700
    },
    image: {
        alignSelf: 'center',
        width: 350,
        height: 189,
        borderRadius: 10,
        elevation: 10
    },
    ratingContain: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        gap: 10,
        alignItems: 'center'
    },
    detailContain: {
        gap: 10
    },
    prodName: {
        alignSelf: 'center',
        width: '80%',
        fontSize: 24,
        fontWeight: 500
    },
    starContain: {
        flexDirection: 'row',
    },
    star: {
        color: '#F6B745'
    },
    reviews: {
        fontSize: 15,
        color: '#0000006E'
    },
    desc: {
        width: '80%',
        alignSelf: 'center',
        fontWeight: 500,
        fontSize: 16
    },
    btnContain: {
        width: '80%',
        alignSelf: 'center',
        gap: 20
    },
    cartButton: {
        width: 350,
        height: 41,
        borderWidth: 2,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyButton: {
        width: 350,
        height: 41,
        backgroundColor: '#F6B745',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartTxt: {

    },
    buyTxt: {

    },
    countContain: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        borderRadius: 12,
        paddingHorizontal: 5,
        paddingVertical: 5,
        width: '30%',
        marginLeft: 40
    },
    countBtn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    countBtnTxt: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
    },
    countTxt: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffffff",
        minWidth: 40,
        textAlign: "center",
    },
})