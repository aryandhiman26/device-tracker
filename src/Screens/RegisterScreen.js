import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CommonHeader from '../CommonComponents/CommonHeader';
import Loader from '../CommonComponents/Loader';
import {COLORS} from '../Resources/Themes';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({navigation, route}) => {
  const [serialNo, setSerialNo] = React.useState('');
  const [isSerialNoDisabled, setIsSerialNoDisabled] = useState(false);
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [state, setState] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'User', value: 'user'},
    {label: 'Super user', value: 'superuser'},
    {label: 'Admin', value: 'admin'},
  ]);

  const handleNextButton = () => {
    setIsSerialNoDisabled(true);
  };

  const handleSubmitButton = () => {
    if (emailId.length < 1) {
      // ToastAndroid.show('User ID/ Email ID is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'User ID/ Email ID is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (password.length < 1) {
      // ToastAndroid.show('Password is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Password is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (confirmPassword.length < 1) {
      // ToastAndroid.show('Confirm password is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Confirm password is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (confirmPassword != password) {
      // ToastAndroid.show(
      //   "Password and Confirm passowrd does't matches.",
      //   ToastAndroid.SHORT,
      // );
      Toast.show({type:'error', text1:"Password and Confirm passowrd does't matches.",autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (fullName.length < 1) {
      // ToastAndroid.show('Full name is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Full name is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (mobileNumber.length < 1) {
      // ToastAndroid.show('Mobile number is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Mobile number is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (state.length < 1) {
      // ToastAndroid.show('State is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'State is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (address.length < 1) {
      // ToastAndroid.show('Address is required', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Address is required',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
    if (value.length < 1) {
      // ToastAndroid.show('Please select a privilege', ToastAndroid.SHORT);
      Toast.show({type:'error', text1:'Please select a privilege',autoHide:true, visibilityTime:3000,position:'bottom'});
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        navigation={navigation}
        title={'Register'}
        isBackButton={true}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.signInForm}>
            <View
              style={{opacity: isSerialNoDisabled ? 0.4 : 1}}
              pointerEvents={isSerialNoDisabled ? 'none' : 'auto'}>
              <Text style={styles.inputLabel}>Enter Product Serial no.</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSerialNo}
                value={serialNo}
                placeholder="Enter serial no."
                cursorColor={COLORS.DARK_GREY}
              />
              <View style={styles.button}>
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={handleNextButton}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.appBlueColor,
                    padding: 7,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: 14,
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {isSerialNoDisabled && (
              <>
                <Text style={styles.inputLabel}>User ID/ Email ID</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setEmailId}
                  value={emailId}
                  placeholder="Enter User id/ Email id"
                  cursorColor={COLORS.DARK_GREY}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Enter password"
                  cursorColor={COLORS.DARK_GREY}
                  secureTextEntry={true}
                />
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  placeholder="Enter confirm password"
                  cursorColor={COLORS.DARK_GREY}
                  secureTextEntry={true}
                />
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setFullName}
                  value={fullName}
                  placeholder="Enter full name"
                  cursorColor={COLORS.DARK_GREY}
                />
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setMobileNumber}
                  value={mobileNumber}
                  placeholder="Enter mobile number"
                  cursorColor={COLORS.DARK_GREY}
                  keyboardType="numeric"
                />
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setState}
                  value={state}
                  placeholder="Enter state"
                  cursorColor={COLORS.DARK_GREY}
                />
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
                  onChangeText={setAddress}
                  value={address}
                  placeholder="Enter address"
                  multiline={true}
                  cursorColor={COLORS.DARK_GREY}
                />
                <Text style={styles.inputLabel}>Privilege</Text>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  textStyle={{color: COLORS.DARK_GREY}}
                  itemSeparatorStyle={styles.itemSeparator}
                  placeholder={'Select a privilege'}
                  placeholderStyle={{color: '#a3a3a3'}}
                  dropDownContainerStyle={{
                    backgroundColor: '#fff',
                    borderColor: COLORS.DARK_GREY,
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: COLORS.DARK_GREY,
                    paddingHorizontal: 10,
                    minHeight: 40,
                  }}
                />
                <View style={styles.button}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    onPress={handleSubmitButton}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: COLORS.appBlueColor,
                      padding: 10,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: 16,
                      }}>
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <Toast/>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {marginBottom: 20, paddingBottom: 40},
  innerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  signInForm: {
    marginTop: 1,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.DARK_GREY,
    borderRadius: 5,
    color: COLORS.DARK_GREY,
  },
  button: {
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    marginBottom: 10,
  },
  inputLabel: {
    color: COLORS.appBlueColor,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 2,
    fontWeight: '600',
    marginTop: 15,
  },
});
