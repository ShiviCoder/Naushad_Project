import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

type RootStackParamList = {
    OurProducts: undefined;
    ProductDetails: undefined;
};

type ProductDetailsProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

const ProductDetails = ({ navigation }: ProductDetailsProps) => {
    const route = useRoute<any>();          // ← Yahan daalo
    const { product } = route.params;
    const [count, setCount] = useState(1);
    const { theme } = useTheme();

    const getImageSource = (img: any) => {
        if (!img) return null;
        if (typeof img === 'string') {
            return { uri: img };
        }
        return img; // assume it's require()
    }
    const displayImage = Array.isArray(product.image)
        ? getImageSource(product.image[0])
        : getImageSource(product.image);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#fff' }]}>
            <Head title='Our Products' />
            <View style={{ paddingHorizontal: wp('4%') }}>
                <Image style={styles.image} source={displayImage} />
                <View style={styles.detailContain}>
                    <Text style={[styles.prodName, { color: theme.dark ? '#fff' : '#000' }]}>{product.name}</Text>
                    <Text style={[styles.prodPrice, { color: theme.dark ? '#fff' : '#000' }]}>{product.price}</Text>
                    <View style={styles.ratingContain}>
                        <View style={styles.starContain}>
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    name="star"
                                    size={wp('5%')}
                                    color={i < product.rating ? '#F6B745' : (theme.dark ? '#ACACAC' : '#555')}
                                />
                            ))}
                        </View>
                        <Text style={[styles.reviews, { color: theme.dark ? '#777' : '#ccc' }]}>({product.reviews} views)</Text>
                    </View>
                </View>
                <Text style={[styles.desc, { color: theme.dark ? '#fff' : '#000' }]}>{product.description}</Text>

                <View style={[styles.countContain, { backgroundColor: theme.dark ? '#fff' : '#000' }]}>
                    <TouchableOpacity style={styles.countBtn} onPress={() => setCount(count > 1 ? count - 1 : count)}>
                        <Text style={[styles.countBtnTxt, { color: theme.dark ? '#000' : '#fff' }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.countTxt, { color: theme.dark ? '#000' : '#fff' }]}>{count}</Text>
                    <TouchableOpacity style={styles.countBtn} onPress={() => setCount(count + 1)}>
                        <Text style={[styles.countBtnTxt, { color: theme.dark ? '#000' : '#fff' }]}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnContain}>
                    <TouchableOpacity
                        style={[styles.cartButton, { borderColor: theme.dark ? '#fff' : '#000' }]}
                        onPress={() => {
                            navigation.navigate('Cart', {
                                product: { ...product, qty: count, cartImage: product.image }
                            });
                        }}
                    >
                    <Text style={[styles.cartTxt, { color: theme.dark ? '#fff' : '#000' }]}>Add to cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('PaymentScreen', {
                                serviceName: product.name,   // 🧾 product name as service name
                                price: product.price,        // 💰 product price
                                date: new Date().toDateString(), // optional (for now)
                                time: null,                  // optional
                            })
                        }
                        style={[styles.buyButton, { backgroundColor: COLORS.primary }]}
                    >
                        <Text style={styles.buyTxt}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

    )
}

export default ProductDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    image: {
        width: wp('90%'),
        height: hp('28%'),
        borderRadius: wp('4%'),
        alignSelf: 'center',
        marginBottom: hp('3%'),
        resizeMode: 'cover'
    },
    detailContain: {
        alignItems: 'flex-start',
        marginBottom: hp('2%'),
        gap: hp('1%'),
        paddingHorizontal: wp('3%')
    },
    prodName: {
        fontSize: wp('7%'),
        fontWeight: '600',
        textAlign: 'left'
    },
    prodPrice: {
        fontSize: wp('6%'),
        fontWeight: '700'
    },
    ratingContain: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp('3%'),
        marginTop: hp('1%')
    },
    starContain: {
        flexDirection: 'row',
    },
    reviews: {
        fontSize: wp('3.5%')
    },
    desc: {
        width: '90%',
        alignSelf: 'flex-start',
        fontSize: wp('5%'),
        fontWeight: '400',
        marginBottom: hp('2%'),
        paddingHorizontal: wp('3%')
    },
    countContain: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        borderRadius: wp('3%'),
        paddingVertical: hp('1%'),
        width: wp('35%'),
        alignSelf: 'flex-start',
        marginBottom: hp('10%'),
    },
    countBtn: {
        paddingHorizontal: wp('2%'),
        borderRadius: wp('2%'),
    },
    countBtnTxt: {
        color: "#fff",
        fontSize: wp('4%'),
        fontWeight: "bold",
    },
    countTxt: {
        fontSize: wp('4%'),
        fontWeight: "600",
        color: "#fff",
        minWidth: wp('10%'),
        textAlign: "center",
    },
    btnContain: {
        width: '100%',
        alignSelf: 'center',
        gap: hp('2%'),
        paddingHorizontal: wp('3%')
    },
    cartButton: {
        width: '100%',
        height: hp('6%'),
        borderWidth: 1,
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyButton: {
        width: '100%',
        height: hp('6%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartTxt: {
        fontSize: wp('4%'),
        fontWeight: '500'
    },
    buyTxt: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#fff'
    },
})
