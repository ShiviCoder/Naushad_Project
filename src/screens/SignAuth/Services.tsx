import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList ,
  SafeAreaView , 
  SafeAreaViewBase,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';


const categories = [
  { name: "Haircut", image: require("../../assets/images/haircut.jpg") },
  { name: "Hair coloring", image: require("../../assets/images/haircolor.jpg") },
  { name: "Facial", image: require("../../assets/images/facial.jpg") },
  { name: "Beard", image: require("../../assets/images/beard.jpg") },
  { name: "Nail", image: require("../../assets/images/nail.jpg") },
];

const services = [
  { name: "Hair Cut", price: 350, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircut.jpg") },
  { name: "Hair coloring", price: 500, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircolor.jpg") },
  { name: "Facial", price: 700, desc: "For healthy, radiant skin", image: require("../../assets/images/facial.jpg") },
  { name: "Beard Trim", price: 299, desc: "Shape and stylish beard", image: require("../../assets/images/beard.jpg") },
  { name: "Nail art", price: 300, desc: "Creative nails", image: require("../../assets/images/nail.jpg") },
  // Adding duplicate services to match the long list in the image
  { name: "Hair Cut", price: 200, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircut.jpg") },
  { name: "Hair coloring", price: 300, desc: "Stylish cut with blow dry", image: require("../../assets/images/haircolor.jpg") },
  { name: "Facial", price: 700, desc: "For healthy, radiant skin", image: require("../../assets/images/facial.jpg") },
  { name: "Beard Trim", price: 299, desc: "Shape and stylish beard", image: require("../../assets/images/beard.jpg") },
  { name: "Nail art", price: 300, desc: "Creative nails", image: require("../../assets/images/nail.jpg") },
];

export default function ServicesScreen({ navigation }: { navigation?: any }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('HomeScreen')} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
        >
          {categories.map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText} numberOfLines={2} ellipsizeMode="tail">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>₹{item.price}.00</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="home" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Icon name="calendar-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.plusBtn}>
            <Icon name="add" size={28} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Icon name="hand-left-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Icon name="person-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 34, // Same width as back button for centering
  },

  // Categories
  categoryScroll: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: '500',
    lineHeight: 14,
  },

  // Services Container
  servicesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100, // Space for bottom navigation
  },

  // Service Cards
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 15,
    elevation: 3,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  bookBtn: {
    backgroundColor: "#F6B745",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },

  // Bottom Navigation
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#111",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  // Floating Plus Button
  plusBtn: {
    backgroundColor: "#F6B745",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
