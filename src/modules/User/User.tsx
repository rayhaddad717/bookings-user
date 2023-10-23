import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/RouteParamList";
import { useStore } from "../../stores";

import { doc, getDoc } from "firebase/firestore";
import { firebaseDB } from "../../../firebase";
import { userConverter } from "../../interfaces";
import Stacks from "./Screens/StackScreens/Stack";

type Props = NativeStackScreenProps<RootStackParamList, "User">;

const User = ({ navigation }: Props) => {
  const { authenticationStore } = useStore();
  const { currentUser } = authenticationStore;
  useEffect(() => {
    if (!authenticationStore.userUID) navigation.navigate("Login");

    const docRef = doc(
      firebaseDB,
      "users",
      authenticationStore.userUID!
    ).withConverter(userConverter);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const user = docSnap.data();
        if (user) authenticationStore.setCurrentUser(user);
        else authenticationStore.setCurrentUser(null);
      } else {
        authenticationStore.setCurrentUser(null);
      }
    });
  }, [authenticationStore, navigation]);
  return <Stacks />;
};

export default observer(User);
