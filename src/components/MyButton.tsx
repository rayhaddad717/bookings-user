import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import React, { useState } from "react";
import { theme } from "../theme";

interface Props {
  type: "Primary" | "Secondary";
  title: string;
  onPress: () => any;
  loading?: boolean;
}
const MyButton = ({ onPress, title, loading, type }: Props) => {
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
    }).start(() => {
      // Trigger the onPress function after the animation is complete
    });
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={loading}
        onPress={onPress}
        style={[
          styles.button,
          type === "Primary" ? styles.primary : styles.secondary,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={[
              styles.text,
              type === "Secondary" ? styles.textSecondary : {},
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.soft,
    borderWidth: 2,
    fontWeight: 500,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minWidth: 100,
  },
  primary: {
    borderColor: theme.primaryColor,
    backgroundColor: theme.primaryColor,
    color: "white",
  },
  secondary: {
    color: theme.primaryColor,
    borderColor: theme.primaryColor,
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontFamily: "Roboto_700Bold",
    fontSize: 15,
  },
  textSecondary: {
    color: theme.primaryColor,
  },
});
