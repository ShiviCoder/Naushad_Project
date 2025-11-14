import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';
import Head from '../../components/Head';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Popup from '../../components/PopUp';
const ProductPackages = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const { theme } = useTheme();
  const route = useRoute();
  const { item } = route.params || {};
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary, textAlign: 'center', marginTop: 50 }}>
          Product data not available
        </Text>
      </SafeAreaView>
    );
  }

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name={i < 4 ? "star" : "star-outline"}
        size={10}
        color="#F6B745"
        style={styles.star}
      />
    ));
  };

  const handleAddToCart = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setPopupMessage("Please log in first.");
        setPopupVisible(true);
        return;
      }

      const product = {
        id: 1,
        name: item.title || "Product",
        price: item.price || 0,
        oldPrice: 0,
        discount: 0,
        image: "https://via.placeholder.com/150",
      };

      const response = await fetch("https://naushad.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: quantity,
          image: product.image,
        }),
      });

      const res = await response.json();
      console.log("Add to Cart Response:", res);

      if (response.ok && res.success) {
        setPopupMessage("Product added to cart!");
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          navigation.navigate("Cart");
        }, 1500);
      } else {
        setPopupMessage(res.message || "Failed to add product to cart");
        setPopupVisible(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setPopupMessage("Something went wrong while adding to cart");
      setPopupVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Product Package" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/newPic.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productInfo}>
          <View style={styles.titlePriceRow}>
            <Text style={[styles.productTitle, { color: theme.textPrimary }]}>
              {item.name || 'No title'}
            </Text>
            <Text style={[styles.price, { color: theme.textPrimary }]}>
              ₹{item.price || 'N/A'}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars()}</View>
            <Text style={[styles.reviewText, { color: theme.textSecondary }]}>
              ({item.review || 0} Reviews)
            </Text>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {item.description || 'No description available.'}
          </Text>

          {item.offer && (
            <View style={styles.offerContainer}>
              <Text style={[styles.offerText, { color: theme.textPrimary }]}>
                {item.offer}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Quantity Selector
          </Text>
          <View style={[styles.quantityContainer, { backgroundColor: theme.textPrimary }]}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Text style={[styles.quantityButtonText, { color: theme.background }]}>-</Text>
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={[styles.quantityText, { color: theme.background }]}>{quantity}</Text>
            </View>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Text style={[styles.quantityButtonText, { color: theme.background }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, { borderColor: theme.textPrimary }]}
          onPress={handleAddToCart}
        >
          <Text style={[styles.addToCartText, { color: theme.textPrimary }]}>
            Add to cart
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PaymentScreen', {
              serviceName: item.name || 'Product',
              price: item.price || 0,
            })
          }
          style={[styles.buyNowButton, { backgroundColor: COLORS.primary }]}
        >
          <Text style={styles.buyNowText}>Buy now</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Popup integration */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4.44%'),
    paddingVertical: hp('1.5%'),
    borderBottomWidth: wp('0.28%'),
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: wp('6.67%'),
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    margin: wp('5.56%'),
    borderRadius: wp('4.17%'),
    overflow: 'hidden',
  },
  productImage: {
    width: '97.22%',
    height: hp('22.75%'),
  },
  productInfo: {
    paddingHorizontal: wp('4.44%'),
    paddingBottom: hp('2%'),
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  productTitle: {
    width: wp('52.5%'),
    height: hp('3.75%'),
    fontSize: hp('2.5%'),
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  price: {
    fontSize: hp('2.5%'),
    fontWeight: '500',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.875%'),
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: wp('2.2%'),
  },
  star: {
    marginRight: wp('0.56%'),
  },
  reviewText: {
    fontSize: hp('1.75%'),
    color: '#00000075',
  },
  description: {
    fontSize: hp('1.875%'),
    fontWeight: '500',
    color: '#00000075',
    marginBottom: hp('1.5%'),
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerText: {
    fontSize: hp('1.875%'),
    color: '#000',
    marginLeft: wp('1.67%'),
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: wp('4.44%'),
    paddingVertical: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.5%'),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp('2%'),
  },
  itemsList: {
    gap: hp('1.5%'),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: hp('1.7%'),
    color: '#00000075',
    marginLeft: wp('0.28%'),
  },
  instructionsList: {
    gap: hp('1%'),
  },
  instructionText: {
    fontSize: hp('1.7%'),
    color: '#00000075',
    lineHeight: hp('3%'),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: wp('1.67%'),
    width: wp('20.61%'),
    height: hp('4.125%'),
  },
  quantityButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  quantityDisplay: {
    // flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: hp('2.25%'),
    fontWeight: '600',
    color: '#fff',
  },
  bottomContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('4.44%'),
    paddingVertical: hp('1%'),
    // gap: 12,
    // borderTopWidth: wp('0.28%'),
    // borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    flex: 1,
    width: wp('97.22%'),
    height: hp('5.125%'),
    borderRadius: wp('3.33%'),
    borderWidth: wp('0.28%'),
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: hp('1.75%'),
    fontWeight: '500',
    color: '#000',
  },
  buyNowButton: {
    flex: 1,
    // height: 56,
    width: wp('97.22%'),
    height: hp('5.125%'),
    backgroundColor: '#F6B745',
    borderRadius: wp('3.33%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: hp('1.75%'),
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProductPackages;
