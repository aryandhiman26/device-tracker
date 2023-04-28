import React, {useEffect, useState} from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {COLORS} from '../Resources/Themes';

const AlertDialog = ({
  dialogTitle,
  showDialogBox,
  setShowDialogBox,
  dialogBoxType,
  dialogMessageText,
  confirmationFunction,
  data,
  otpSuccessCall,
  buttonType,
  screenType,
}) => {
  function showCustomAlert(visible) {
    setAlertVisible(visible);
  }

  function handleDialogBoxImage() {
    switch (dialogBoxType) {
      case 'Error':
        return require('../assets/rejected.png');
      case 'Confirmation':
        return require('../assets/accepted.png');
      case 'Alert':
        return require('../assets/accepted.png');
      case 'Success':
        return require('../assets/accepted.png');
      default:
        return require('../assets/accepted.png');
    }
  }
  function confirmationCall() {
    setShowDialogBox(false);
    confirmationFunction(data);
  }
  function otpConfirmation() {
    setShowDialogBox(false);
    otpSuccessCall();
  }
  function closeDialog() {
    setTimeout(() => setShowDialogBox(false), 0);
  }

  return (
    <View>
      {Platform.OS === 'ios' && showDialogBox && screenType === 'sign_in' ? (
        Alert.alert(
          dialogBoxType,
          dialogMessageText,
          dialogBoxType === 'Confirmation'
            ? [
                {
                  text: buttonType === 'YesNo' ? 'No' : 'Cancel',
                  onPress: () => closeDialog(),
                },
                {
                  text: buttonType === 'YesNo' ? 'Yes' : 'OK',
                  onPress: () => {
                    dialogBoxType === 'Success'
                      ? otpConfirmation()
                      : dialogBoxType === 'Confirmation'
                      ? confirmationCall()
                      : closeDialog();
                  },
                },
              ]
            : [
                {
                  text: buttonType === 'YesNo' ? 'Yes' : 'OK',
                  onPress: () => {
                    dialogBoxType === 'Success'
                      ? otpConfirmation()
                      : dialogBoxType === 'Confirmation'
                      ? confirmationCall()
                      : closeDialog();
                  },
                },
              ],
        )
      ) : (
        <Modal
          visible={showDialogBox}
          transparent={true}
          animationType={'fade'}>
          {/* onRequestClose={() => showCustomAlert(!alertVisible)}> */}

          <View style={styles.container}>
            <View style={styles.Alert_Main_View}>
              {/* <Image
                source={handleDialogBoxImage()}
                resizeMode="contain"
                style={styles.dialogIcon}
              /> */}
              <Text style={styles.dialogTitle}>{dialogTitle}</Text>

              <Text style={styles.Alert_Message}>{dialogMessageText}</Text>

              <View style={styles.ButtonView}>
                {dialogBoxType === 'Confirmation' ? (
                  <TouchableOpacity
                    style={styles.buttonStyleCancel}
                    onPress={() => setShowDialogBox(false)}
                    activeOpacity={0.7}>
                    <Text style={styles.textStyle}>
                      {buttonType === 'YesNo' ? 'No' : 'Cancel'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  style={styles.buttonStyleOk}
                  onPress={() => {
                    dialogBoxType === 'Success'
                      ? otpConfirmation()
                      : dialogBoxType === 'Confirmation'
                      ? confirmationCall()
                      : closeDialog();
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.textStyle}>
                    {buttonType === 'YesNo' ? 'Yes' : 'OK'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default AlertDialog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000AA',
  },
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    backgroundColor: '#000000',
  },

  dialogIcon: {
    width: 100,
    height: 100,
  },

  Alert_Main_View: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    width: '85%',
    //borderWidth: 2,
    //borderColor: COLORS.GREY_DARK,
    borderRadius: 7,
  },

  Alert_Message: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    textAlign: 'center',
    padding: 10,
  },
  ButtonView: {
    flexDirection: 'row',
    marginBottom: 8,
    marginHorizontal: 10,
    justifyContent: 'space-around',
  },

  buttonStyleCancel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GREY,
    borderColor: COLORS.GREY_DARK,
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    padding: 8,
    width: '38%',
  },
  buttonStyleOk: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightAppBlue,
    borderColor: COLORS.appBlueColor,
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    padding: 8,
    width: '38%',
  },

  textStyle: {
    color: COLORS.GREY_DARK,
    textAlign: 'center',
    fontSize: 14,
  },
  dialogTitle: {
    fontSize: 22,
    margin: 15,
    color: COLORS.appBlueColor,
    fontWeight: 'bold',
  },
});
