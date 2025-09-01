import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";

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
];

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      {/* Top Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Services List */}
      <FlatList
        data={services}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
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
        )}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image source={require("../../assets/images/home.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require("../../assets/images/calender.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.plusBtn}>
          <Image source={require("../../assets/images/plus.png")} style={styles.plusIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require("../../assets/images/hands.png")} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require("../../assets/images/profile.png")} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },

  // Categories
  categoryScroll: {
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 390,
    height: 90
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
    width: 80
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5
  },
  categoryText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    flexWrap: "wrap",
    width: 70, // fixed width for proper alignment
    fontWeight: 'bold'
  },

  // Service Cards
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10
  },
  cardContent: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2
  },
  cardDesc: {
    fontSize: 12,
    color: "#777",
    marginVertical: 4
  },
  bookBtn: {
    backgroundColor: "#FFC107",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 5,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  },

  // Bottom Navigation
  bottomNav: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#000",
    borderRadius: 40,
    elevation: 5,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff"
  },

  // Floating Plus Button
  plusBtn: {
    backgroundColor: "#FFC107",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    elevation: 5,
  },
  plusIcon: {
    width: 28,
    height: 28,
    tintColor: "#fff"
  },
});
