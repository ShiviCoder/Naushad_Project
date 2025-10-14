import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppVersion = () => {
  const { theme } = useTheme();
  const appVersion = '1.0.3'; // yahan actual version bhi dynamically la sakte ho

  const handleUpdate = () => {
    Alert.alert('Update', 'Redirecting to the app store to update...');
    // Yahan aap linking se Play Store/App Store ka link bhi add kar sakte ho
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="App Version" />
      <View style={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>Current App Version</Text>
        <Text style={[styles.version, { color: theme.textSecondary }]}>{appVersion}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Keep your app updated to enjoy the latest features, improvements, and bug fixes.
        </Text>
        <TouchableOpacity
          style={[styles.updateButton, { backgroundColor: theme.dark ? '#42BA86' : '#F6B745' }]}
          onPress={handleUpdate}
        >
          <Text style={styles.updateText}>Check for Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default AppVersion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  version: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  description: {
    fontSize: wp('4%'),
    lineHeight: hp('2.5%'),
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  updateButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('3%'),
  },
  updateText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
