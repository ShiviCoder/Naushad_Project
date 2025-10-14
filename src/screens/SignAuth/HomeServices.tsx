import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,

  Alert,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import Head from "../../components/Head";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  Home: undefined;
  ServicesScreen: undefined;
};



const services = [
  { name: "Mundan ", price: 300, desc: "Shaving a baby's first hair", image: require("../../assets/mundan.png") },
  { name: "Hair Cut", price: 350, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircut.jpg") },
  { name: "Hair coloring", price: 500, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircolor.jpg") },
  { name: "Facial", price: 700, desc: "For healthy, radiant skin", image: require("../../assets/images/facial.jpg") },
  { name: "Beard Trim", price: 299, desc: "Shape and stylish beard", image: require("../../assets/images/beard.jpg") },
  { name: "Nail art", price: 300, desc: "Creative nails", image: require("../../assets/images/nail.jpg") },
];

export default function ServicesScreen() {
  //   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigation = useNavigation();
  // Multiple back button methods
  const handleBackPress = () => {
    console.log('Back button pressed');

    try {
      // Method 1: Try goBack first
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Method 2: Navigate directly to Home if can't go back
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.log('Navigation error:', error);
      // Method 3: Reset navigation stack as fallback
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Head title='Home Services' />


      {/* Services List */}
      <ScrollView style={styles.servicesContainer}>
        {services.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>₹{item.price}.00</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('ServiceDetails', {
                item: { ...item, image: item.image }
              })}>
                <Text style={styles.bookBtnText}>Book now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  // Categories
  categoryScroll: {
    marginVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  categoryItem: {
    alignItems: "center",
    marginRight: wp('4%'),
    width: wp('18%'),
  },
  categoryImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('1%'),
  },
  categoryText: {
    fontSize: hp('1.5%'),
    color: "#333",
    textAlign: "center",
    fontWeight: '500',
    lineHeight: hp('2%'),
  },

  // Services Container
  servicesContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('12%'), // space for bottom navigation
  },

  // Service Cards
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    elevation: 3,
    padding: wp('4%'),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
  },
  cardImage: {
    width: wp('25%'),
    height: wp('31%'),
    borderRadius: wp('3%'),
  },
  cardContent: {
    flex: 1,
    paddingLeft: wp('4%'),
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: hp('2.5%'),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp('0.5%'),
  },
  cardPrice: {
    fontSize: hp('2%'),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp('1%'),
  },
  cardDesc: {
    fontSize: hp('1.6%'),
    color: "#666",
    marginBottom: hp('1.5%'),
    lineHeight: hp('2%'),
  },
  bookBtn: {
    backgroundColor: "#F6B745",
    alignSelf: "flex-start",
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  bookBtnText: {
    color: "#fff",
    fontSize: hp('1.6%'),
    fontWeight: "bold",
  },
});

