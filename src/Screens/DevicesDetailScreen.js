import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import CircularProgress from '../CommonComponents/CircularProgress';
import CommonHeader from '../CommonComponents/CommonHeader';
import {Assets} from '../Resources/Assets';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {BASE_URL} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import {useIsFocused} from '@react-navigation/native';

const DevicesDetailScreen = ({navigation, route}) => {
  const {device_id} = route.params;
  console.log(device_id, 'thiss one');
  const ref = useRef(null);
  const [deviceData, setDeviceData] = useState();
  const [avgBattery, setAvgBattery] = useState(0);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    getDeviceDetail();
  }, [device_id]);

  useEffect(() => {
    if (isFocused) {
      ref.current = setInterval(() => {
        getDeviceDetail();
      }, 10000);

      return () => {
        if (ref.current) {
          clearInterval(ref.current);
        }
      };
    }
  }, []);

  const getDeviceDetail = async () => {
    try {
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      try {
        const url = `${BASE_URL}/devices/${device_id}?userId=${userDetailsParsed?.userId}`;
        const response = await axios.get(url);

        if (response?.data?.success) {
          const deviceDetailData = response?.data?.data[0];
          setDeviceData(deviceDetailData);

          let tempBattery = 0;
          const avgBatteryNumber = Number(
            deviceDetailData?.batval1?.toFixed(2),
          );
          if (avgBatteryNumber >= 12.7) {
            tempBattery = 100;
          } else if (avgBatteryNumber >= 12.5 && avgBatteryNumber < 12.7) {
            tempBattery = 90;
          } else if (avgBatteryNumber >= 12.3 && avgBatteryNumber < 12.5) {
            tempBattery = 80;
          } else if (avgBatteryNumber >= 12.1 && avgBatteryNumber < 12.3) {
            tempBattery = 70;
          } else if (avgBatteryNumber >= 11.95 && avgBatteryNumber < 12.1) {
            tempBattery = 60;
          } else if (avgBatteryNumber >= 11.8 && avgBatteryNumber < 11.95) {
            tempBattery = 50;
          } else if (avgBatteryNumber >= 11.65 && avgBatteryNumber < 11.8) {
            tempBattery = 40;
          } else if (avgBatteryNumber >= 11.5 && avgBatteryNumber < 11.65) {
            tempBattery = 30;
          } else if (avgBatteryNumber >= 11.35 && avgBatteryNumber < 11.5) {
            tempBattery = 20;
          } else if (avgBatteryNumber >= 11.2 && avgBatteryNumber < 11.35) {
            tempBattery = 10;
          } else if (avgBatteryNumber > 5 && avgBatteryNumber < 11.2) {
            tempBattery = 0;
          }
          setAvgBattery(tempBattery);
        } else {
          ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //device_status
  const navigateToBatteryDetails = () => {
    navigation.navigate('BatteryLevelDetails', {
      batteryDetails: {
        battery_1: deviceData?.batval1,
        battery_2: deviceData?.batval2,
        battery_3: deviceData?.batval3,
        battery_4: deviceData?.batval4,
      },
    });
  };

  const navigateToHistoryScreen = () => {
    navigation.navigate('History', {deviceDetails: deviceData});
  };

  const ViewHistoryIcon = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginRight: 15,
        }}
        onPress={navigateToHistoryScreen}>
        <Text
          style={{
            color: COLORS.appBlueColor,
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'right',
            paddingHorizontal: 7,
            textDecorationLine: 'underline',
          }}>
          View History
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <CommonHeader
        navigation={navigation}
        title={'Device Details'}
        isBackButton={true}
        isRightComponent={true}
        rightComponent={<ViewHistoryIcon />}
      />
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          marginTop: 10,
          justifyContent: 'space-between',
        }}>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={require('../assets/zigzag_bg.png')}
            style={styles.backgroundImage}
            resizeMode="stretch">
            <View style={styles.innerContainerImage}>
              <View style={styles.topContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginLeft: 5,
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.titleTextGreen}>
                    {deviceData?.device_name}
                  </Text>
                  <Text
                    style={[
                      styles.defaultDeviceStatus,
                      {
                        color:
                          deviceData?.device_status === 'ACTIVATED'
                            ? COLORS.green
                            : COLORS.red,
                      },
                    ]}>
                    {deviceData?.device_status}
                  </Text>
                </View>
              </View>
              <View style={styles.greenBorderBox}>
                <View
                  style={{
                    padding: 10,
                    paddingBottom: 15,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1}}>
                    <Text style={{color: COLORS.DARK_GREY, fontSize: 13}}>
                      AC 220V
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK_GREY,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      {deviceData?.ac}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{color: COLORS.DARK_GREY, fontSize: 13}}>
                      GENSET
                    </Text>
                    <Text
                      style={{
                        color: COLORS.DARK_GREY,
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      {deviceData?.gen}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            // flex: 2.5,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={navigateToBatteryDetails}>
            <CircularProgress
              label="Battery Level"
              percentage={Number(avgBattery)}
              value={avgBattery}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            marginHorizontal: 5,
            // flex: 1,
          }}>
          <View style={styles.innerContainer}>
            <View style={styles.topContainerImage}>
              <Image
                style={styles.cardImage}
                source={Assets.humidityIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={{color: COLORS.DARK_GREY, fontSize: 14}}>
              Humidity
            </Text>
            <Text
              style={{
                color: COLORS.DARK_GREY,
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {deviceData?.humd}
            </Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.topContainerImage}>
              <Image
                style={styles.cardImage}
                source={Assets.tempIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={{color: COLORS.DARK_GREY, fontSize: 14}}>Temp</Text>
            <Text
              style={{
                color: COLORS.DARK_GREY,
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {deviceData?.temp}
            </Text>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.topContainerImage}>
              <Image
                style={styles.cardImage}
                source={Assets.waterIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={{color: COLORS.DARK_GREY, fontSize: 14}}>
              Water Level
            </Text>
            <Text
              style={{
                color: COLORS.DARK_GREY,
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {deviceData?.watone}
            </Text>
          </View>
        </View>
      </View>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </>
  );
};

export default DevicesDetailScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginTop: 7,
    marginHorizontal: 7,
    borderRadius: 5,
    shadowColor: COLORS.DARK_GREY,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    // flex: 1,
  },
  backgroundImage: {
    flex: 1,
    marginHorizontal: 10,
    paddingBottom: 15,
  },
  greenBorderBox: {
    borderWidth: 1,
    borderColor: COLORS.appBlueColor,
    borderRadius: 6,
    margin: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  greenSolidBox: {
    backgroundColor: COLORS.appBlueColor,
    padding: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainerImage: {
    padding: 10,
  },
  titleText: {
    paddingTop: 3,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK_GREY,
  },
  titleTextGreen: {
    paddingTop: 3,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.appBlueColor,
  },
  titleTextGreen2: {
    paddingTop: 3,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.appBlueColor,
  },
  defaultDeviceStatus: {
    paddingTop: 3,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  rowContainerValue: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  rowContainerLabel: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  innerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
  },
  topContainerImage: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 7,
  },
  cardImage: {
    height: 30,
    width: 30,
  },
});
