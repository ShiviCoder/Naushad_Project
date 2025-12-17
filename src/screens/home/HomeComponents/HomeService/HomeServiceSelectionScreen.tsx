import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../../utils/Colors';
import Head from '../../../../components/Head';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SALON_CONTACT = '+91 98765 43210';

const SERVICES = [
  {
    id: '1',
    name: 'Haircut',
    price: 199,
    image: 'https://example.com/haircut.jpg',
  },
  {
    id: '2',
    name: 'Shave',
    price: 99,
    image: 'https://example.com/shave.jpg',
  },
  {
    id: '3',
    name: 'Trim',
    price: 149,
    image: 'https://example.com/trim.jpg',
  },
  {
    id: '4',
    name: 'Facial',
    price: 499,
    image: 'https://example.com/facial.jpg',
  },
  {
    id: '5',
    name: 'Hair Spa',
    price: 699,
    image: 'https://example.com/hairspa.jpg',
  },
];

const HomeServiceSelectionScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const selectedServices = SERVICES.filter(s => selected.includes(s.id));

  const renderService = ({ item }) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => toggleService(item.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.serviceImage}
          defaultSource={require('../../../../assets/placeholder.jpg')}
        />

        {/* MAIN ROW: name on left, price+checkbox on right */}
        <View style={styles.serviceContentRow}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.priceCheckboxRow}>
            <Text style={styles.servicePrice}>₹{item.price}</Text>
            <TouchableOpacity
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              onPress={() => toggleService(item.id)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Icon name="checkmark" size={wp('4.2%')} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Head title="Home Services" />

      <View style={styles.container}>
        {/* Contact Number */}
        <View style={styles.contactBox}>
          <Text style={styles.contactLabel}>Salon Contact Number</Text>
          <Text style={styles.contactValue}>{SALON_CONTACT}</Text>
          <Text style={styles.contactHint}>
            After booking please confirm on this number
          </Text>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Select Services</Text>

        <FlatList
          data={SERVICES}
          keyExtractor={item => item.id}
          renderItem={renderService}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextBtn, { opacity: selected.length ? 1 : 0.5 }]}
          disabled={!selected.length}
          onPress={() =>
            navigation.navigate('BookingSummaryScreen', {
              services: selectedServices,
            })
          }
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeServiceSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
  },
  contactBox: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 2,
  },
  contactLabel: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
  },
  contactValue: {
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-Medium',
    marginVertical: hp('0.5%'),
  },
  contactHint: {
    fontSize: wp('3.2%'),
    color: '#777',
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
    marginBottom: hp('1%'),
  },
  listContainer: {
    paddingBottom: hp('2%'),
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: hp('1.5%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
    elevation: 1,
  },
  serviceImage: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },

  // whole right side row (name left, price+checkbox right)
  serviceContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', // vertical center of name, price, checkbox
    justifyContent: 'space-between', // name on left, price+checkbox on right
  },

  serviceName: {
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-Medium',
    flexShrink: 1,
    marginRight: wp('2%'),
  },

  // price + checkbox inline
  priceCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    marginRight: wp('3%'),
  },
  checkbox: {
    width: wp('6%'),
    height: wp('6%'),
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('2.2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  nextBtnText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-Medium',
  },
});
