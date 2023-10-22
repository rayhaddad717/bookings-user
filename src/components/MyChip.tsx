import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import React, { useState } from "react";
import { COLORS, globalStyles, theme } from "../theme";

interface Props {
  title: string;
  onPress: () => any;
  onLongPress?: () => any;
  loading?: boolean;
  selected: boolean;
}
const MyChip = ({ onPress, title, loading, selected, onLongPress }: Props) => {
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
        onLongPress={onLongPress || undefined}
        style={[globalStyles.chip, selected && styles.selected]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={[
              globalStyles.baseTextBolder,
              styles.text,
              selected && styles.textSelected,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(MyChip);

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    borderWidth: 2,
    fontWeight: 500,
    paddingVertical: 10,
    paddingHorizontal: 10,
    minWidth: 100,
  },
  selected: {
    borderColor: theme.primaryColor,
    backgroundColor: theme.primaryColor,
    color: "white",
  },
  text: {
    textAlign: "center",
  },
  textSelected: {
    color: COLORS.WHITE,
  },
});
