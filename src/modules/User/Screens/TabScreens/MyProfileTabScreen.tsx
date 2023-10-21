import { View, Text, StyleSheet } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import MyButton from "../../../../components/MyButton";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../../../../../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserTabNavigationParamList } from "../../../../utils/RouteParamList";
import { SheetManager } from "react-native-actions-sheet";

type Props = NativeStackScreenProps<UserTabNavigationParamList, "MyProfile">;
const MyProfileTabScreen = ({ navigation }: Props) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { authenticationStore, restaurantStore } = useStore();

  useLayoutEffect(() => {
    setIsSigningOut(false);
  }, []);
  const handleSignOut = useCallback(async () => {
    const result: boolean = await SheetManager.show("my-action-sheet", {
      payload: {
        title: "Confirmation",
        message: "Are you sure you want to sign out?",
      },
    });
    if (!result) return;
    setIsSigningOut(true);
    signOut(firebaseAuth)
      .then(() => {
        setIsSigningOut(false);
        navigation.navigate("Login");
      })
      .catch((e) => {
        setIsSigningOut(false);
        console.error(e);
      });
  }, [setIsSigningOut, signOut]);

  return (
    <View style={styles.container}>
      <View>
        <Text>Welcome back {authenticationStore.currentUser?.firstName}</Text>
        <Text>Number of Restaurants: {restaurantStore.restaurants.length}</Text>
      </View>
      <MyButton
        loading={isSigningOut}
        onPress={handleSignOut}
        title="Sign Out"
        type={"Primary"}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 30,
    width: "100%",
  },
});
export default observer(MyProfileTabScreen);
