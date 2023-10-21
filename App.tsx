import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import Login from "./src/modules/authentication/Login";
import Register from "./src/modules/authentication/Register";
import React, { useCallback, useEffect, useState } from "react";
import { firebaseAuth } from "./firebase";
import { observer } from "mobx-react-lite";
import { StoreContext, store, useStore } from "./src/stores";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "./src/utils/RouteParamList";
import User from "./src/modules/User/User";
import { onAuthStateChanged } from "firebase/auth";
import { SheetProvider } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";
import ForgotPassword from "./src/modules/authentication/ForgotPassword";
import "./src/utils/sheets";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import Welcome from "./src/modules/authentication/Welcome";
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator<RootStackParamList>();
const App = observer(function App() {
  const [ready, setReady] = useState(false);
  const { authenticationStore } = useStore();
  const [fontsLoaded, fontError] = useFonts({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      try {
        console.log("on auth state change", user);
        if (user) {
          authenticationStore.setUserUID(user.uid);
        } else {
          authenticationStore.setUserUID(null);
        }
        SplashScreen.hideAsync();

        setReady(true);
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  // console.table({ fontsLoaded, fontError /});
  return (
    <StoreContext.Provider value={store}>
      <SheetProvider>
        <StatusBar style="auto" />

        {fontsLoaded && ready ? (
          <Stack.Navigator
            initialRouteName={authenticationStore.userUID ? "User" : "Welcome"}
          >
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="User"
              component={User}
            />

            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Register"
              component={Register}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Welcome"
              component={Welcome}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="ForgotPassword"
              component={ForgotPassword}
            />
          </Stack.Navigator>
        ) : (
          <View>
            <Text>Loading2</Text>
          </View>
        )}
        <Toast />
      </SheetProvider>
    </StoreContext.Provider>
  );
});

export default function Root() {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}
