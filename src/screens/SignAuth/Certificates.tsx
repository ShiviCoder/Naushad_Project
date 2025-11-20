// File: Certificates.js
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  Animated, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Head from '../../components/Head';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../utils/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// ✅ Create a separate component for Certificate Card to use hooks properly
const CertificateCard = ({ item, index, theme, onPress }) => {
  const itemAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(itemAnim, {
      toValue: 1,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          transform: [
            { scale: itemAnim },
            { translateY: itemAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })}
          ],
          opacity: itemAnim,
          shadowColor: theme.dark ? '#000' : COLORS.primary,
        },
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        style={styles.cardTouchable}
      >
        {/* Certificate Badge */}
        <View style={[styles.badge, { backgroundColor: COLORS.primary }]}>
          <Icon name="verified" size={wp('3.5%')} color="#fff" />
          <Text style={styles.badgeText}>Certified</Text>
        </View>

        {/* Certificate Image with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image} 
            resizeMode="cover" 
          />
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
          
          {/* View Full Button */}
          <View style={styles.viewButton}>
            <Icon name="zoom-in" size={wp('4%')} color="#fff" />
            <Text style={styles.viewButtonText}>View</Text>
          </View>
        </View>

        {/* Certificate Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Icon name="workspace-premium" size={wp('5%')} color={COLORS.primary} />
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Icon name="date-range" size={wp('3.5%')} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="star" size={wp('3.5%')} color="#FFD700" />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                Achievement
              </Text>
            </View>
          </View>

          {/* Progress/Status Bar */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBar, { backgroundColor: theme.dark ? '#333' : '#e2e8f0' }]}>
              <View style={[styles.statusProgress, { backgroundColor: COLORS.primary }]} />
            </View>
            <Text style={[styles.statusText, { color: COLORS.primary }]}>Completed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Certificates = () => {
  const { theme } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('API Token: ', token);
    return token;
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch('https://naushad.onrender.com/api/certificates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      console.log('Certificate Response:', json);
      console.log('Certificate tokens ', token);
      setCertificates(json.data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    // Fade in animation when certificates load
    if (certificates.length > 0 && !loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [certificates, loading]);

  const onRefresh = async () => {
    setRefreshing(true);
    
    Animated.spring(translateY, {
      toValue: 60,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    await fetchCertificates();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setRefreshing(false);
  };

  const openCertificateModal = (item) => {
    setSelectedCertificate(item);
  };

  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  // ✅ Fixed renderItem function without hooks
  const renderItem = ({ item, index }) => (
    <CertificateCard 
      item={item} 
      index={index} 
      theme={theme} 
      onPress={() => openCertificateModal(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </Animated.View>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading your achievements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Head title="🏆 My Certificates" />
      
      <Animated.View 
        style={[
          styles.animatedContainer, 
          { 
            transform: [{ translateY }],
            opacity: fadeAnim 
          }
        ]}
      >
        {/* Header Stats */}
        {certificates.length > 0 && (
          <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                {certificates.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Certificates
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10b981' }]}>
                100%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Completion
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="workspace-premium" size={wp('6%')} color="#FFD700" />
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Achiever
              </Text>
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
              progressBackgroundColor={theme.card}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {certificates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Animated.View 
                style={[
                  styles.emptyIcon,
                  { 
                    backgroundColor: theme.dark ? '#333' : '#f1f5f9',
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <Icon name="workspace-premium" size={wp('20%')} color={theme.textSecondary} />
              </Animated.View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Certificates Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Your achievements and certificates will appear here
              </Text>
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: COLORS.primary }]}
                onPress={fetchCertificates}
              >
                <Text style={styles.refreshButtonText}>Check Again</Text>
                <Icon name="refresh" size={wp('4%')} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={certificates}
              keyExtractor={(item, index) => item.id?.toString() || `cert-${index}`}
              renderItem={renderItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </ScrollView>
      </Animated.View>

      {/* Certificate Modal (You can implement this later) */}
      {/* {selectedCertificate && (
        <CertificateModal 
          certificate={selectedCertificate}
          onClose={closeCertificateModal}
        />
      )} */}
    </SafeAreaView>
  );
};

export default Certificates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
  },
  animatedContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: wp('4%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    paddingVertical: hp('2%'),
    borderRadius: wp('5%'),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
  },
  statLabel: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
    marginTop: hp('0.5%'),
  },
  statDivider: {
    width: 1,
    height: hp('3%'),
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  listContent: {
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('10%'),
  },
  card: {
    marginBottom: hp('2.5%'),
    borderRadius: wp('6%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardTouchable: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: wp('4%'),
    right: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('3%'),
    zIndex: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: wp('2.8%'),
    fontFamily: 'Poppins-SemiBold',
    marginLeft: wp('1%'),
  },
  imageContainer: {
    position: 'relative',
    height: hp('22%'),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  viewButton: {
    position: 'absolute',
    bottom: wp('4%'),
    right: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1.5%'),
    borderRadius: wp('3%'),
  },
  viewButtonText: {
    color: '#fff',
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-SemiBold',
    marginLeft: wp('1%'),
  },
  content: {
    padding: wp('4%'),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  title: {
    flex: 1,
    fontSize: wp('4.2%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginLeft: wp('2%'),
    lineHeight: wp('4.8%'),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Medium',
    marginLeft: wp('1%'),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBar: {
    flex: 1,
    height: hp('0.6%'),
    borderRadius: wp('1%'),
    marginRight: wp('3%'),
    overflow: 'hidden',
  },
  statusProgress: {
    height: '100%',
    width: '100%',
    borderRadius: wp('1%'),
  },
  statusText: {
    fontSize: wp('3%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('15%'),
    paddingHorizontal: wp('10%'),
  },
  emptyIcon: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: hp('2.8%'),
    marginBottom: hp('4%'),
    color: '#6c757d',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('4%'),
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    marginRight: wp('2%'),
  },
});