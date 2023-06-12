import React, {useEffect, useState} from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BASE_URL} from '../constants/constants';
import axios from 'axios';
import Loader from '../CommonComponents/Loader';
import {COLORS} from '../Resources/Themes';
import {useIsFocused} from '@react-navigation/native';
import {useAuth} from '../constants/useAuth';

const heightMain = Dimensions.get('screen').height;
const widthMain = Dimensions.get('screen').width;

const SplashScreen = ({navigation, route}) => {
  const {notificationData, setNotificationData} = useAuth();

  const width = new Animated.Value(widthMain / 4);
  const height = new Animated.Value(heightMain / 4);
  const SITE_BANNER_VERTICAL_IMAGE = require('../assets/main_logo_2.png');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    Animated.timing(
      width, // The animated value to drive
      {
        toValue: widthMain, // Animate to opacity: 1 (opaque)
        duration: 450, // Make it take a while
        useNativeDriver: false,
      },
    ).start(); // Starts the animation
    Animated.timing(
      height, // The animated value to drive
      {
        toValue: heightMain, // Animate to opacity: 1 (opaque)
        duration: 3000, // Make it take a while
        useNativeDriver: false,
      },
    ).start(); // Starts the animation
  }, []);

  useEffect(() => {
    console.log('main useeffect');
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('message handled in bg', remoteMessage);
      setNotificationData(remoteMessage);
    });
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('message handled in opennedd', remoteMessage);
      setNotificationData(remoteMessage);
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(remoteMessage?.data);
          // Notification caused app to open from quit state
          setNotificationData(remoteMessage);
        }
      });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('messaging', remoteMessage);
    });

    return unsubscribe;
  }, []);

  // const getUserIds = async () => {
  //   return await AsyncStorage.getItem('user_id');
  // };
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    }
  };

  const checkLoginPossible = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    console.log(userId, 'this userid');
    try {
      setLoading(true);
      if (!userId) {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }, 10);
      } else {
        console.log(notificationData, 'hiii');
        if (notificationData?.data?.device_id) {
          console.log(notificationData?.data?.device_id);
          navigation.navigate('DevicesDetail', {
            device_id: notificationData?.data?.device_id,
          });
        } else {
          navigation.navigate('Dashboard', {userId: userId});
        }
      }
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }, 10);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      checkLoginPossible();
    }, 1000);
  }, [notificationData, isFocused]);

  return (
    <View style={styles.container}>
      <Loader loading={loading} loaderColor={COLORS.white} />

      <Animated.Image
        source={SITE_BANNER_VERTICAL_IMAGE}
        style={{
          width: width,
          height: height,
          position: 'absolute',
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    backgroundColor: '#2F7ECC',
  },
  logoStyle: {
    height: 150,
    width: 150,
  },
});

export default SplashScreen;
