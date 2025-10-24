import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';

type Package = {
  id: string;
  title: string;
  price: string;
  services: string;
  about: string;
  discount: string;
  serviceList: string[];
  review: number;
  rating: number;
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
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
    serviceList: [
      'Cleansing & Scrubbing',
      'Steam & Blackhead Removal',
      'Relaxing Massage',
      'Hydrating Mask',
      'Skin Brightening Serum',
    ],
    review: 253,
    rating: 2,
    image: require('../../assets/images/haircut1.png'), // Replace with your image path
  },
];
const OurPackagesScreen = () => {
  const { theme } = useTheme(); // ✅ get current theme

  const handleBackPress = () => {
    navigation.goBack();
  };

  type RootStackParamList = {
    OurPackages: undefined;
    PackageDetails: { item: Package };
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderPackageItem = ({ item }: { item: Package }) => (
    <View
      style={[
        styles.packageCard,
        { backgroundColor: theme.dark ? '#111' : '#fff' }, // card bg
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContent}>
          <Text
            style={[
              styles.packageTitle,
              { color: theme.dark ? '#fff' : '#000' },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.packagePrice, { color: COLORS.primary }]}>
            {item.price}
          </Text>

          <View style={styles.servicesRow}>
            <Text
              style={[
                styles.servicesLabel,
                { color: theme.dark ? '#4CAF50' : '#4CAF50' },
              ]}
            >
              Services:-
            </Text>
            <Text
              style={[
                styles.servicesText,
                { color: theme.dark ? '#ddd' : '#333' },
              ]}
            >
              {item.services}
            </Text>
          </View>

          <View style={styles.aboutRow}>
            <Text
              style={[
                styles.aboutLabel,
                { color: theme.dark ? '#4CAF50' : '#4CAF50' },
              ]}
            >
              About:-
            </Text>
            <Text
              style={[
                styles.aboutText,
                { color: theme.dark ? '#ddd' : '#333' },
              ]}
            >
              {item.about}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('PackageDetails', { item })}
          >
            <Text
              style={[
                styles.bookButtonText,
                { color: theme.dark ? '#000' : '#fff' },
              ]}
            >
              Book now
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.packageImage} />
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.dark ? '#000' : '#fff' },
      ]}
    >
      {/* Header */}
      <Head title="Our Packages" />
      {/* Packages List */}
      <FlatList
        data={packagesData}
        renderItem={renderPackageItem}
        keyExtractor={item => item.id}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    margin: 20,
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
    alignItems: 'center',
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
