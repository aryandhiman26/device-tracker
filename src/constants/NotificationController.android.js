import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'My Channel',
    channelDescription: 'A channel to describe',
    playSound: false,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  created => {
    console.log(`create channel returnned '${created}' `);
  },
);

const NotificationController = props => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
        channelId: true,
        vibrate: true,
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
