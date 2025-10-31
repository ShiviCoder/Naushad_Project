import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeContext';

interface HeadProps {
  title: string;
  rightComponent?: React.ReactNode;
  showBack?: boolean; 
}

const Head: React.FC<HeadProps> = ({ title, rightComponent, showBack = true, onBackPress }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.head, { backgroundColor: theme.background }]}>
      {showBack && (
        <TouchableOpacity
          onPress={() => {
            if (onBackPress) onBackPress();
            else if (navigation.canGoBack()) navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={wp('7%')} color={theme.textPrimary} />
        </TouchableOpacity>
      )}  
      <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>

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
 