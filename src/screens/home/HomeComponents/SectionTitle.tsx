import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

// Create a simple SectionTitle component to avoid import issues
const SectionTitle = ({ title, onPress, showSeeAll = true, color }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: color || '#000' }]}>
        {title}
      </Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    fontFamily: 'Poppins-Medium',
  },
  seeAll: {
    fontWeight: '600',
    fontSize: wp('3.8%'),
    color: COLORS.primary,
  },
});

export default SectionTitle;
