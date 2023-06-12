import * as React from 'react';
import {
  Easing,
  TextInput,
  Animated,
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import Svg, {G, Circle, Rect} from 'react-native-svg';
import {COLORS} from '../Resources/Themes';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CircularProgress({
  percentage = 75,
  radius = 40,
  strokeWidth = 5,
  duration = 500, // set it to 500 for animation
  color = COLORS.appBlueColor,
  delay = 0,
  textColor = COLORS.appBlueColor,
  max = 100,
  value = 0,
  label = '',
}) {
  const animated = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const inputRef = React.useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animation = toValue => {
    return Animated.timing(animated, {
      delay: 500, // set it to 1000 for animation
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  React.useEffect(() => {
    animation(percentage);
    animated.addListener(
      v => {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPerc) / 100;
        if (inputRef?.current) {
          inputRef?.current?.setNativeProps({
            text: `${value.toString()}`,
          });
        }
        if (circleRef?.current) {
          circleRef?.current?.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [max, percentage],
    );

    return () => {
      animated.removeAllListeners();
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: radius * 2,
          height: radius * 2,
        }}>
        <Svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              ref={circleRef}
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDashoffset={circumference}
              strokeDasharray={circumference}
            />
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeOpacity=".1"
            />
          </G>
        </Svg>
        <AnimatedTextInput
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue={'0'}
          style={[
            StyleSheet.absoluteFillObject,
            {color: textColor ?? color},
            styles.text,
            {marginTop: Platform.OS === 'ios' ? radius / 1.4 : 0},
          ]}
          multiline={true}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
  },
  container: {alignItems: 'center'},
  label: {paddingTop: 5, fontSize: 14, fontWeight: '600'},
});
