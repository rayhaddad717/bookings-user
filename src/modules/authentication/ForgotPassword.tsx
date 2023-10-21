import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import MyTextInput from "../../components/MyTextInput";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuth } from "../../../firebase";
import Toast from "react-native-toast-message";
import MyButton from "../../components/MyButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/RouteParamList";
import { globalStyles, theme } from "../../theme";
type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

const ForgotPassword = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: { message: string } }>({});
  async function handleResetEmail() {
    try {
      if (!email.trim()) {
        setErrors({ email: { message: "required" } });

        return;
      } else if (
        !email.trim().includes("@") ||
        email.trim().indexOf("@") >= email.trim().length - 2
      ) {
        setErrors({ email: { message: "email is not valid" } });
        return;
      }
      if (submitting) return;
      setSubmitting(true);
      await sendPasswordResetEmail(firebaseAuth, email);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset email sent, please check your email",
      });
      navigation.navigate("Login");
    } catch (err) {
      const firebaseError = err as { code: string; message: string };
      const invalid = new Set(["auth/user-not-found", "auth/invalid-email"]);
      const { code: errorCode } = firebaseError;
      if (invalid.has(errorCode))
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "This email is invalid",
        });
      setSubmitting(false);
    } finally {
    }
  }

  function handleCancel() {
    navigation.navigate("Login");
  }
  useEffect(() => {
    if (email.trim()) setErrors({});
  }, [email]);

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal: theme.screen.paddingHorizontal },
      ]}
    >
      <View style={{ width: "100%" }}>
        <Text style={[theme.text.header, styles.header]}>
          Reset Your Password
        </Text>
      </View>
      <View
        style={{ width: "100%", padding: theme.screen.largePaddingHorizontal }}
      >
        <View style={{ gap: 15 }}>
          <View style={globalStyles.textInputContainer}>
            <TextInput
              keyboardType="default"
              placeholder="Enter your email"
              style={{
                fontWeight: "600",
                maxWidth: "80%",
                flexGrow: 1,
              }}
              onChangeText={setEmail}
              value={email}
            ></TextInput>
          </View>
          <Text style={styles.errorLabel}>{errors.email?.message}</Text>
        </View>
        <View style={{ marginTop: 100, gap: 20 }}>
          <MyButton
            onPress={handleResetEmail}
            title="Send Password Reset Email"
            type="Primary"
            loading={submitting}
          />
          <MyButton onPress={handleCancel} title="Cancel" type="Secondary" />
        </View>
      </View>
    </View>
  );
};

export default observer(ForgotPassword);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: "flex-start",
    paddingTop: 100,
    paddingHorizontal: theme.screen.largePaddingHorizontal,
    paddingBottom: theme.screen.paddingBottom,
    gap: 10,
  },
  errorLabel: {
    color: theme.primaryColor,
    textAlign: "right",
  },
  header: {
    textAlign: "center",
  },
});
