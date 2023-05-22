import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import Dashboard from './src/Screens/Dashboard';
import DevicesListScreen from './src/Screens/DevicesListScreen';
import DevicesDetailScreen from './src/Screens/DevicesDetailScreen';
import BatteryLevelDetailsScreen from './src/Screens/BatteryLevelDetailsScreen';
import LoginScreen from './src/Screens/LoginScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import ChangePasswordScreen from './src/Screens/ChangePasswordScreen';
import AddNewDeviceScreen from './src/Screens/AddNewDeviceScreen';
import {Provider as PaperProvider} from 'react-native-paper';
import AddNewUserScreen from './src/Screens/AddNewUserScreen';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import NotificationController from './src/constants/NotificationController.android';
import SplashScreen from './src/Screens/SplashScreen';
import HistoryScreen from './src/Screens/HistoryScreen';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const Stack = createNativeStackNavigator();

const showNotification = (id:string,title:string, message:string) => {
  PushNotificationIOS.addNotificationRequest({
 id:id, title : title , body:message
})}

const App = () => {

  useEffect(()=>{
    showNotification('1','ios notificaton','tes')
  })
  
  return (
    <PaperProvider>
      <NotificationController />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Splash'}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="DevicesList" component={DevicesListScreen} />
          <Stack.Screen name="DevicesDetail" component={DevicesDetailScreen} />
          <Stack.Screen
            name="BatteryLevelDetails"
            component={BatteryLevelDetailsScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen name="AddNewDevice" component={AddNewDeviceScreen} />
          <Stack.Screen name="AddNewUser" component={AddNewUserScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

// import {
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';
// import {ProfileIcon} from './src/assets/ProfileIcon';

// const App = () => {
//   return (
//     <SafeAreaView style={{backgroundColor: '#c5c9d2'}}>
//       <View
//         style={{backgroundColor: '#fff', padding: 20, flexDirection: 'row'}}>
//         <View style={{flex: 1}}>
//           <Text style={{fontSize: 22, color: '#565c6a', fontWeight: 'bold'}}>
//             Welcome,
//           </Text>
//           <Text style={{fontSize: 20, color: '#565c6a', fontWeight: '600'}}>
//             Krishan Kumar
//           </Text>
//         </View>
//         <View style={{flex: 1, alignItems: 'flex-end'}}>
//           <View
//             style={{
//               elevation: 5,
//               backgroundColor: '#fff',
//               borderRadius: 5,
//               padding: 5,
//             }}>
//             <ProfileIcon />
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
