import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
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

const ChangePasswordScreen = ({navigation, route}) => {
  const {userInfo} = route?.params;
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 7000);
    }
  }, [loading]);

  const handleChangePassword = async () => {
    if (currentPassword.length < 1) {
      // ToastAndroid.show('Current password is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Current password is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (newPassword.length < 1) {
      // ToastAndroid.show('New password is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'New password is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (confirmPassword != newPassword) {
      // ToastAndroid.show(
      //   "New password and Confirm passowrd does't matches.",
      //   ToastAndroid.SHORT,
      // );
      Toast.show({type:'error', text1:"New password and Confirm passowrd does't matches.",autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }

    try {
      setLoading(true);
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      const body = {
        user_id: userDetailsParsed?.userId,
        old_password: currentPassword,
        new_password: newPassword,
      };
      const response = await axios.patch(`${BASE_URL}/change-password`, body);

      if (response?.data?.success) {
        // ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        Toast.show({type:'error', text1:response?.data?.message,autoHide:true, visibilityTime:3000,position:'bottom'});
        navigation.navigate('Profile', {userInfo: userInfo});
      } else {
        // ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        Toast.show({type:'error', text1:response?.data?.message,autoHide:true, visibilityTime:3000,position:'bottom'});
      }
    } catch (error) {
      // ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Something went wrong',autoHide:true, visibilityTime:3000,position:'bottom'});
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        navigation={navigation}
        title={'Change Password'}
        isBackButton={true}
      />
      <View style={styles.innerContainer}>
        <View style={styles.signInForm}>
          <Text
            style={{
              color: COLORS.appBlueColor,
              fontSize: 14,
              marginBottom: 8,
              marginLeft: 2,
              fontWeight: '600',
              marginTop: 10,
            }}>
            Current Password
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setCurrentPassword}
            value={currentPassword}
            placeholder="Enter current password"
            // placeholderTextColor={COLORS.LIGHT_GREY}
            cursorColor={COLORS.DARK_GREY}
            secureTextEntry={true}
          />

          <Text
            style={{
              color: COLORS.appBlueColor,
              fontSize: 14,
              marginBottom: 8,
              marginLeft: 2,
              fontWeight: '600',
              marginTop: 25,
            }}>
            New Password
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewPassword}
            value={newPassword}
            placeholder="Enter new password"
            //placeholderTextColor={COLORS.LIGHT_GREY}
            cursorColor={COLORS.DARK_GREY}
            secureTextEntry={true}
          />
          <Text
            style={{
              color: COLORS.appBlueColor,
              fontSize: 14,
              marginBottom: 8,
              marginLeft: 2,
              fontWeight: '600',
              marginTop: 25,
            }}>
            Confirm Password
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Enter confirm password"
            //placeholderTextColor={COLORS.LIGHT_GREY}
            cursorColor={COLORS.DARK_GREY}
            secureTextEntry={true}
          />
          <View style={styles.button}>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={handleChangePassword}
              style={{
                flexDirection: 'row',
                backgroundColor: COLORS.appBlueColor,
                padding: 10,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              {/* <Image
                source={require('../assets/sign_in_icon.png')}
                resizeMode="contain"
                style={{height: 20, width: 20, marginRight: 5}}
              /> */}
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast/>
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
    marginTop: 50,
    width: '100%',
  },
});
export default ChangePasswordScreen;
