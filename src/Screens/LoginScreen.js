import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../Resources/Themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BASE_URL} from '../constants/constants';
import {ProgressBar} from 'react-native-paper';
import Loader from '../CommonComponents/Loader';
import NotificationController from '../constants/NotificationController.android';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [fcmDeviceToken, setFcmDeviceToken] = useState('');

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      setFcmDeviceToken(fcmToken);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleSignInPress = async () => {
    if (username.length < 1) {
      ToastAndroid.show('Username is required', ToastAndroid.SHORT);
      return;
    }
    if (password.length < 1) {
      ToastAndroid.show('Password is required', ToastAndroid.SHORT);
      return;
    }
    const body = {
      username: username,
      password: password,
      deviceToken: fcmDeviceToken,
    };
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/login`, body);

      if (response?.data?.success) {
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        try {
          await AsyncStorage.setItem(
            'user_id',
            String(response?.data?.data?.id),
          );
        } catch (e) {
          ToastAndroid.show(e, ToastAndroid.SHORT);
        }
        navigation.reset({
          index: 0,
          routes: [
            {name: 'Dashboard', params: {userId: response?.data?.data?.id}},
          ],
        });
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logoStyle}
          source={require('../assets/main_logo_2.png')}
          resizeMode="contain"
        />
        <Text
          style={{
            color: COLORS.appBlueColor,
            fontSize: 26,
            fontWeight: 'bold',
            marginLeft: 20,
          }}>
          Device Tracker
        </Text>
      </View>
      <View style={styles.footer}>
        <View>
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
            Sign In
          </Text>
          <View style={styles.signInForm}>
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                marginBottom: 8,
                marginLeft: 2,
                fontWeight: '600',
                marginTop: 10,
              }}>
              Username
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Enter Username"
              placeholderTextColor={'#f6f6f6'}
              cursorColor="#fff"
            />

            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                marginBottom: 8,
                marginLeft: 2,
                fontWeight: '600',
                marginTop: 25,
              }}>
              Password
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Enter Password"
              placeholderTextColor={'#f6f6f6'}
              cursorColor="#fff"
              secureTextEntry={true}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={handleSignInPress}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 10,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <Image
                source={require('../assets/sign_in_icon.png')}
                resizeMode="contain"
                style={{height: 20, width: 20, marginRight: 5}}
              />
              <Text
                style={{
                  color: COLORS.appBlueColor,
                  fontWeight: '600',
                  fontSize: 16,
                  marginLeft: 5,
                }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button2}>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={handleRegisterPress}
              style={{
                flexDirection: 'row',
                borderColor: '#fff',
                borderWidth: 1,
                padding: 10,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <Image
                source={require('../assets/register.jpeg')}
                resizeMode="contain"
                style={{height: 20, width: 20, marginRight: 5}}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: '600',
                  fontSize: 16,
                  marginLeft: 5,
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}>
          <Text style={styles.versionText}>
            Version : {require('../../package.json').version}
          </Text>
        </View>
      </View>
      <Loader loading={loading} loaderColor={'#fff'} />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  signInButtonStyle: {
    color: COLORS.appBlueColor,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flex: 1.3,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    //paddingBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flex: 3,
    backgroundColor: COLORS.appBlueColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 30,
    justifyContent: 'space-between',
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  signInForm: {
    marginTop: 20,
  },

  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  forgot_password: {
    textAlign: 'right',
    marginTop: 10,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  button2: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  versionText: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 13,
  },
  logoStyle: {
    height: 50,
    width: 50,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
  },
});
