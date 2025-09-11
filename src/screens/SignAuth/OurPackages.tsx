import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Package = {
  id: string;
  title: string;
  price: string;
  services: string;
  about: string;
  discount: string;
  serviceList: string[];
  review: number,
  rating: number,
  image: any;
};

const packagesData: Package[] = [
  {
    id: '1',
    title: 'Basic hair cut package',
    price: '₹ 499',
    services: 'Haircut, Shampoo',
    about: 'Perfect for daily grooming',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 23,
    rating: 4,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
  {
    id: '2',
    title: 'Deluxe Facial Package',
    price: '₹ 499',
    services: 'Exfoliation, mask',
    about: 'Refresh your skin',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 230,
    rating: 5,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
  {
    id: '3',
    title: 'Basic hair cut package',
    price: '₹ 499',
    services: 'Haircut, Shampoo',
    about: 'Perfect for daily grooming',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 223,
    rating: 1,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
  {
    id: '4',
    title: 'Basic hair cut package',
    price: '₹ 499',
    services: 'Haircut, Shampoo',
    about: 'Perfect for daily grooming',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 123,
    rating: 3,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
  {
    id: '5',
    title: 'Basic hair cut package',
    price: '₹ 499',
    services: 'Haircut, Shampoo',
    about: 'Perfect for daily grooming',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 293,
    rating: 4,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
  {
    id: '6',
    title: 'Basic hair cut package',
    price: '₹ 499',
    services: 'Haircut, Shampoo',
    about: 'Perfect for daily grooming',
    discount: '🔖 Save ₹300 on festive booking',
    serviceList: ['Cleansing & Scrubbing', 'Steam & Blackhead Removal', 'Relaxing Massage', 'Hydrating Mask', 'Skin Brightening Serum'],
    review: 253,
    rating: 2,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
];
const OurPackagesScreen = () => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  type RootStackParamList = {
    OurPackages: undefined;
    PackageDetails: { item: Package };
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderPackageItem = ({ item }: { item: Package }) => (
    <View style={styles.packageCard}>
      <View style={styles.cardContent}>
        <View style={styles.textContent}>
          <Text style={styles.packageTitle}>{item.title}</Text>
          <Text style={styles.packagePrice}>{item.price}</Text>
          <View style={styles.servicesRow}>
            <Text style={styles.servicesLabel}>Services:-</Text>
            <Text style={styles.servicesText}>{item.services}</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>About:-</Text>
            <Text style={styles.aboutText}>{item.about}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('PackageDetails', { item })}
          >
            <Text style={styles.bookButtonText}>Book now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.packageImage} />
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Packages</Text>
        <View style={styles.headerSpacer} />
      </View>
      {/* Packages List */}
      <FlatList
        data={packagesData}
        renderItem={renderPackageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      {/* Bottom Navigation */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    margin: 20
  },
  headerSpacer: {
    width: 36,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  textContent: {
    flex: 1,
    paddingRight: 12,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 12,
  },
  servicesRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  servicesLabel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 6,
  },
  servicesText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  aboutLabel: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 6,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    width: 100,
    height: 120,
  },
  packageImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  // Bottom Navigation
  bottomBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center'
  },
  bottomNav: {
    backgroundColor: '#111',
    width: '92%',
    height: 54,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  fabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1b427ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
});
export default OurPackagesScreen;