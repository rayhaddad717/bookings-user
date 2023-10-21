import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../theme";
interface Props {
  onPress: () => any;
  type: "add";
}
const MyFabButton = ({ onPress }: Props) => {
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
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
        styles.fab,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <AntDesign name="pluscircleo" size={48} color={theme.primaryColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(MyFabButton);
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 50,
    right: 20,
    padding: 0,
    backgroundColor: "white",
    borderRadius: 24,
  },
});
