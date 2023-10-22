import React, { useState } from "react";
import Tabs from "../TabScreens/Tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserStackParamsList } from "../../../../utils/RouteParamList/UserStackParamsList";
import { observer } from "mobx-react-lite";
import ReservationsListStackScreen from "./Dashboard/ReservationsListStackScreen";

import ReservationListHeader from "./components/ReservationsList/ReservationListHeader";
import SearchStackScreen from "./SearchStackScreen";
const Stack = createNativeStackNavigator<UserStackParamsList>();
const Stacks = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchStackScreen}
        options={{ headerShown: true, animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name="ReservationListStack"
        component={ReservationsListStackScreen}
        options={{
          animation: "fade_from_bottom",
          header: ({ navigation, options, route, back }) => (
            <ReservationListHeader route={route} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default observer(Stacks);
