import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../context/ThemeContext'; // ✅ ThemeContext import

const Head: React.FC<{ title: string }> = ({ title }) => {
  const navigation = useNavigation();
  const { theme } = useTheme(); // ✅ theme now contains colors

  return (
    <View style={[styles.head, { backgroundColor: theme.background }]}>
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
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
    </View>
  );
};

export default Head;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  title: {
    fontSize: wp('5%'), 
    fontWeight: '700',
  },
  backButton: {
    left: wp('4%'),
    position: 'absolute',
  },
});
