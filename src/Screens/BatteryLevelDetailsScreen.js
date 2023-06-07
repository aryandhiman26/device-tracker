import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CircularProgress from '../CommonComponents/CircularProgressBattery';
import CommonHeader from '../CommonComponents/CommonHeader';
import {Assets} from '../Resources/Assets';
import {COLORS} from '../Resources/Themes';

const batteryList = [
  {battery_name: 'Battery b1', battery_percentage: 75},
  {battery_name: 'Battery b2', battery_percentage: 25},
  {battery_name: 'Battery b3', battery_percentage: 65},
];

const BatteryLevelDetailsScreen = ({navigation, route}) => {
  const {batteryDetails} = route?.params;

  const BatteryListItem = (item, index) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.listContainer}>
        <CircularProgress
          label={`Battery ${index + 1}`}
          percentage={Number(item?.battery_percent)}
          value={(item?.battery_percent).toFixed(2)}
        />

        {/* <View style={styles.listInnerContainer}>
          <View style={styles.firstRow}>
            <Text style={styles.amountText}>{item.battery_name}</Text>
          </View>
        </View> */}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonHeader
        navigation={navigation}
        title={'Battery Details'}
        isBackButton={true}
      />
      <FlatList
        data={[
          {battery_percent: batteryDetails?.battery_1},
          {battery_percent: batteryDetails?.battery_2},
          {battery_percent: batteryDetails?.battery_3},
          {battery_percent: batteryDetails?.battery_4},
        ]}
        renderItem={({item, index}) => BatteryListItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
        style={{marginBottom: 25, margin: 2}}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: COLORS.DARK_GREY,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    padding: 20,
    //flex: 1,
    width: '48%',
    justifyContent: 'center',
    margin: '1%',
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
  imageStatus: {
    height: 35,
    width: 35,
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
  amountText: {
    flex: 1.4,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BatteryLevelDetailsScreen;
