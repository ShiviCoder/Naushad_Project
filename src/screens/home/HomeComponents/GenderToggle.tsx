import React from 'react';
import { View, StyleSheet } from 'react-native';
import RadioButton from '../../../components/RadioButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const GenderToggle = ({ gender, onGenderChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      <RadioButton
        type="gender"
        selected={gender}
        onSelect={onGenderChange}
        labels={['Male', 'Female']}
        values={['male', 'female']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp('1%'),
  },
});

export default GenderToggle;
