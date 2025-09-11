import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Head:React.FC<{title: string}> = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.head}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Icon name="chevron-back" size={30}></Icon>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Head;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 700
  },
  backButton: {
    left: 15,
    position: 'absolute'
  }
});
