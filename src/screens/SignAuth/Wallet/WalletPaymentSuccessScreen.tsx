import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const { width, height } = Dimensions.get('window');

const WalletPaymentSuccessScreen = ({ navigation, route }) => {
  const { amount, paymentId, orderId, transactionDate } = route.params || {};
  
  const [newBalance, setNewBalance] = useState(2340.50);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Handle physical back button press
  const handleBackPress = useCallback(() => {
    navigation.replace('MainTabs');
    return true; // Prevent default back behavior
  }, [navigation]);
  
  useEffect(() => {
    // Calculate new balance
    if (amount) {
      setNewBalance(prev => prev + amount);
    }
    
    // Start animations after a small delay
    const timer = setTimeout(() => {
      Animated.parallel([
        // Scale animation for check mark
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        // Fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        // Slide up animation
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
    
    // Add back handler - Fixed for React Native 0.72+
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      clearTimeout(timer);
      // Proper cleanup for new BackHandler API
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [handleBackPress]);
  
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleString('en-IN');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatTransactionId = (id) => {
    if (!id) return 'N/A';
    return `${id.substring(0, 10)}...${id.substring(id.length - 6)}`;
  };
  
  // Scale transform for success circle
  const circleScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });
  
  const circleOpacity = fadeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0.1],
  });
  
  const checkScale = scaleAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1.1, 1],
  });
  
  const handleGoToHome = () => {
    navigation.replace('MainTabs');
  };
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header with gradient */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment Successful</Text>
          <Text style={styles.headerSubtitle}>Wallet recharge completed successfully</Text>
        </View>
        
        {/* Success Animation - Reduced space */}
        <View style={styles.animationContainer}>
          <Animated.View 
            style={[
              styles.successCircle,
              {
                transform: [{ scale: circleScale }],
                opacity: circleOpacity,
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.checkContainer,
              {
                transform: [{ scale: checkScale }],
              }
            ]}
          >
            <Image
              source={require('../../../assets/sucess.png')}
              style={styles.checkIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
        
        {/* Amount Added - Proper alignment */}
        <Animated.View 
          style={[
            styles.amountContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.amountLabel}>Amount Credited</Text>
          <Text style={styles.amountValue}>₹ {amount?.toLocaleString('en-IN') || '0'}</Text>
        </Animated.View>
        
        {/* Transaction Details */}
        <Animated.View 
          style={[
            styles.detailsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.detailsTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{formatTransactionId(paymentId)}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{formatTransactionId(orderId)}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{formatDate(transactionDate)}</Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Action Buttons - Only Go to Home */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            style={styles.goHomeButton}
            onPress={handleGoToHome}
            activeOpacity={0.8}
          >
            <Text style={styles.goHomeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp('3%'),
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: hp('7%'),
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('6%'),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    marginBottom: hp('0%'),
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: '800',
    color: '#fff',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: wp('4%'),
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('0%'),
    height: hp('15%'),
    position: 'relative',
  },
  successCircle: {
    width: wp('35%'),
    height: wp('35%'),
    borderRadius: wp('17.5%'),
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    position: 'absolute',
  },
  checkContainer: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { 
      width: 0, 
      height: hp('0.5%') 
    },
    shadowOpacity: 0.4,
    shadowRadius: wp('3%'),
    elevation: 8,
  },
  checkIcon: {
    width: '60%',
    height: '60%',
    tintColor: '#fff',
  },
  amountContainer: {
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    paddingHorizontal: wp('6%'),
  },
  amountLabel: {
    fontSize: wp('4%'),
    color: '#666',
    marginBottom: hp('0.8%'),
    fontWeight: '600',
  },
  amountValue: {
    fontSize: wp('9%'),
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  detailsCard: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: wp('5%'),
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: hp('0.3%') 
    },
    shadowOpacity: 0.05,
    shadowRadius: wp('1.5%'),
    elevation: 2,
  },
  detailsTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  detailLabel: {
    fontSize: wp('3.8%'),
    color: '#666',
    flex: 1,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: wp('3.8%'),
    color: '#333',
    fontWeight: '600',
    flex: 1.2,
    textAlign: 'right',
    paddingLeft: wp('2%'),
  },
  separator: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginVertical: hp('1%'),
    marginHorizontal: wp('-2%'),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2.5%'),
  },
  statusDot: {
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('0.9%'),
    backgroundColor: '#4CAF50',
    marginRight: wp('1.8%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    color: '#4CAF50',
    fontWeight: '700',
  },
  buttonContainer: {
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  goHomeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    shadowColor: COLORS.primary,
    shadowOffset: { 
      width: 0, 
      height: hp('0.3%') 
    },
    shadowOpacity: 0.2,
    shadowRadius: wp('1.5%'),
    elevation: 3,
  },
  goHomeButtonText: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '700',
  },
  bottomSpacer: {
    height: hp('1%'),
  },
});

export default WalletPaymentSuccessScreen;