import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonHeader from '../CommonComponents/CommonHeader';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BASE_URL} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import Toast from 'react-native-toast-message';

const AddNewDeviceScreen = ({navigation, route}) => {
  const {userInfo} = route?.params;
  const [emailId, setEmailId] = React.useState('');
  const [deviceSerialNo, setDeviceSerialNo] = React.useState('');
  const [deviceName, setDeviceName] = React.useState('');
  const [deviceMac, setDeviceMac] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [isSerialNoDisabled, setIsSerialNoDisabled] = useState(false);

  const handleSubmitButton = async () => {
    if (userInfo?.typ === 'admin' && emailId.length < 1) {
      // ToastAndroid.show('User ID/ Email ID is required', ToastAndroid.SHORT);
      Toast.show({
        type: 'error',
        text1: 'User ID/ Email ID is required',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }
    if (deviceSerialNo.length < 1) {
      // ToastAndroid.show('Device serial no. is required', ToastAndroid.SHORT);
      Toast.show({
        type: 'error',
        text1: 'Device serial no. is required',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }
    if (deviceName.length < 1) {
      // ToastAndroid.show('Device name is required', ToastAndroid.SHORT);
      Toast.show({
        type: 'error',
        text1: 'Device name is required',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }
    if (deviceMac.length < 1) {
      // ToastAndroid.show('Device MAC is required', ToastAndroid.SHORT);
      Toast.show({
        type: 'error',
        text1: 'Device MAC is required',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      const body = {
        user_id: emailId,
        device_id: deviceSerialNo,
        device_mac: deviceMac,
        device_name: deviceName,
      };

      const response = await axios.post(
        `${BASE_URL}/device?userId=${userDetailsParsed?.userId}`,
        body,
      );

      if (response?.data?.success) {
        // ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
          autoHide: true,
          visibilityTime: 3000,
          position: 'bottom',
        });
        navigation.navigate('Profile', {userInfo: userInfo});
      } else {
        // ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
          autoHide: true,
          visibilityTime: 3000,
          position: 'bottom',
        });
      }
    } catch (error) {
      // ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextButton = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/search-devices?deviceId=${deviceSerialNo}`;
      const response = await axios.get(url);
      console.log(response?.data);
      if (response?.data?.success) {
        setDeviceMac(response?.data?.data?.mac);
        setIsSerialNoDisabled(true);
      } else {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
          autoHide: true,
          visibilityTime: 3000,
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        autoHide: true,
        visibilityTime: 3000,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        navigation={navigation}
        title={'Add New Device'}
        isBackButton={true}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.signInForm}>
            <View
              style={{opacity: isSerialNoDisabled ? 0.4 : 1}}
              pointerEvents={isSerialNoDisabled ? 'none' : 'auto'}>
              <Text
                style={{
                  color: COLORS.appBlueColor,
                  fontSize: 14,
                  marginBottom: 8,
                  marginLeft: 2,
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                Device Serial No.
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={setDeviceSerialNo}
                value={deviceSerialNo}
                placeholder="Enter device serial no."
                cursorColor={COLORS.DARK_GREY}
              />
              <View style={styles.button}>
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={handleNextButton}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.appBlueColor,
                    padding: 7,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: 14,
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isSerialNoDisabled && (
              <>
                {userInfo?.typ === 'admin' && (
                  <>
                    <Text
                      style={{
                        color: COLORS.appBlueColor,
                        fontSize: 14,
                        marginBottom: 8,
                        marginLeft: 2,
                        fontWeight: '600',
                        marginTop: 10,
                      }}>
                      User ID/ Email ID
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setEmailId}
                      value={emailId}
                      placeholder="Enter User id/ Email id"
                      cursorColor={COLORS.DARK_GREY}
                    />
                  </>
                )}
                <View style={{opacity: 0.4}} pointerEvents={'none'}>
                  <Text
                    style={{
                      color: COLORS.appBlueColor,
                      fontSize: 14,
                      marginBottom: 8,
                      marginLeft: 2,
                      fontWeight: '600',
                      marginTop: 25,
                    }}>
                    Device MAC
                  </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setDeviceMac}
                    value={deviceMac}
                    placeholder="Enter device mac"
                    //placeholderTextColor={COLORS.LIGHT_GREY}
                    cursorColor={COLORS.DARK_GREY}
                  />
                </View>
                <Text
                  style={{
                    color: COLORS.appBlueColor,
                    fontSize: 14,
                    marginBottom: 8,
                    marginLeft: 2,
                    fontWeight: '600',
                    marginTop: 25,
                  }}>
                  Device name
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setDeviceName}
                  value={deviceName}
                  placeholder="Enter device name"
                  //placeholderTextColor={COLORS.LIGHT_GREY}
                  cursorColor={COLORS.DARK_GREY}
                />
                <View style={styles.button}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    onPress={handleSubmitButton}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: COLORS.appBlueColor,
                      padding: 10,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: 16,
                      }}>
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <Toast />
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  signInForm: {
    marginTop: 1,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.DARK_GREY,
    borderRadius: 5,
    color: COLORS.DARK_GREY,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
});

export default AddNewDeviceScreen;
