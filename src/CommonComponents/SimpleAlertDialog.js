import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {COLORS} from '../Resources/Themes';

export const SimpleAlertDialog = ({
  title,
  content,
  visible,
  dismissable,
  showOnlyNegative,
  showOnlyPositive,
  negativeAction,
  positiveAction,
  positiveButtonLabel,
  negativeButtonLabel,
  setVisible,
  positiveButtonStyle,
}) => {
  return (
    <View>
      <Portal>
        <Dialog
          style={{backgroundColor: '#f6f8fb'}}
          visible={visible}
          dismissable={dismissable}
          onDismiss={() => setVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.paragraph}>{content}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            {!showOnlyNegative && (
              <Button
                labelStyle={
                  positiveButtonStyle
                    ? positiveButtonStyle
                    : styles.positiveButtonLabel
                }
                onPress={() => positiveAction()}>
                {positiveButtonLabel}
              </Button>
            )}
            {!showOnlyPositive && (
              <Button
                mode="outlined"
                style={styles.negativeButtonStyle}
                labelStyle={styles.negativeButtonLabel}
                onPress={() => negativeAction()}>
                {negativeButtonLabel}
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  dialogTitle: {
    color: COLORS.appBlueColor,
    fontWeight: 'bold',
  },
  negativeButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
  negativeButtonStyle: {
    backgroundColor: COLORS.appBlueColor,
    marginEnd: 10,
    marginStart: 20,
  },
  paragraph: {
    color: COLORS.appBlueColor,
  },
  positiveButtonLabel: {
    color: 'grey',
  },
});
