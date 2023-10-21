import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import { observer } from "mobx-react-lite";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "../../../firebase";
import { userRef } from "../../collections";
import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/RouteParamList";
import { isValidPassword } from "../../utils/helpers";
import { COLORS, globalStyles, theme } from "../../theme";
import Toast from "react-native-toast-message";
import { useStore } from "../../stores";
import { userConverter } from "../../interfaces";
import { ICONS, IMAGES } from "../../icons";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import MyLink from "../../components/MyLink";
type Props = NativeStackScreenProps<RootStackParamList, "Register">;
const Register = ({ navigation }: Props) => {
  const { authenticationStore } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsSubmitting(false);
  }, []);
  const validationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .min(3, "Your name must be at least 3 characters")
          .required("required"),
        email: Yup.string().email("Invalid email address").required("required"),
        username: Yup.string()
          .max(20, "Username must be at least 3 characters")
          .required("required"),
        password: Yup.string()
          .min(8)
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Your password must contain one lowercase letter, one uppercase letter, one digit, and one special character and be minimum 8 characters in length"
          )
          .required("required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("required"),
      }),
    []
  );
  const handleSubmit = useCallback(
    async (
      {
        confirmPassword,
        email,
        name,
        password,
        username,
      }: {
        name: string;
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
      },
      helper: FormikHelpers<{
        name: string;
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
      }>
    ) => {
      try {
        setIsSubmitting(true);
        const checkUsername = await getDocs(
          query(userRef, where("username", "==", username.toLocaleLowerCase()))
        );
        if (!checkUsername.empty) {
          helper.setFieldError("username", "username is already taken");
          Toast.show({
            type: "error",
            text1: "The username is already taken",
            text2: "Please choose another username",
          });
          setIsSubmitting(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password.trim()
        );
        const user = userCredential.user;
        await setDoc(doc(userRef, user.uid), {
          name: name.trim(),
          email: email.trim(),
          uid: user.uid,
          username: username.toLocaleLowerCase(),
        });
        const newUserRef = doc(firebaseDB, "users", user.uid).withConverter(
          userConverter
        );
        const newUser = await getDoc(newUserRef);
        if (newUser.exists()) {
          authenticationStore.setCurrentUser(newUser.data());
          navigation.navigate("User");
        }
      } catch (error) {
        setIsSubmitting(false);
        const firebaseError = error as { code: string; message: string };
        const errorCode = firebaseError.code;
        const errorMessage = firebaseError.message;
        const format = new Set(["auth/invalid-email"]);
        if (format.has(errorCode))
          Toast.show({
            type: "info",
            text1: "Invalid Email",
            text2: "The email you provided is not valid",
          });
        else if (errorCode === "auth/email-already-in-use") {
          Toast.show({
            type: "error",
            text1: "Invalid Email",
            text2: "This email is already in use.",
          });
        }
        console.error(errorCode, errorMessage);
      }
    },
    []
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={[globalStyles.scrollContainer]}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <Image source={IMAGES.SIGN_UP} style={styles.image} />
          <View style={{ height: 20 }}></View>
          <Text style={[theme.text.header, styles.header]}>Sign up</Text>
          <Text style={[theme.text.subtitle, styles.header]}>
            Create an account
          </Text>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: "",
              email: "",
              username: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, helper) => handleSubmit(values, helper)}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <View style={styles.main}>
                  <View style={{ gap: 15 }}>
                    <Text style={globalStyles.textInputLabel}>Full name</Text>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        placeholder="Name Surname"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                      ></TextInput>
                      <Image
                        source={ICONS.ICON_ID_CARD}
                        style={{ height: 16, width: 16 }}
                      />
                    </View>
                    {touched.name && errors.name ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.name}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 15 }}>
                    <Text style={globalStyles.textInputLabel}>
                      Enter your email
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="email-address"
                        placeholder="email@email.com"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                      ></TextInput>
                      <Image
                        source={ICONS.ICON_ENVELOPE}
                        style={{
                          height: 16,
                          width: 16,
                        }}
                      />
                    </View>
                    {touched.email && errors.email ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.email}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 15 }}>
                    <Text style={globalStyles.textInputLabel}>
                      Create a username
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        placeholder="username"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        value={values.username}
                      ></TextInput>
                      <Image
                        source={ICONS.ICON_USER}
                        style={{ height: 16, width: 16 }}
                      />
                    </View>
                    {touched.username && errors.username ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.username}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 15 }}>
                    <Text style={globalStyles.textInputLabel}>
                      Create your password
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        secureTextEntry={true}
                        placeholder="************"
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
                        source={ICONS.ICON_KEY}
                        style={{ height: 16, width: 16 }}
                      />
                    </View>
                    {touched.password && errors.password ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.password}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 15 }}>
                    <Text style={globalStyles.textInputLabel}>
                      Repeat password
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                      <TextInput
                        keyboardType="default"
                        secureTextEntry={true}
                        placeholder="************"
                        style={{
                          fontWeight: "600",
                          maxWidth: "80%",
                          flexGrow: 1,
                        }}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                      ></TextInput>
                      <Image
                        source={ICONS.ICON_LOCK}
                        style={{ height: 16, width: 16 }}
                      />
                    </View>
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <Text style={globalStyles.textInputErrorLabel}>
                        {errors.confirmPassword}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.action}>
                  <MyButton
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    title="Sign up"
                    type="Primary"
                  />
                  <View style={{ alignItems: "center" }}>
                    <MyLink
                      onPress={() => {
                        navigation.navigate("Login");
                      }}
                      title="Have an account? Log In"
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
};

export default observer(Register);
const styles = StyleSheet.create({
  container: {
    paddingTop: theme.screen.paddingTop,
  },
  scrollContainer: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 30,
    width: "100%",
  },
  header: {
    textAlign: "center",
  },
  main: {
    width: "100%",
    marginBottom: 30,
    gap: 15,
  },
  action: {
    gap: 10,
    width: "100%",
  },
  image: {
    width: "120%",
    height: "auto",
    aspectRatio: 375 / 200,
    marginLeft: "-5%",
  },
});
