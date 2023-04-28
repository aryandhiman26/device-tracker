import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Assets} from '../Resources/Assets';
import {COLORS} from '../Resources/Themes';
import _ from 'lodash';
import {ProfileIcon} from '../assets/ProfileIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {BASE_URL} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import {useIsFocused} from '@react-navigation/native';

const Dashboard = ({navigation, route}) => {
  const {userId} = route?.params;
  const ref = useRef(null);
  const isFocused = useIsFocused();
  const [data, setData] = React.useState([]);
  const [userName, setUserName] = React.useState('');
  const [deviceMainsOff, setDeviceMainsOff] = React.useState();
  const [waterLow, setWaterLow] = React.useState();
  const [mainsOff, setMainsOff] = React.useState();
  const [lowBattery, setLowBattery] = React.useState();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getDashboardDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      ref.current = setInterval(() => {
        getDashboardDetails();
      }, 10000);

      return () => {
        if (ref.current) {
          clearInterval(ref.current);
        }
      };
    }
  }, []);

  const getDashboardDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const urlProfile = `${BASE_URL}/profile?userId=${userId}`;
      const responseProfile = await axios.get(urlProfile);
      if (responseProfile?.data?.success) {
        const userDetails = {
          userId: responseProfile?.data?.data?.id,
          userName: responseProfile?.data?.data?.name,
        };
        setUserInfo(responseProfile?.data?.data);
        setUserName(responseProfile?.data?.data?.name);
        await EncryptedStorage.setItem(
          'user_details',
          JSON.stringify(userDetails),
        );
        try {
          const url = `${BASE_URL}/dashboard?userId=${userId}`;
          const response = await axios.get(url);

          if (response?.data?.success) {
            try {
              const dashboardData = response?.data?.data;
              setDeviceMainsOff(dashboardData?.device_off);
              setWaterLow(dashboardData?.water_low);
              setMainsOff(dashboardData?.mains_off);
              setLowBattery(dashboardData?.low_battery);
              setData([
                {
                  image: Assets.mainSupplyIcon,
                  name: 'Mains Off',
                  desc: 'Turn on',
                  count: dashboardData?.mains_off,
                  type: 'mains_off',
                },
                {
                  image: Assets.waterLowIcon,
                  name: 'Water Low',
                  desc: 'Turn on',
                  count: dashboardData?.water_low,
                  type: 'water_low',
                },
                {
                  image: Assets.deviceOffIcon,
                  name: 'Device Off',
                  desc: 'Turn on',
                  count: dashboardData?.device_off,
                  type: 'device_off',
                },
                {
                  image: Assets.lowBatteryIcon,
                  name: 'Low Battery',
                  desc: 'Turn on',
                  count: dashboardData?.low_battery,
                  type: 'battery_low',
                },
              ]);
            } catch (e) {
              console.log(e);
            }
          } else {
            ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
          }
        } catch (error) {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show(responseProfile.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateValue = (index, value) => {
    data[index].selected = value;
    return setData([...data]);
  };

  const navigateToDeviceList = type => {
    navigation.navigate('DevicesList', {type: type ?? 'selectedDevice'});
  };

  const ItemRenderer = ({
    index,
    label,
    selected,
    onUpdateValue,
    image,
    count,
    type,
  }) => (
    <View
      pointerEvents={count == 0 ? 'none' : 'auto'}
      style={{
        flex: 1,
        borderRadius: 15,
        backgroundColor: selected ? COLORS.white : COLORS.appBlueColor,
        margin: 7,
        padding: 15,
      }}>
      <TouchableOpacity onPress={() => navigateToDeviceList(type)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 70,
              width: 50,
            }}>
            <Image
              source={image}
              style={{height: 40, width: 40}}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              padding: 5,
            }}>
            {count}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: selected ? COLORS.black : COLORS.white,
            marginVertical: 10,
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item, index}) => (
    <ItemRenderer
      key={index}
      index={index}
      selected={item.selected}
      label={item.name}
      image={item.image}
      onUpdateValue={onUpdateValue}
      count={item.count}
      type={item.type}
    />
  );

  const navigateToProfileScreen = () => {
    navigation.navigate('Profile', {userInfo: userInfo});
  };
  return (
    <View style={styles.mainViewContainer}>
      <View style={styles.upperViewContainer}>
        <View style={styles.topContainer}>
          <View style={styles.topContainer}>
            <TouchableOpacity
              onPress={navigateToProfileScreen}
              style={{
                marginRight: 10,
                elevation: 5,
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 5,
              }}>
              <ProfileIcon />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                Artemistroniks
              </Text>
            </View>
          </View>
          {/* <View
            style={{
              elevation: 5,
              backgroundColor: '#fff',
              borderRadius: 5,
              padding: 5,
            }}>
            <Image source={Assets.bellIcon} style={{width: 30, height: 30}} />
          </View> */}
        </View>
        <Text
          style={{
            fontSize: 21,
            fontWeight: '700',
            marginVertical: 15,
            color: '#000',
            opacity: 0.7,
          }}>
          {`Welcome, \n${userName}`}
        </Text>
      </View>
      <View style={styles.middleViewContainer}>
        <FlatList
          key={'_'}
          data={data}
          keyExtractor={(e, i) => i.toString()}
          renderItem={renderItem}
          numColumns={2}
          style={{margin: 10}}
          // scrollEnabled={true}
        />
      </View>
      <View style={styles.bottomViewContainer}>
        <TouchableOpacity
          style={{
            borderRadius: 25,
            // borderColor: '#D4d6de',
            // borderWidth: 1,
            backgroundColor: '#f6f6f6',
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 15,
            marginTop: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
          onPress={navigateToDeviceList}>
          <Text style={{color: '#454545', fontSize: 16}}>View all devices</Text>
          <Image source={Assets.arrowIcon} style={{width: 20, height: 20}} />
        </TouchableOpacity>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <ProfileIcon />
          </View>
          <View style={{flex: 3}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Demo 17
            </Text>
          </View>
          <View style={{flex: 2}}>
            <Text style={{}}>DEACTIVATED</Text>
          </View>
        </View> */}
        {/* <View
          style={{
            borderBottomColor: COLORS.appBlueColor,
            borderBottomWidth: 0.5,
            paddingTop: 8,
            paddingHorizontal: 15,
            width: '100%',
          }}
        />
        <View
          style={{
            elevation: 3,
            borderRadius: 15,
            backgroundColor: '#fff',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                BATTERY
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Assets.batteryIcon}
                  style={{width: 25, height: 25}}
                />
                <Text style={{padding: 4}}>50%</Text>
              </View>
            </View>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                HUMIDITY
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Assets.humidityIcon}
                  style={{width: 20, height: 20}}
                />
                <Text style={{padding: 4}}>67%</Text>
              </View>
            </View>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                TEMP
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Assets.tempIcon}
                  style={{width: 25, height: 25}}
                  resizeMode="contain"
                />
                <Text style={{padding: 4}}>15°</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                WATER
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Assets.waterIcon}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
                <Text style={{padding: 4}}>NC</Text>
              </View>
            </View>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                AC 220V
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={Assets.acIcon} style={{width: 22, height: 22}} />
                <Text style={{padding: 4}}>220V OFF</Text>
              </View>
            </View>
            <View style={{alignItems: 'center', padding: 5, flex: 1}}>
              <Text
                style={{
                  fontWeight: '600',
                }}>
                GENSET
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={Assets.gensetIcon}
                  style={{width: 20, height: 20}}
                />
                <Text style={{padding: 4}}>OFF</Text>
              </View>
            </View>
          </View>
        </View> */}
      </View>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: COLORS.appBackgroundColor,
  },
  upperViewContainer: {
    flex: 1.5,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: '12%',
    paddingBottom: '6%',
  },
  middleViewContainer: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
});

export default Dashboard;
