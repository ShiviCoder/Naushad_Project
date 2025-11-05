import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Head from '../../components/Head';
import RadioButton from '../../components/RadioButton';
import COLORS from '../../utils/Colors';
import { useTheme } from '../../context/ThemeContext';
import Popup from '../../components/PopUp';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = size => (width / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteAccount = () => {
    setShowPopup(true);
  };

  const confirmDelete = () => {
    setShowPopup(false);
    console.log('✅ Account deletion initiated');
    // add your delete logic here
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Head title="Settings" />

      <View style={styles.container}>
        {/* Theme Toggle */}
        <View
          style={[
            styles.settingItem
          ]}
        >
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Dark Theme
          </Text>
          <RadioButton
            type="toggle"
            selected={theme.background === '#121212'}
            labels={[
              <Image
                source={require('../../assets/sun.png')}
                style={[styles.themeIcon, { tintColor: COLORS.primary }]}
              />,
              <Image
                source={require('../../assets/moon.png')}
                style={[styles.themeIcon, { tintColor: COLORS.primary }]}
              />,
            ]}
            onSelect={isDark => {
              const value = isDark ? 'Dark' : 'Light';
              toggleTheme(value);
            }}
          />
        </View>

        {/* Delete Account */}
        <View
          style={[
            styles.settingItem,
          ]}
        >
          <Text style={[styles.text, { color: theme.textPrimary }]}>
            Delete Account
          </Text>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

       <Modal
             visible={showPopup}
             transparent
             animationType="fade"
             onRequestClose={() => setShowPopup(false)}
           >
             <View style={styles.overlay}>
               <View style={styles.popup}>
                 <Text style={styles.popupTitle}>Delete Account</Text>
                 <Text style={styles.popupMessage}>
                   Are you sure you want to delete account?
                 </Text>
                 <View style={styles.popupActions}>
                   <TouchableOpacity
                     onPress={() => setShowPopup(false)}
                     style={[styles.popupBtn, styles.cancelBtn]}
                   >
                     <Text style={styles.cancelText}>Cancel</Text>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={[styles.popupBtn, styles.logoutBtn]}
                   >
                     <Text style={styles.logoutText}>Delete</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingTop: moderateScale(20) },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  text: { fontSize: moderateScale(16) },
  deleteButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(25),
    borderRadius: moderateScale(5),
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  themeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  // Popup inner styles
  popupTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  popupText: {
    fontSize: moderateScale(14),
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
    fontSize: 15,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
   overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  popupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: COLORS.primary,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;
