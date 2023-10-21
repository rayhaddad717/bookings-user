import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import { observer } from "mobx-react-lite";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../../firebase";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useStore } from "../../stores";
import { User, userConverter } from "../../interfaces";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/RouteParamList";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, globalStyles, theme } from "../../theme";
import Toast from "react-native-toast-message";
import MyLink from "../../components/MyLink";
import { ICONS, IMAGES } from "../../icons";
import * as Yup from "yup";
import { Formik, FormikHelpers } from "formik";
import { userRef } from "../../collections";
type Props = NativeStackScreenProps<RootStackParamList, "Login">;
function Login({ navigation }: Props) {
  const { authenticationStore } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, []);
  const ValidationSchema = useMemo(
    () =>
      Yup.object({
        emailOrUsername: Yup.string().required("required"),
        password: Yup.string()
          .min(8)
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Your password must contain one lowercase letter, one uppercase letter, one digit, and one special character and be minimum 8 characters in length"
          )
          .required("required"),
      }),
    []
  );

  const comingSoon = useCallback(() => {
    Toast.show({
      type: "success",
      text1: "Comming Soon",
    });
  }, []);
  const handleSubmit =
    //  useCallback(
    async (
      {
        emailOrUsername,
        password,
      }: { emailOrUsername: string; password: string },
      helpers: FormikHelpers<{
        emailOrUsername: string;
        password: string;
      }>
    ) => {
      try {
        setIsSubmitting(true);
        const checkUsername = await getDocs(
          query(
            userRef,
            where("username", "==", emailOrUsername.toLocaleLowerCase())
          )
        );
        if (!checkUsername.empty) {
          emailOrUsername =
            checkUsername.docs.at(0)?.data()["email"] || emailOrUsername;
        }
        const userCredential = await signInWithEmailAndPassword(
          firebaseAuth,
          emailOrUsername.trim(),
          password.trim()
        );
        // Signed in
        const user = userCredential.user;
        const docSnap = await getDoc(
          doc(firebaseDB, "users", user.uid).withConverter(userConverter)
        );
        setIsSubmitting(false);
        if (docSnap.exists()) {
          authenticationStore.setCurrentUser(docSnap.data());
          navigation.navigate("User");
        }
      } catch (error) {
        setIsSubmitting(false);
        const firebaseError = error as { code: string; message: string };
        const errorCode = firebaseError.code;
        const errorMessage = firebaseError.message;

        const invalid = new Set([
          "auth/invalid-login-credentials",
          "auth/user-not-found",
        ]);
        const format = new Set(["auth/invalid-email"]);
        if (invalid.has(errorCode))
          Toast.show({
            type: "info",
            text1: "Invalid Credentials",
            text2: "Wrong email/password",
          });
        else if (format.has(errorCode))
          Toast.show({
            type: "info",
            text1: "Invalid Credentials",
            text2: "Double check your email and password",
          });
        else if (errorCode === "auth/too-many-requests")
          Toast.show({
            type: "info",
            text1: "Too Many Requests",
            text2: "You have tried too many requests, try after a while",
          });

        console.error(errorCode, "test", errorMessage);
        // ..
      }
      // }, []);
    };
  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: 40 }]}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <Image source={IMAGES.LOGIN} style={styles.image} />
          <View style={{ width: "100%" }}>
            <Text style={[theme.text.header, styles.header]}>Log in</Text>
          </View>
          <Formik
            validationSchema={ValidationSchema}
            onSubmit={(values, helpers) => handleSubmit(values, helpers)}
            initialValues={{
              emailOrUsername: "",
              password: "",
            }}
          >
            {({
              handleSubmit,
              values,
              touched,
              handleChange,
              handleBlur,
              errors,
            }) => (
              <>
                <View style={styles.main}>
                  <View style={{ gap: 15 }}>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        placeholder="Enter your email or username"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("emailOrUsername")}
                        onBlur={handleBlur("emailOrUsername")}
                        value={values.emailOrUsername}
                      ></TextInput>
                    </View>
                    {touched.emailOrUsername && errors.emailOrUsername ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.emailOrUsername}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 15 }}>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        secureTextEntry={true}
                        placeholder="Enter your password"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                      ></TextInput>
                      <Image
                        source={ICONS.ICON_LOCK}
                        style={{ height: 16, width: 16 }}
                      />
                    </View>
                    {touched.password && errors.password ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.password}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.forgotPasswordContainer}>
                    <MyLink
                      onPress={() => {
                        navigation.navigate("ForgotPassword");
                      }}
                      title="Forgot Password?"
                    />
                  </View>
                </View>
                <View style={styles.action}>
                  <MyButton
                    loading={isSubmitting}
                    onPress={handleSubmit}
                    title="Log In"
                    type="Primary"
                  />
                  <View style={styles.socialLoginContainer}>
                    <View style={styles.horizontalLine}></View>
                    <Text>or</Text>
                    <View style={styles.horizontalLine}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={styles.socialButton}>
                      <MyButton
                        loading={false}
                        onPress={comingSoon}
                        title="Google"
                        type="Primary"
                      />
                    </View>
                    <View style={styles.socialButton}>
                      <MyButton
                        loading={false}
                        onPress={comingSoon}
                        title="Facebook"
                        type="Primary"
                      />
                    </View>
                  </View>
                  <View style={{ alignItems: "center", marginTop: 15 }}>
                    <MyLink
                      onPress={() => {
                        navigation.navigate("Register");
                      }}
                      title="Don't have an account? Sign up"
                    />
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default observer(Login);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    alignItems: "flex-start",
    paddingTop: 100,
    gap: 10,
    paddingBottom: 30,
    paddingHorizontal: theme.screen.largePaddingHorizontal,
  },
  main: {
    gap: 20,
    width: "100%",
  },
  action: {
    gap: 10,
    width: "100%",
    marginTop: 10,
  },
  forgotPasswordContainer: {
    width: "100%",
    justifyContent: "flex-end",
    display: "flex",
    flexDirection: "row",
  },
  forgotPassword: {
    textAlign: "right",
  },
  image: {
    width: "120%",
    height: "auto",
    aspectRatio: 343 / 219,
    marginLeft: "-5%",
  },
  header: {
    textAlign: "left",
  },
  socialLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 20,
  },
  horizontalLine: {
    height: 1.5,
    backgroundColor: COLORS.VERY_LIGHT_GRAY,
    flexGrow: 1,
  },
  socialButton: {
    flexGrow: 1,
    maxWidth: "45%",
  },
});
