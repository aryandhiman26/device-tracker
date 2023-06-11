import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {useAuth} from './useAuth';

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
  const {setNotificationData} = useAuth();
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        largeIcon: '',
        smallIcon: 'ic_notification_icon',
        color: '#13989B',
        channelId: 'channel-id',
        vibrate: true,
        // actions: ['Yes', 'No'], // buttons can be given in notifications
      });
      PushNotification.configure({
        onNotification: function (notification) {
          setNotificationData(notification);
        },
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
