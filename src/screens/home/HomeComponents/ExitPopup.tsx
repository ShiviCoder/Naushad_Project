import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import COLORS from '../../../utils/Colors';

const ExitPopup = ({ visible, onClose, onExit }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.message}>Are you sure you want to exit?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
            >
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp('80%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    borderRadius: wp('4%'),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignItems: 'center',
  },
  message: {
    fontSize: wp('4%'),
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5%'),
    fontFamily: 'Poppins-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: wp('5%'),
  },
  button: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('3%'),
    minWidth: wp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  exitButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins-Medium',
  },
  exitButtonText: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});

export default ExitPopup;
