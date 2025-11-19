import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
type TermsDoc = {
  _id: string;
  title: string;
  content: string;
  accepted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};
const STORAGE_KEY = '@termsAcceptance'; // stores: { termsId, updatedAt, accepted }
const TermsAndConditions = () => {
  const { theme } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [terms, setTerms] = useState<TermsDoc | undefined>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

   const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    console.log("token accept")
    return token;
  }

  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGY1YTA4YjQ5MDE1NDQ2NDdmZDY1ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MTI4MTc0NiwiZXhwIjoxNzYxODg2NTQ2fQ.bnP8K0nSFLCWuA9pU0ZIA2zU3uwYuV7_R58ZLW2woBg';
  const loadLocalAcceptance = useCallback(async (remote?: TermsDoc) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY); // { termsId, updatedAt, accepted }
      if (!raw) return setAccepted(false);
      const saved = JSON.parse(raw) as { termsId: string; updatedAt?: string; accepted: boolean };
      if (remote?._id && saved.termsId === remote._id) {
        // If server updatedAt changed, force re-consent
        if (remote.updatedAt && saved.updatedAt && remote.updatedAt !== saved.updatedAt) {
          return setAccepted(false);
        }
        return setAccepted(!!saved.accepted);
      }
      setAccepted(false);
    } catch {
      setAccepted(false);
    }
  }, []);
  const fetchTerms = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('https://naushad.onrender.com/api/terms-and-conditions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const doc: TermsDoc | undefined = data?.data;
      setTerms(doc);
      await loadLocalAcceptance(doc);
      console.log('Terms token : ',token)
      // console.log('Terms Data:', data);
    } catch (err) {
      // console.log('Error loading:', err);
      Alert.alert('Error', 'Unable to load Terms. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loadLocalAcceptance]);
  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);
  const persistLocalAcceptance = async (doc: TermsDoc, value: boolean) => {
     const token = await getToken();
    try {
      const payload = JSON.stringify({
        termsId: doc._id,
        updatedAt: doc.updatedAt ?? null,
        accepted: value,
      });
      await AsyncStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore
    }
  };
  const submitAcceptance = async () => {
     const token = await getToken();
    if (!terms) return;
    try {
      setSubmitting(true);
      // Optional: PATCH on your API to record acceptance against this terms._id
      // Ensure your backend stores acceptance per user (not mutating the master terms).
      // Endpoint here is illustrative; adjust to your backend route.
      await fetch(`https://naushad.onrender.com/api/terms-and-conditions/${terms._id}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accepted: true }),
      }).catch(() => { });
      await persistLocalAcceptance(terms, true);
      Alert.alert('Success', 'Thanks for accepting the Terms.');
    } catch {
      Alert.alert('Error', 'Could not save your acceptance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const lastUpdated =
    terms?.updatedAt ? new Date(terms.updatedAt).toLocaleDateString() : undefined;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="Terms And Conditions" />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.textPrimary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Title */}
          <Text style={[styles.heading, { color: theme.textPrimary }]}>
            {terms?.title?.trim()?.length ? terms.title : 'Terms & Conditions'}
          </Text>
          {!!lastUpdated && (
            <Text style={{ color: theme.textSecondary, marginBottom: hp('1.5%') }}>
              Last updated: {lastUpdated}
            </Text>
          )}
          {/* Sections */}
          <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
            <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Use of Services</Text>
            <Text style={[styles.text, { color: theme.textSecondary }]}>{terms?.content}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
            <Text style={[styles.subHeading, { color: theme.textPrimary }]}>User Responsibilities</Text>
            <Text style={[styles.text, { color: theme.textSecondary }]}>{terms?.content}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
            <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Limitation of Liability</Text>
            <Text style={[styles.text, { color: theme.textSecondary }]}>{terms?.content}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
            <Text style={[styles.subHeading, { color: theme.textPrimary }]}>Changes to Terms</Text>
            <Text style={[styles.text, { color: theme.textSecondary }]}>{terms?.content}</Text>
          </View>
          {/* Accept Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(prev => !prev)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, { borderColor: theme.textPrimary }]}>
              {accepted && <Icon name="checkmark" size={wp('4%')} color={COLORS.primary} />}
            </View>
            <Text style={[styles.checkboxText, { color: theme.textPrimary }]}>
              I have read and accept the Terms and Conditions
            </Text>
          </TouchableOpacity>
          {/* Continue / Accept Button */}
          <TouchableOpacity
            disabled={!accepted || submitting}
            onPress={submitAcceptance}
            style={[
              styles.acceptBtn,
              {
                backgroundColor:
                  !accepted || submitting ? COLORS.primary + '66' : COLORS.primary,
              },
            ]}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.acceptBtnText}>Accept & Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
export default TermsAndConditions;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: wp('5%'),
    paddingBottom: hp('4%'),
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  subHeading: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  text: {
    fontSize: wp('4%'),
    lineHeight: hp('2.8%'),
    textAlign: 'justify',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 2,
    borderRadius: 4,
    marginRight: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: wp('4%'),
    flexShrink: 1,
  },
  acceptBtn: {
    marginTop: hp('2.5%'),
    paddingVertical: hp('1.6%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '700',
  },
  card: {
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 3,
  },
});
