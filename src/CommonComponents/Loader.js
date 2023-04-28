import React from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';
import {COLORS} from '../Resources/Themes';

const Loader = ({loading, loaderColor}) => {
  return (
    <Modal
      style={styles.loaderModalStyle}
      animationType="slide"
      transparent={true}
      visible={loading}>
      <View style={styles.loaderViewStyle}>
        <Spinner
          isVisible={true}
          size={100}
          type={'Circle'}
          color={loaderColor ? loaderColor : COLORS.appBlueColor}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loaderModalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    opacity: 0.1,
  },
  loaderViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
  },
});

export default Loader;
