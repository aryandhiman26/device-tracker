import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonHeader from '../CommonComponents/CommonHeader';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {BASE_URL, removeDuplicateKeys} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const HistoryScreen = ({navigation, route}) => {
  const {deviceDetails} = route?.params;
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [deviceHistory, setDeviceHistory] = useState([]);
  const isFocused = useIsFocused();
  const [filterValue, setfilterValue] = useState('');

  const [filterItems, setFilterItems] = useState([
    {label: 'Water', value: 'water_level'},
    {label: 'Ac', value: 'ac_level'},
    {label: 'Genset', value: 'genset_level'},
    {label: 'Temp', value: 'temp'},
  ]);

  useEffect(() => {
    setLoading(true);
    getDeviceHistory('water_level');
  }, [deviceDetails]);

  // useEffect(() => {
  //   if (isFocused) {
  //     ref.current = setInterval(() => {
  //       getDeviceHistory('water_level');
  //     }, 10000);

  //     return () => {
  //       if (ref.current) {
  //         clearInterval(ref.current);
  //       }
  //     };
  //   }
  // }, []);

  const getDeviceHistory = async filterKey => {
    setfilterValue(filterKey);
    try {
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      try {
        const url = `${BASE_URL}/history/${deviceDetails?.device_id}?userId=${userDetailsParsed?.userId}&filterKey=${filterKey}`;
        const response = await axios.get(url);
        if (response?.data?.success) {
          const deviceHistoryData = response?.data?.data;
          setDeviceHistory(deviceHistoryData);
        } else {
          // ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
          Toast.show({type:'error', text1:response?.data?.message,autoHide:true, visibilityTime:3000,position:'bottom'});
        }
      } catch (error) {
        console.log(error);
        // ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
        Toast.show({type:'error', text1:'Something went wrong',autoHide:true, visibilityTime:3000,position:'bottom'});
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <CommonHeader
        navigation={navigation}
        title={'History'}
        isBackButton={true}
      />
      <View
        style={{
          marginTop: 10,
          flexDirection: 'column',
        }}>
        <Text style={styles.inputLabel}>Select history type </Text>
        <View style={{flexDirection: 'row'}}>
          {filterItems?.map(item => {
            return (
              <TouchableOpacity
                style={
                  item?.value === filterValue
                    ? {
                        backgroundColor: COLORS.appBlueColor,
                        borderWidth: 1,
                        borderColor: COLORS.appBlueColor,
                        borderRadius: 5,
                        flex: 1,
                        marginHorizontal: 10,
                        alignItems: 'center',
                      }
                    : {
                        backgroundColor: COLORS.lightAppBlue,
                        borderWidth: 1,
                        borderColor: COLORS.appBlueColor,
                        borderRadius: 5,
                        flex: 1,
                        marginHorizontal: 10,
                        alignItems: 'center',
                      }
                }
                onPress={() => {
                  setLoading(true);
                  getDeviceHistory(item?.value);
                }}>
                <Text
                  style={[
                    {
                      color:
                        item?.value === filterValue
                          ? COLORS.white
                          : COLORS.appBlueColor,
                    },
                    {padding: 3, fontSize: 13},
                  ]}>
                  {item?.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <ScrollView style={{marginBottom: 130}}>
        {deviceHistory?.length > 0 &&
          deviceHistory?.map(deviceData => {
            return (
              <View style={styles.container}>
                <View style={styles.header}>
                  <>
                    <View style={styles.dateTimeWrapper}>
                      <Text style={styles.headerText}>
                        {deviceData?.DATE?.split(' ')[0]}
                      </Text>
                    </View>
                    <Text style={styles.statusText}>
                      {deviceData?.DATE?.split(' ')[1]}
                    </Text>
                  </>
                </View>
                <View style={styles.contentWrapper}>
                  <View style={styles.block}>
                    <View style={styles.row}>
                      {Object.keys(
                        removeDuplicateKeys(deviceData, ['DATE']),
                      )?.map(key => (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              flex: 1,
                              padding: 7,
                              color: COLORS.DARK_GREY,
                            }}>
                            {key}
                          </Text>
                          <Text style={[styles.separatorColon]}> {':'}</Text>
                          <Text
                            style={{
                              flex: 1,
                              padding: 7,
                              textAlign: 'right',
                              color: COLORS.DARK_GREY,
                            }}>
                            {deviceData[key]}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
      </ScrollView>
      <Toast/>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: '2%',
    marginVertical: '2%',
    marginTop: 10,
    zIndex: 2,
    zIndexInverse: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.appBlueColor, // '#4366AD',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  firstContentWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 12,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  totalAmountLabel: {
    color: COLORS.appBlueColor,
    flex: 12,
    paddingHorizontal: '1%',
  },
  separatorColon: {
    paddingHorizontal: 7,
  },
  contentWrapper: {
    paddingBottom: 7,
  },
  dateTimeWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: '#fff',
    fontSize: 12,
  },
  timeText: {
    color: '#fff',
    paddingLeft: 5,
  },
  statusText: {
    color: '#fff',
    justifyContent: 'flex-end',
    paddingLeft: 5,
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  block: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingHorizontal: 15,
    width: '100%',
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemSeparator: {
    backgroundColor: COLORS.DARK_GREY,
    height: 0.8,
  },
  inputLabel: {
    color: COLORS.DARK_GREY,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 2,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
});

export default HistoryScreen;
