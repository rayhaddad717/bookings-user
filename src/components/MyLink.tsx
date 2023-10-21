import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../theme";

interface Props {
  title: string;
  onPress: () => any;
}
const MyLink = ({ onPress, title }: Props) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,

      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {});
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        onPress={onPress}
        style={[styles.link]}
      >
        <Text style={[globalStyles.label]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MyLink;

const styles = StyleSheet.create({
  link: {},
});
