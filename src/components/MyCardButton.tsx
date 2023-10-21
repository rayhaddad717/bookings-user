import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../theme";
interface Props {
  type?: "Primary";
  title: string;
  subTitle: string;
  onPress: () => any;
  loading?: boolean;
  containerStyle: StyleProp<ViewStyle>;
}
const MyCardButton = ({
  onPress,
  title,
  subTitle,
  loading,
  containerStyle,
}: Props) => {
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
      style={[{ transform: [{ scale: scaleValue }] }, containerStyle]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={loading}
        onPress={onPress}
        style={[styles.card, { flexGrow: 2, flexBasis: 0 }]}
      >
        <Text style={styles.cardMainText}>{title}</Text>
        <Text style={styles.cardText}>{subTitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(MyCardButton);
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.GREEN,
    color: COLORS.WHITE,
    borderRadius: 10,
    padding: 20,
    gap: 10,
    display: "flex",
    width: "auto",
    flexShrink: 1,
  },
  cardMainText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
    fontFamily: "Roboto_300Light",
  },
  cardText: { flexWrap: "wrap", color: "white", fontFamily: "Roboto_300Light" },
});
