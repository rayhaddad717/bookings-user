import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles, theme } from "../theme";

interface Props {
  type: "Password" | "Email" | "Numpad" | "Number" | "Text";
  onChange: (val: string) => void;
  title: string;
  placeholder: string;
  error?: { message: string } | undefined;
  value?: string | number;
}
const MyTextInput = ({
  onChange,
  type,
  title,
  placeholder,
  error,
  value: propsValue,
}: Props) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [opacity] = useState(new Animated.Value(0));
  useEffect(() => {
    if (propsValue) setValue(propsValue.toString());
  }, [propsValue]);
  const handleChange = (val: string) => {
    setValue(val);
    onChange(val);
  };
  useEffect(() => {
    const showTitle = value.trim() || focused;
    try {
      if (showTitle)
        Animated.timing(opacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: false,
        }).start();
      else
        Animated.timing(opacity, {
          toValue: 0,
          duration: 50,
          useNativeDriver: false,
        }).start();
    } catch (error) {
      console.error(error);
    }
  }, [focused, value]);

  let inputContainerStyle = focused
    ? { ...styles.inputContainer, ...styles.inputContainerFocused }
    : styles.inputContainer;
  // if (error)
  // inputContainerStyle = { ...inputContainerStyle, borderColor: "red" };
  // return <Text>Hello</Text>;
  return (
    <View style={styles.container}>
      {/* <Animated.View
        style={[
          {
            opacity,
          },
          styles.inputLabel,
        ]}
      > */}
      {title ? (
        <View style={styles.labelContainer}>
          <Text style={[globalStyles.label]}>{title}</Text>
        </View>
      ) : null}
      {/* </Animated.View> */}
      <View style={styles.inputContainer}>
        <TextInput
          secureTextEntry={type === "Password"}
          keyboardType={
            type === "Numpad"
              ? "number-pad"
              : type === "Email"
              ? "email-address"
              : "default"
          }
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          value={value}
          style={styles.input}
          onChangeText={(e) => handleChange(e)}
          placeholder={focused ? "" : placeholder}
        />
      </View>
      {error && <Text style={styles.errorLabel}>{error?.message}</Text>}
    </View>
  );
};

export default React.memo(MyTextInput);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    // gap: 10,
    // width: "100%",
    position: "relative",
    marginTop: 15,
    // paddingVertical: 10,
  },
  labelContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainer: {
    shadowColor: "#27272b",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
    backgroundColor: "white",
    borderRadius: 8,
  },
  input: {
    borderWidth: 0,
    borderColor: "#d1cdcd",
    borderRadius: 5,
    padding: 10,
    flexBasis: 50,
    flexShrink: 1,
    // flexGrow: 1,
    width: "100%",
  },
  inputContainerFocused: {
    borderColor: theme.primaryColor,
    borderWidth: 2,
  },
  errorLabel: {
    marginTop: 10,
    color: theme.primaryColor,
    textAlign: "right",
  },
});
