import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../../utils/RouteParamList/DashboardStackParamList";
import RestaurantDetailsStackScreen from "../../Restaurant/RestaurantDetailsStackScreen";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import HomeStackScreen from "../../Restaurant/HomeStackScreen";
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeTabScreen = () => {
  console.log("tab screen");
  const { restaurantStore } = useStore();
  return (
    <Stack.Navigator initialRouteName="HomeStack">
      <Stack.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          animationDuration: 50,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          headerShown: false,
        }}
        name="RestaurantDetails"
        component={RestaurantDetailsStackScreen}
      />
    </Stack.Navigator>
  );
};

export default observer(HomeTabScreen);
