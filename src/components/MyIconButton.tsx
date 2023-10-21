import React, { ReactNode, useState } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Easing,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface CustomComponentProps {
  icon: ReactNode;
  onPress: () => any;
  containerStyle: StyleProp<ViewStyle>;
}

const MyIconButton: React.FC<CustomComponentProps> = ({
  icon,
  onPress,
  containerStyle,
}: CustomComponentProps) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.9,
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
  const animatedStyle = { transform: [{ scale: scaleValue }] };
  return (
    <>
      <Animated.View style={[animatedStyle]}>
        <TouchableOpacity
          style={containerStyle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          onPress={onPress}
        >
          {icon}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

// MyIconButton.propTypes = {
//   icon: PropTypes.element,
//   onPress: PropTypes.func.isRequired,
//   containerStyle: PropTypes.instanceOf(StyleProp<ViewStyle>),
// };

export default React.memo(MyIconButton);
