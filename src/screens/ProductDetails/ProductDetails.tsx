import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, BackHandler, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/PopUp';

type RootStackParamList = {
    OurProducts: undefined;
    ProductDetails: { product: any };
    CartPaymentScreen: undefined;
};

type ProductDetailsProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

const ProductDetails = ({ navigation }: ProductDetailsProps) => {
    const route = useRoute<any>();
    const params = route.params || {};
    const product = params.product || {};
    
    // 🔥 LOG SELECTED PRODUCT TO CONSOLE
    console.log('🎯 PRODUCT DETAILS SCREEN - FULL PRODUCT DATA:');
    console.log('📦 Complete Product Object:', JSON.stringify(product, null, 2));
    console.log('🆔 Product ID:', product._id || product.id);
    console.log('📛 Product Name:', product.name);
    console.log('💰 Product Price:', product.price);
    console.log('📸 Product Image:', product.image);
    console.log('🚻 Product Gender:', product.gender);
    console.log('⭐ Product Rating:', product.rating);
    console.log('👁️ Product Reviews:', product.reviews);
    console.log('📝 Product Description:', product.description);
    console.log('🏷️ Product Tag:', product.tag);
    console.log('🎁 Product Offer:', product.offer);
    
    const [count, setCount] = useState(1);
    const { theme } = useTheme();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                setUserId(storedUserId);
            } catch (error) {
                console.error('Error fetching userId:', error);
            }
        };

        fetchUserId();
        setLoading(false);
    }, []);

    const showPopup = (message: string) => {
        setPopupMessage(message);
        setPopupVisible(true);
    };

    const getImageSource = (img: any) => {
        if (!img) return { uri: 'https://via.placeholder.com/300' };
        if (typeof img === 'string') {
            return { uri: img };
        }
        return img;
    };

    const displayImage = Array.isArray(product.image)
        ? getImageSource(product.image[0])
        : getImageSource(product.image);

    // 🔥 SAVE FULL PRODUCT DATA TO ASYNC STORAGE
    const saveProductForPayment = async () => {
        try {
            // Prepare complete product data for payment
            const paymentProduct = {
                type: 'product',
                serviceName: product.name || 'Product',
                name: product.name || 'Product',
                price: product.price || 0,
                quantity: count,
                image: Array.isArray(product.image) ? product.image[0] : product.image,
                source: 'ProductDetails',
                productId: product._id || product.id || null,
                // Additional product details
                description: product.description || '',
                gender: product.gender || '',
                rating: product.rating || 0,
                reviews: product.reviews || 0,
                tag: product.tag || '',
                offer: product.offer || '',
                // Original product object for reference
                originalProduct: product
            };

            console.log('💾 SAVING PRODUCT FOR PAYMENT:');
            console.log('📋 Payment Product Data:', JSON.stringify(paymentProduct, null, 2));

            // Save to AsyncStorage
            await AsyncStorage.setItem('buyNowProduct', JSON.stringify(paymentProduct));
            console.log('✅ Product saved to AsyncStorage successfully');

            return paymentProduct;
        } catch (error) {
            console.error('❌ Error saving product to AsyncStorage:', error);
            return null;
        }
    };

    const handleAddToCart = async () => {
        if (!userId) {
            showPopup('User not found. Please sign in again.');
            return;
        }

        console.log('🛒 Adding to cart:', {
            userId,
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity: count
        });

        try {
            const requestBody = {
                userId: userId,
                productId: product._id || product.id,
                name: product.name || 'Product',
                price: product.price || 0,
                image: Array.isArray(product.image) ? product.image[0] : product.image,
                quantity: count,
            };

            const response = await fetch('https://naushad.onrender.com/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const res = await response.json();
            console.log('🛒 CART API RESPONSE:', res);

            if (response.ok && res.success) {
                showPopup('Product added to cart ✅');
            } else {
                showPopup(res.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Cart Error:', error);
            showPopup('Network error. Please try again.');
        }
    };

    // 🔥 HANDLE BUY NOW BUTTON CLICK
    const handleBuyNow = async () => {
        try {
            console.log('🛍️ BUY NOW button clicked');
            
            // 1. Save full product data to AsyncStorage
            const savedProduct = await saveProductForPayment();
            
            if (!savedProduct) {
                showPopup('Error saving product details. Please try again.');
                return;
            }

            // 2. Navigate to CartPaymentScreen with minimal data
            navigation.navigate('CartPaymentScreen', {
                // Pass only essential data through params
                serviceName: product.name || 'Product',
                price: product.price || 0,
                quantity: count,
                productId: product._id || product.id,
                // Flag to indicate we should load from AsyncStorage
                loadFromStorage: true,
                source: 'ProductDetails'
            });

            console.log('🚀 Navigating to CartPaymentScreen with product data');
            
        } catch (error) {
            console.error('❌ Error in handleBuyNow:', error);
            showPopup('Error processing purchase. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#fff' }]}>
                <Head title='Product Details' />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.dark ? '#121212' : '#fff' }]}>
            <Head title='Product Details' />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp('10%') }}
            >
                <View style={{ paddingHorizontal: wp('4%') }}>
                    {/* Product Image */}
                    <Image style={styles.image} source={displayImage} />

                    {/* Product Details */}
                    <View style={styles.detailContain}>
                        <Text style={[styles.prodName, { color: theme.dark ? '#fff' : '#000' }]}>
                            {product.name || 'Product Name'}
                        </Text>
                        <Text style={[styles.prodPrice, { color: theme.dark ? '#fff' : '#000' }]}>
                            ₹{product.price || 0}
                        </Text>

                        <View style={styles.ratingContain}>
                            <View style={styles.starContain}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        name="star"
                                        size={wp('5%')}
                                        color={i < (product.rating || 0) ? '#F6B745' : (theme.dark ? '#ACACAC' : '#555')}
                                    />
                                ))}
                            </View>
                            <Text style={[styles.reviews, { color: theme.dark ? '#777' : '#ccc' }]}>
                                ({product.reviews || 0} reviews)
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={[styles.desc, { color: theme.dark ? '#fff' : '#000' }]}>
                        {product.description || 'No description available'}
                    </Text>

                    {/* Quantity Selector */}
                    <View style={[styles.countContain, { backgroundColor: theme.dark ? '#fff' : '#000' }]}>
                        <TouchableOpacity
                            style={styles.countBtn}
                            onPress={() => setCount(count > 1 ? count - 1 : count)}
                        >
                            <Text style={[styles.countBtnTxt, { color: theme.dark ? '#000' : '#fff' }]}>-</Text>
                        </TouchableOpacity>

                        <Text style={[styles.countTxt, { color: theme.dark ? '#000' : '#fff' }]}>{count}</Text>

                        <TouchableOpacity
                            style={styles.countBtn}
                            onPress={() => setCount(count + 1)}
                        >
                            <Text style={[styles.countBtnTxt, { color: theme.dark ? '#000' : '#fff' }]}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.btnContain}>
                        <TouchableOpacity
                            style={[styles.cartButton, { borderColor: theme.dark ? '#fff' : '#000' }]}
                            onPress={handleAddToCart}
                        >
                            <Text style={[styles.cartTxt, { color: theme.dark ? '#fff' : '#000' }]}>Add to cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleBuyNow} // 🔥 UPDATED: Use handleBuyNow function
                            style={[styles.buyButton, { backgroundColor: COLORS.primary }]}
                        >
                            <Text style={styles.buyTxt}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Popup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
            />
        </SafeAreaView>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: wp('90%'),
        height: hp('28%'),
        borderRadius: wp('4%'),
        alignSelf: 'center',
        marginBottom: hp('3%'),
        resizeMode: 'cover',
    },
    detailContain: {
        alignItems: 'flex-start',
        marginBottom: hp('2%'),
        gap: hp('1%'),
        paddingHorizontal: wp('3%'),
    },
    prodName: {
        fontSize: wp('7%'),
        fontWeight: '600',
        textAlign: 'left',
    },
    prodPrice: {
        fontSize: wp('6%'),
        fontWeight: '700',
    },
    ratingContain: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp('3%'),
        marginTop: hp('1%'),
    },
    starContain: {
        flexDirection: 'row',
    },
    reviews: {
        fontSize: wp('3.5%'),
    },
    desc: {
        width: '90%',
        alignSelf: 'flex-start',
        fontSize: wp('5%'),
        fontWeight: '400',
        marginBottom: hp('2%'),
        paddingHorizontal: wp('3%'),
    },
    countContain: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: wp('3%'),
        paddingVertical: hp('1%'),
        width: wp('35%'),
        alignSelf: 'flex-start',
        marginBottom: hp('4%'),
    },
    countBtn: {
        paddingHorizontal: wp('3%'),
        borderRadius: wp('2%'),
    },
    countBtnTxt: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    countTxt: {
        fontSize: wp('4%'),
        fontWeight: '600',
        minWidth: wp('10%'),
        textAlign: 'center',
    },
    btnContain: {
        width: '100%',
        alignSelf: 'center',
        gap: hp('2%'),
        paddingHorizontal: wp('3%'),
    },
    cartButton: {
        width: '100%',
        height: hp('6%'),
        borderWidth: 1,
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyButton: {
        width: '100%',
        height: hp('6%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartTxt: {
        fontSize: wp('4%'),
        fontWeight: '500',
    },
    buyTxt: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#fff',
    },
});