import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonHeader from '../CommonComponents/CommonHeader';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Assets} from '../Resources/Assets';
import {BASE_URL} from '../constants/constants';
import axios from 'axios';
import Loader from '../CommonComponents/Loader';
import {SimpleAlertDialog} from '../CommonComponents/SimpleAlertDialog';
import AlertDialog from '../CommonComponents/AlertDialog';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const ProfileScreen = ({navigation, route}) => {
  const {userInfo} = route?.params;
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState({});
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [dialogBoxType, setdialogBoxType] = React.useState('');
  const [dialogMessageText, setdialogMessageText] = React.useState('');
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);

  useEffect(() => {
    if (isFocused) getUserDetails();
  }, [isFocused]);

  const getUserDetails = async () => {
    const userDetails = await EncryptedStorage.getItem('user_details');
    const userDetailsParsed = await JSON.parse(userDetails);
    setUserData(userDetailsParsed);
    try {
      setLoading(true);
      const url = `${BASE_URL}/all-devices?userId=${userDetailsParsed?.userId}`;
      const response = await axios.get(url);
      if (response?.data?.success) {
        const devicelistData = response?.data?.data;
        setCount(devicelistData?.length);
      } else {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };
  const openAlertDialog = () => {
    setShowAlertDialog(true);
    setdialogBoxType('Confirmation');
    setdialogMessageText('Are your sure you want to logout?');
    setShowLogoutDialog(true);
  };
  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword', {userInfo: userInfo});
  };
  const navigateToAssignedDevices = () => {
    navigation.navigate('DevicesList', {type: 'allDevices'});
  };
  const navigateToAddNewDevice = () => {
    navigation.navigate('AddNewDevice', {userInfo: userInfo});
  };
  const navigateToAddNewUser = () => {
    navigation.navigate('AddNewUser', {userInfo: userInfo});
  };
  const navigateToLogout = async () => {
    setLoading(true);
    try {
      console.log('uiokj');
      const fcmToken = await messaging().getToken();
      const body = {
        userId: userInfo?.id,
        deviceToken: fcmToken,
      };
      console.log(body);
      const response = await axios.post(`${BASE_URL}/logout`, body);
      if (response?.data?.success) {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        setShowLogoutDialog(false);
        await AsyncStorage.clear();
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView>
      <CommonHeader
        navigation={navigation}
        title={'Profile'}
        isBackButton={true}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.titleText}>User Details</Text>
        <View style={styles.viewTwoColumn}>
          <View style={styles.viewInnerColumn}>
            <Text style={styles.titleText2}>User Name</Text>
            <Text style={styles.bodyTextDarkGrey}>{userInfo?.name}</Text>
          </View>
          <View style={styles.viewInnerColumn}>
            <Text style={styles.titleText2}>Mobile No.</Text>
            <Text style={styles.bodyTextDarkGrey}>{userInfo?.mob}</Text>
          </View>
        </View>
        <View style={styles.underline}></View>
        <View style={styles.viewOneColumn}>
          <Text style={styles.titleText2}>Address</Text>
          <Text style={styles.bodyTextDarkGrey}>{userInfo?.addr}</Text>
        </View>
      </View>
      {userInfo?.typ === 'admin' && (
        <View style={styles.innerContainer2}>
          <TouchableOpacity
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={navigateToAddNewUser}>
            <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
              ADD NEW USER
            </Text>
            <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
          </TouchableOpacity>
        </View>
      )}
      {(userInfo?.typ === 'user' || userInfo?.typ === 'admin') && (
        <View style={styles.innerContainer2}>
          <TouchableOpacity
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={navigateToAddNewDevice}>
            <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
              ADD NEW DEVICE
            </Text>
            <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.innerContainer2}>
        <TouchableOpacity
          style={{
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={navigateToAssignedDevices}>
          <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
            {`ASSIGNED DEVICES (${count})`}
          </Text>
          <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer2}>
        <TouchableOpacity
          style={{
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={navigateToChangePassword}>
          <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
            CHANGE PASSWORD
          </Text>
          <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer2}>
        <View style={styles.underline}></View>
        <TouchableOpacity
          style={{
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
            CALIBRATE DEVICES
          </Text>
          <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
      <View style={styles.innerContainer2}>
        <View style={styles.underline}></View>
        <TouchableOpacity
          style={{
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={openAlertDialog}>
          <Text style={{color: COLORS.DARK_GREY, fontWeight: 'bold'}}>
            LOGOUT
          </Text>
          <Image source={Assets.rightArrow} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
      <AlertDialog
        dialogTitle={'Logout'}
        showDialogBox={showAlertDialog}
        setShowDialogBox={setShowAlertDialog}
        dialogBoxType={dialogBoxType}
        dialogMessageText={dialogMessageText}
        confirmationFunction={navigateToLogout}
        buttonType={'YesNo'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.DARK_GREY,
    paddingTop: 3,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GREY,
  },
  innerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  innerContainer2: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  viewOneColumn: {
    marginVertical: 10,
  },
  underline: {
    backgroundColor: COLORS.LIGHT_GREY,
    height: 1,
  },
  underline2: {
    backgroundColor: COLORS.DARK_GREY,
    height: 1,
  },
  viewTwoColumn: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  viewInnerColumn: {
    flex: 1,
  },
  titleText2: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.appBlueColor,
  },
  bodyTextDarkGrey: {
    fontSize: 14,
    color: COLORS.DARK_GREY,
  },
});

export default ProfileScreen;
