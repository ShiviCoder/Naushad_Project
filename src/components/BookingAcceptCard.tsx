import { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const BookingAcceptCards = ({ item }) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  // ✅ Inverted logic for card background and text
  const cardBackground = theme.background === '#121212' ? '#fff' : '#000'; // dark theme → white card, light theme → black card
<<<<<<< HEAD
  const textColor = theme.background === '#121212' ? '#000' : '#fff'; // dark theme → black text, light theme → white text
=======
  const textColor = theme.background === '#121212' ? '#000' : '#fff';      // dark theme → black text, light theme → white text
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab

  const inactiveColor = textColor; // checkbox inactive same as text color

  const acceptedTextColor = isChecked ? theme.primary : textColor;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBackground }]}
      onPress={() => navigation.navigate('BookingAccepted')}
    >
      {/* Service + Checkbox */}
      <View style={styles.acceptContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image source={item.image[0]} style={styles.icon} />
<<<<<<< HEAD
          <Text style={[styles.text, { color: textColor }]}>
            {item.service}
          </Text>
=======
          <Text style={[styles.text, { color: textColor }]}>{item.service}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>

        <View style={[styles.accept, { marginBottom: hp('-0.8%') }]}>
          <CheckBox
            value={isChecked}
            style={styles.checkBox}
            onValueChange={setIsChecked}
            tintColors={{ true: theme.primary, false: inactiveColor }}
          />
<<<<<<< HEAD
          <Text style={[styles.text, { color: acceptedTextColor }]}>
            Accepted
          </Text>
=======
          <Text style={[styles.text, { color: acceptedTextColor }]}>Accepted</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        </View>
      </View>

      {/* Date */}
      <View style={styles.content}>
        <Image source={item.image[1]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: textColor }]}>
          Date :- {item.date}
        </Text>
=======
        <Text style={[styles.text, { color: textColor }]}>Date :- {item.date}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image source={item.image[2]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: textColor }]}>
          Time :- {item.time}
        </Text>
=======
        <Text style={[styles.text, { color: textColor }]}>Time :- {item.time}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>

      {/* Amount */}
      <View style={styles.content}>
        <Image source={item.image[3]} style={styles.icon} />
<<<<<<< HEAD
        <Text style={[styles.text, { color: textColor }]}>
          Amount :- ₹{item.price}
        </Text>
=======
        <Text style={[styles.text, { color: textColor }]}>Amount :- ₹{item.price}</Text>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '90%',
    minHeight: hp('20%'),
    marginVertical: hp('1.5%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
    gap: hp('1%'),
  },
  acceptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  text: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  accept: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('5%'),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  checkBox: {
    width: wp('4%'),
    height: wp('4%'),
  },
});

export default BookingAcceptCards;
