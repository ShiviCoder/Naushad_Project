import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const BookingPendingCard = ({ item }) => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ get current theme

  return (
    <TouchableOpacity
      style={styles.container} // background unchanged
      onPress={() => navigation.navigate('BookingPending')}
    >
      {/* Service + Pending Status */}
      <View style={styles.pendingContainer}>
        <View style={[styles.content, { marginBottom: hp('-0.8%') }]}>
          <Image style={styles.icon} source={item.image[0]} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            {item.service}
          </Text>
        </View>

        <View
          style={[styles.content, { gap: wp('0%'), marginBottom: hp('-0.8%') }]}
        >
          <Image style={styles.icon} source={item.image[4]} />
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Pending
          </Text>
        </View>
      </View>

      {/* Date */}
      <View style={[styles.content, { marginVertical: hp('-0.2%') }]}>
        <Image style={styles.icon} source={item.image[1]} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Date :- {item.date}
        </Text>
      </View>

      {/* Time */}
      <View style={styles.content}>
        <Image style={styles.icon} source={item.image[2]} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Time :- {item.time}
        </Text>
      </View>

      {/* Amount */}
      <View style={styles.content}>
        <Image style={styles.icon} source={item.image[3]} />
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Amount :- ₹{item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#ACACAC8A', // ✅ unchanged
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
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  icon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  text: {
    fontSize: wp('3.5%'),
    color: '#000', // fallback
    fontWeight: '500',
  },
});

export default BookingPendingCard;
