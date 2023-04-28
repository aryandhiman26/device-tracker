import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {COLORS} from '../Resources/Themes';

const TextInput = ({
  label,
  labelStyle,
  text,
  leftIcon,
  rightIcon,
  placeholder,
  onChangeText,
  error,
  errorColorYellow,
  errorColorRed,
  mode,
  disabled,
  theme,
  outlineColor,
  outlineColorYellow,
  style,
  errorMessage,
  important,
  multiline,
  ...restProps
}) => {
  return (
    <View>
      <PaperTextInput
        style={style}
        label={
          <Text style={labelStyle}>
            {label} {important && <Text style={styles.important}>*</Text>}
          </Text>
        }
        value={text}
        disabled={disabled}
        mode={mode}
        onChangeText={onChangeText}
        placeholder={placeholder}
        left={leftIcon}
        right={rightIcon}
        theme={theme}
        outlineColor={
          error === true
            ? '#F8E59F'
            : errorColorRed === true
            ? '#FF0000'
            : outlineColor
        }
        multiline={multiline}
        {...restProps}
      />
      {error && <Text style={styles.errorStyle}>{errorMessage}</Text>}
      {errorColorYellow && (
        <Text style={styles.errorStyleYellow}>{errorMessage}</Text>
      )}
      {errorColorRed && <Text style={styles.important}>{errorMessage}</Text>}
    </View>
  );
};

TextInput.prototypes = {};

TextInput.defaultProps = {
  outlineColor: COLORS.DARK_GREY,
};

export default TextInput;

const styles = StyleSheet.create({
  errorStyle: {
    color: '#F8E59F',
  },
  errorStyleYellow: {
    color: '#FFC600',
  },
  important: {
    color: '#ff0000',
  },
});
