import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
=======
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
import { useTheme } from '../context/ThemeContext';

interface HeadProps {
  title: string;
  rightComponent?: React.ReactNode;
<<<<<<< HEAD
  showBack?: boolean;
}

const Head: React.FC<HeadProps> = ({
  title,
  rightComponent,
  showBack = true,
}) => {
=======
  showBack?: boolean; 
}

const Head: React.FC<HeadProps> = ({ title, rightComponent, showBack = true }) => {
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.head, { backgroundColor: theme.background }]}>
      {/* Left - Back button */}
      {showBack && (
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={wp('7%')} color={theme.textPrimary} />
        </TouchableOpacity>
      )}

      {/* Center - Title */}
<<<<<<< HEAD
      <Text
        style={[styles.title, { color: theme.textPrimary }]}
        numberOfLines={1}
      >
=======
      <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
        {title}
      </Text>

      {/* Right - Custom button(s) */}
      <View style={styles.right}>{rightComponent}</View>
    </View>
  );
};

export default Head;

const styles = StyleSheet.create({
  head: {
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: wp('2%'),
    padding: 5,
  },
  right: {
    position: 'absolute',
    right: wp('2%'),
  },
});
<<<<<<< HEAD
=======
 
>>>>>>> ed4025b9ad386196f70fb049558ddda4e4b161ab
