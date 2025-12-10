import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import COLORS from '../../utils/Colors';
import Head from '../../components/Head';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const WalletScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState({
    transactions: [],
    totalWalletAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(refreshing ? false : true);
      const response = await fetch('https://naushad.onrender.com/api/wallet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        const sortedTransactions = (data.data.transactions || []).sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        
        setWalletData({
          transactions: sortedTransactions,
          totalWalletAmount: data.data.totalWalletAmount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const time = date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${day}/${month}/${year}, ${time}`;
  };

  // UPDATED: read API color key directly
  const getPriceColor = (color) => {
    if (color === "green") return COLORS.green;
    return COLORS.red;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  if (loading && walletData.transactions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Head title="Wallet" />
        <ScrollView 
          style={styles.loadingScroll}
          contentContainerStyle={styles.loadingContainer}
          showsVerticalScrollIndicator={false}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Head title="Wallet" />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          refreshing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : null
        }
        onRefresh={handleRefresh}
      >
        <View style={styles.container}>
          
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Image
                source={require('../../assets/wallet.png')}
                style={styles.walletIcon}
              />
              <Text style={styles.cardTitle}>Salon Wallet</Text>
            </View>

            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹ {walletData.totalWalletAmount.toLocaleString()}</Text>

            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => navigation.navigate("WalletAddMoneyScreen")}
              activeOpacity={0.8}
            >
              <Text style={styles.addText}>+ Add Money</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Transaction History</Text>
          
          {walletData.transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../../assets/wallet.png')}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubText}>Add money to see your transaction history</Text>
            </View>
          ) : (
            <FlatList
              data={walletData.transactions}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <View style={styles.leftRow}>
                    <Image
                      source={require('../../assets/wallet.png')}
                      style={styles.transactionIcon}
                    />
                    <View>
                      <Text style={styles.transactionTitle}>{item.title}</Text>
                      <Text style={styles.transactionDate}>{formatDateTime(item.date)}</Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: getPriceColor(item.color) },
                    ]}
                  >
                    {item.price}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: moderateScale(20),
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('5%'),
    backgroundColor: '#fff',
  },
  loadingScroll: {
    flex: 1,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('20%'),
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#666',
    fontWeight: '500',
    marginTop: hp('2%'),
  },
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: wp('6%'),
    marginBottom: hp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: wp('8%'),
    height: wp('8%'),
    tintColor: '#fff',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: wp('5%'),
    color: '#fff',
    fontWeight: '700',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: wp('3.8%'),
    marginTop: hp('2%'),
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: wp('9%'),
    fontWeight: 'bold',
    marginTop: hp('0.5%'),
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    alignSelf: 'flex-start',
    marginTop: hp('2%'),
  },
  addText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: wp('4%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fdfdfd',
    borderRadius: 20,
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    elevation: 2,
    shadowColor: '#ccc',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: COLORS.primary,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: wp('3.2%'),
    color: '#888',
  },
  transactionAmount: {
    fontSize: wp('4%'),
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: hp('8%'),
  },
  emptyIcon: {
    width: wp('12%'),
    height: wp('12%'),
    tintColor: '#ccc',
    marginBottom: hp('2%'),
  },
  emptyText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#666',
    marginBottom: hp('1%'),
  },
  emptySubText: {
    fontSize: wp('3.5%'),
    color: '#999',
    textAlign: 'center',
  },
});

export default WalletScreen;
