import React from "react";
import { theme } from "../../../../theme";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import NotificationsTabScreen from "../../Screens/TabScreens/NotificationsTabScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyProfileTabScreen from "../../Screens/TabScreens/MyProfileTabScreen";
import { UserTabNavigationParamList } from "../../../../utils/RouteParamList";
import { observer } from "mobx-react-lite";
import HomeTabScreen from "./HomeTabScreen";
const Tab = createBottomTabNavigator<UserTabNavigationParamList>();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <FontAwesome
                name="home"
                size={focused ? 28 : 25}
                color={
                  focused
                    ? theme.tabBar.iconColorActive
                    : theme.tabBar.iconColor
                }
              />
            );
          },
          tabBarStyle: {
            height: theme.tabBar.height,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
        name="Home"
        component={HomeTabScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <AntDesign
                name="calendar"
                size={focused ? 28 : 25}
                color={
                  focused
                    ? theme.tabBar.iconColorActive
                    : theme.tabBar.iconColor
                }
              />
            );
          },
          tabBarStyle: {
            height: theme.tabBar.height,
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
        name="Favorites"
        component={HomeTabScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="notifications"
                size={focused ? 28 : 25}
                color={
                  focused
                    ? theme.tabBar.iconColorActive
                    : theme.tabBar.iconColor
                }
              />
            );
          },
          tabBarShowLabel: false,

          tabBarStyle: {
            height: theme.tabBar.height,
          },
        }}
        name="Notifications"
        component={NotificationsTabScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <AntDesign
                name="user"
                size={focused ? 28 : 25}
                color={
                  focused
                    ? theme.tabBar.iconColorActive
                    : theme.tabBar.iconColor
                }
              />
            );
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            height: theme.tabBar.height,
          },
        }}
        name="MyProfile"
        component={MyProfileTabScreen}
      />
    </Tab.Navigator>
  );
};

export default observer(Tabs);
