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
import CommonHeader from '../CommonComponents/CommonHeader';
import {COLORS} from '../Resources/Themes';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BASE_URL} from '../constants/constants';
import Loader from '../CommonComponents/Loader';
import DropDownPicker from 'react-native-dropdown-picker';

const AddNewUserScreen = ({navigation, route}) => {
  const {userInfo} = route?.params;
  const [loading, setLoading] = useState(false);
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [state, setState] = React.useState('');
  const [address, setAddress] = React.useState('');
  //const [privilege, setPrivilege] = React.useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'User', value: 'user'},
    {label: 'Super user', value: 'superuser'},
    {label: 'Admin', value: 'admin'},
  ]);

  const handleSubmitButton = async () => {
    console.log(value);
    if (emailId.length < 1) {
      ToastAndroid.show('User ID/ Email ID is required', ToastAndroid.SHORT);
      return;
    }
    if (password.length < 1) {
      ToastAndroid.show('Password is required', ToastAndroid.SHORT);
      return;
    }
    if (confirmPassword.length < 1) {
      ToastAndroid.show('Confirm password is required', ToastAndroid.SHORT);
      return;
    }
    if (confirmPassword != password) {
      ToastAndroid.show(
        "Password and Confirm passowrd does't matches.",
        ToastAndroid.SHORT,
      );
      return;
    }
    if (fullName.length < 1) {
      ToastAndroid.show('Full name is required', ToastAndroid.SHORT);
      return;
    }
    if (mobileNumber.length < 1) {
      ToastAndroid.show('Mobile number is required', ToastAndroid.SHORT);
      return;
    }
    if (state.length < 1) {
      ToastAndroid.show('State is required', ToastAndroid.SHORT);
      return;
    }
    if (address.length < 1) {
      ToastAndroid.show('Address is required', ToastAndroid.SHORT);
      return;
    }
    if (value.length < 1) {
      ToastAndroid.show('Please select a privilege', ToastAndroid.SHORT);
      return;
    }
    try {
      setLoading(true);
      const userDetails = await EncryptedStorage.getItem('user_details');
      const userDetailsParsed = await JSON.parse(userDetails);
      const body = {
        user_id: emailId,
        password: password,
        full_name: fullName,
        mobile: mobileNumber,
        state: state,
        address: address,
        privilege: value,
      };
      let response;
      try {
        response = await axios.post(
          `${BASE_URL}/user?userId=${userDetailsParsed?.userId}`,
          body,
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }

      if (response?.data?.success) {
        console.log(response?.data);
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
        navigation.navigate('Profile', {userInfo: userInfo});
      } else {
        ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        navigation={navigation}
        title={'Add New User'}
        isBackButton={true}
      />
      <ScrollView>
        <View style={styles.innerContainer}>
          <View style={styles.signInForm}>
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
          </View>
        </View>
      </ScrollView>
      <Loader loading={loading} loaderColor={COLORS.appBlueColor} />
    </SafeAreaView>
  );
};

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
  itemSeparator: {
    backgroundColor: COLORS.DARK_GREY,
    height: 0.8,
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
    marginTop: 30,
    width: '100%',
    marginBottom: 20,
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

export default AddNewUserScreen;
