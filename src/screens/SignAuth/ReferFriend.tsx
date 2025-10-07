import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ReferFriend = () => {
  const { theme } = useTheme();
  const [friendEmail, setFriendEmail] = useState('');
  const referralCode = 'REF12345'; // Demo referral code

  const handleShareCode = () => {
    if (friendEmail.trim() === '') {
      Alert.alert('Error', 'Please enter your friend\'s email.');
      return;
    }
    Alert.alert(
      'Referral Sent',
      `Referral code ${referralCode} sent to ${friendEmail}!`
    );
    setFriendEmail('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Refer Friend" />

      <View style={styles.contentContainer}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          Invite your friends!
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Share your referral code:
        </Text>
        <View style={[styles.codeContainer, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
          <Text style={[styles.codeText, { color: theme.textPrimary }]}>{referralCode}</Text>
        </View>

        <Text style={[styles.label, { color: theme.textSecondary, marginTop: hp('2%') }]}>
          Or enter your friend's email to send code directly:
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.dark ? '#222' : '#fff', color: theme.textPrimary }]}
          placeholder="Friend's email"
          placeholderTextColor={theme.dark ? '#888' : '#aaa'}
          value={friendEmail}
          onChangeText={setFriendEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: '#F6B745' }]} onPress={handleShareCode}>
          <Text style={styles.buttonText}>Send Referral</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
  },
  heading: {
    fontSize: wp('5.5%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('4%'),
    marginBottom: hp('1%'),
  },
  codeContainer: {
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  codeText: {
    fontSize: wp('5%'),
    fontWeight: '700',
  },
  input: {
    height: hp('6%'),
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    fontSize: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    height: hp('6%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#fff',
  },
});
