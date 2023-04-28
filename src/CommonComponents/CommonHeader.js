import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {COLORS} from '../Resources/Themes';

const {width, height} = Dimensions.get('window');

const CommonHeader = ({
  title,
  isBackButton,
  navigation,
  backButtonType,
  isHeaderImage,
  headerImageType,
  backgroundColorType,
  headingStyle,
  rightComponent,
  isRightComponent,
}) => {
  function backButtonTypeAssets() {
    return require('../assets/back.png');
  }
  const EmptyLeftView = () => {
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.backButton} />
      </View>
    );
  };

  const EmptyHeaderImageView = () => {
    return <View></View>;
  };

  function handleBackButtonOnPress() {
    navigation.goBack();
  }

  function headerTypeAssets() {
    switch (headerImageType) {
      case 'help_and_support':
        return require('../assets/back.png');
      default:
        break;
    }
  }

  return (
    <View
      style={
        backgroundColorType === 'grey'
          ? styles.containerGrey
          : styles.containerWhite
      }>
      <View style={styles.headerContainer}>
        {isBackButton ? (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              handleBackButtonOnPress();
            }}>
            <Image
              style={styles.backButton}
              source={backButtonTypeAssets()}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <EmptyLeftView />
        )}
        {isHeaderImage ? (
          <Image
            style={styles.headerImage}
            source={headerTypeAssets()}
            resizeMode="contain"
          />
        ) : (
          <EmptyHeaderImageView />
        )}
        {headingStyle ? (
          <Text style={headingStyle} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Text style={styles.headingText} numberOfLines={1}>
            {title}
          </Text>
        )}
        {isRightComponent && (
          <View
            style={{
              flex: 1,
            }}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWhite: {
    backgroundColor: '#fff',
    height: height / 12,
  },
  containerGrey: {
    backgroundColor: COLORS.grayTextColor,
    height: height / 12,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 18,
    height: 18,
  },
  headerImage: {
    width: 18,
    height: 18,
  },
  headingText: {
    color: '#454545',
    paddingHorizontal: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommonHeader;
