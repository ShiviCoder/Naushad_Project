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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
    totalWalletAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      console.log('API Response:', JSON.stringify(data, null, 2)); // Log full API response

      if (data.success) {
        const sortedTransactions = (data.data.transactions || []).sort(
          (a, b) => {
            return new Date(b.date) - new Date(a.date);
          },
        );

        setWalletData({
          transactions: sortedTransactions,
          totalWalletAmount: data.data.totalWalletAmount || 0,
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
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  const formatDateTime = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  const truncateText = (text, maxWords = 5) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const getPriceColor = color => {
    if (color === 'green') return COLORS.green;
    return COLORS.red;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const handleTransactionPress = transaction => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
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
            <Text style={styles.balanceAmount}>
              ₹ {walletData.totalWalletAmount.toLocaleString()}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('WalletAddMoneyScreen')}
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
              <Text style={styles.emptySubText}>
                Add money to see your transaction history
              </Text>
            </View>
          ) : (
            <FlatList
              data={walletData.transactions}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.transactionItem}
                  onPress={() => handleTransactionPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.leftRow}>
                    <Image
                      source={require('../../assets/wallet.png')}
                      style={styles.transactionIcon}
                    />
                    <View style={styles.transactionTextContainer}>
                      <Text style={styles.transactionTitle} numberOfLines={2}>
                        {truncateText(item.title, 5)}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDateTime(item.date)}
                      </Text>
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
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button inside primary color box */}
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {selectedTransaction && (
                <>
                  <View style={styles.modalIconContainer}>
                    <Image
                      source={require('../../assets/wallet.png')}
                      style={styles.modalTransactionIcon}
                    />
                  </View>

                  <Text style={styles.modalTransactionTitle}>
                    {selectedTransaction.title}
                  </Text>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Transaction ID</Text>
                    <Text style={styles.detailValue}>
                      {selectedTransaction._id || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.modalTransactionPrice}>
                      {selectedTransaction.price}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>
                      {formatDateTime(selectedTransaction.date)}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusSuccess}>Success</Text>
                    </View>
                  </View>

                  {/* Optional Additional Details */}
                  {selectedTransaction.description && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={styles.modalDescription}>
                        {selectedTransaction.description}
                      </Text>
                    </View>
                  )}

                  {selectedTransaction.reference && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Reference</Text>
                      <Text style={styles.detailValue}>
                        {selectedTransaction.reference}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
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
    flex: 1,
  },
  transactionTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexShrink: 1,
  },
  transactionIcon: {
    width: wp('7%'),
    height: wp('7%'),
    tintColor: COLORS.primary,
  },
  transactionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    lineHeight: wp('5%'),
  },
  transactionDate: {
    fontSize: wp('3.2%'),
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: wp('4%'),
    fontWeight: '700',
    marginLeft: wp('2%'),
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    marginHorizontal: wp('4%'),
    width: wp('92%'),
    height: hp('85%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1%'),
    alignItems: 'flex-end',
  },
  closeButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#fff',
  },
  closeButtonText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  modalScrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalScrollContent: {
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('5%'),
    paddingTop: hp('1%'),
  },
  modalIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: wp('4%'),
    marginBottom: hp('3%'),
    alignSelf: 'center',
  },
  modalTransactionIcon: {
    width: wp('12%'),
    height: wp('12%'),
    tintColor: '#fff',
  },
  modalTransactionTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('6%'),
  },
  detailSection: {
    marginBottom: hp('3%'),
  },
  detailLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: hp('0.5%'),
  },
  detailValue: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#fff',
  },
  modalTransactionPrice: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: hp('0.5%'),
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  statusSuccess: {
    fontSize: wp('3.5%'),
    color: '#fff',
    fontWeight: '700',
  },
  modalDescription: {
    fontSize: wp('3.8%'),
    color: '#fff',
    lineHeight: wp('5.5%'),
    opacity: 0.9,
  },
});

export default WalletScreen;
