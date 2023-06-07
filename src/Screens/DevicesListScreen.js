import React, {useEffect, useState} from 'react';
import {
  FlatList,
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
import {Assets} from '../Resources/Assets';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {BASE_URL} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import {ErrorPlaceholder} from '../CommonComponents/ErrorPlaceholder';
import Toast from 'react-native-toast-message';

const DevicesListScreen = ({navigation, route}) => {
  const {type} = route?.params;
  const [deviceList, setDeviceList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDeviceList();
  }, []);

  const getDeviceList = async () => {
    try {
      setLoading(true);
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      if (type === 'allDevices') {
        try {
          const url = `${BASE_URL}/all-devices?userId=${userDetailsParsed?.userId}`;
          const response = await axios.get(url);
          if (response?.data?.success) {
            const devicelistData = response?.data?.data;
            setDeviceList(devicelistData);
            setFilteredDataSource(devicelistData);
            setMasterDataSource(devicelistData);
          } else {
            // ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
            Toast.show({
              type: 'error',
              text1: response?.data?.message,
              autoHide: true,
              visibilityTime: 3000,
              position: 'bottom',
            });
          }
        } catch (error) {
          // ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            autoHide: true,
            visibilityTime: 3000,
            position: 'bottom',
          });
        }
      } else {
        try {
          const url = `${BASE_URL}/devices?userId=${
            userDetailsParsed?.userId
          }&filterKey=${type ?? ''}`;
          const response = await axios.get(url);
          if (response?.data?.success) {
            const devicelistData = response?.data?.data;
            setDeviceList(devicelistData);
            setFilteredDataSource(devicelistData);
            setMasterDataSource(devicelistData);
          } else {
            // ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
            Toast.show({
              type: 'error',
              text1: response?.data?.message,
              autoHide: true,
              visibilityTime: 3000,
              position: 'bottom',
            });
          }
        } catch (error) {
          // ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            autoHide: true,
            visibilityTime: 3000,
            position: 'bottom',
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.device_name
          ? item.device_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const navigateToDeviceDetail = item => {
    navigation.navigate('DevicesDetail', {device_id: item?.device_id});
  };

  const DevicesListItem = item => {
    return (
      <View pointerEvents={type === 'allDevices' ? 'none' : 'auto'}>
        <TouchableOpacity
          style={styles.listContainer}
          onPress={() => navigateToDeviceDetail(item)}>
          <View style={styles.statusImageView}>
            <Image
              style={styles.imageStatus}
              source={Assets.batterylistIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.listInnerContainer}>
            <View style={styles.firstRow}>
              <Text style={styles.amountText}>{item.device_name}</Text>
            </View>
            <View style={styles.secondRow}>
              <View style={styles.specialRow}>
                <Text style={styles.numberText}>{'MAC Address'}</Text>
                <Text style={styles.priceText}>{'Device Id'}</Text>
              </View>
            </View>
            <View style={styles.thirdRow}>
              <View style={styles.specialRow}>
                <Text style={[styles.numberText, {fontWeight: 'bold'}]}>
                  {item.mac ? item.mac : '-'}
                </Text>
                <Text style={styles.priceText2}>
                  {item.device_id ? item.device_id : '-'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <CommonHeader
        navigation={navigation}
        title={`Devices (${filteredDataSource.length})`}
        isBackButton={true}
      />
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search here..."
      />
      <FlatList
        data={filteredDataSource}
        renderItem={({item, index}) => DevicesListItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
        style={{marginBottom: 120}}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={
          !loading ? (
            <ErrorPlaceholder type="empty" message={'No Data Found!'} />
          ) : null
        }
      />
      <Toast />
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
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
  },
  statusImageView: {
    width: '12%',
    flexDirection: 'column',
    paddingHorizontal: 5,
    paddingVertical: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  listInnerContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 10,
    alignSelf: 'center',
  },
  firstRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
  },
  priceText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  specialText: {
    flex: 1,
    fontSize: 14,
  },
  specialText2: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },

  priceText2: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  invoiceAmountText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  numberText: {
    flex: 1,
    textAlign: 'left',
  },
  amountText: {
    flex: 1.4,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },

  thirdRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStatus: {
    height: 35,
    width: 35,
  },
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: COLORS.DARK_GREY,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
});

export default DevicesListScreen;
