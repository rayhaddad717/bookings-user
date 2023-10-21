import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import MyTextInput from "../../../../components/MyTextInput";
import { globalStyles, theme } from "../../../../theme";

const NotificationsTabScreen = () => {
  const [searchKey, setSearchKey] = useState("");
  const [notifications, setNotifications] = useState([
    {
      username: "John Doe",
      message: "Reserved a table",
      createdAt: "2023-09-30T00:00:00.000Z",
    },
    {
      username: "Alice Smith",
      message: "New reservation for 2 people",
      createdAt: "2023-09-29T00:00:00.000Z",
    },
    {
      username: "Bob Johnson",
      message: "Reservation request for a party of 6",
      createdAt: "2023-01-30T00:00:00.000Z",
    },
    {
      username: "Emily Davis",
      message: "Reserved a table for tomorrow evening",
      createdAt: "2023-02-30T00:00:00.000Z",
    },
    {
      username: "Mike Wilson",
      message: "Last-minute booking for 4 tonight",
      createdAt: "2023-03-30T00:00:00.000Z",
    },
    {
      username: "Sarah Brown",
      message: "Customer canceled a reservation",
      createdAt: "2023-04-30T00:00:00.000Z",
    },
    {
      username: "Chris Miller",
      message: "Updated reservation details",
      createdAt: "2023-05-30T00:00:00.000Z",
    },
    {
      username: "Linda Anderson",
      message: "Table booked for a special occasion",
      createdAt: "2023-06-30T00:00:00.000Z",
    },
    {
      username: "David Lee",
      message: "Reservation confirmed for a VIP guest",
      createdAt: "2023-07-30T00:00:00.000Z",
    },
    {
      username: "Jennifer White",
      message: "Request for a private dining area",
      createdAt: "2023-08-30T00:00:00.000Z",
    },
    {
      username: "Kevin Clark",
      message: "Reservation for a business lunch",
      createdAt: "2022-09-30T00:00:00.000Z",
    },
  ]);
  const ItemSeparator = () => {
    return <View style={styles.separator} />;
  };
  return (
    <View
      style={[
        globalStyles.container,
        {
          paddingTop: 0,
          paddingHorizontal: theme.screen.paddingHorizontal,
        },
      ]}
    >
      <View style={styles.header}>
        <MyTextInput
          onChange={useCallback(
            (val) => {
              setSearchKey(val);
            },
            [setSearchKey]
          )}
          type={"Text"}
          title={""}
          placeholder={"Search by name"}
        />
      </View>

      <FlatList
        style={[
          globalStyles.scrollContainer,
          { paddingHorizontal: 20, paddingBottom: 30 },
        ]}
        data={notifications}
        keyExtractor={(item) => item.createdAt}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </View>
  );
};
const NotificationItem = ({
  item,
}: {
  item: { message: string; username: string; createdAt: string };
}) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,

      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      // Trigger the onPress function after the animation is complete
    });
  };
  return (
    <Animated.View
      style={[{ transform: [{ scale: scaleValue }], flexDirection: "row" }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.notificationRow}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            }}
            width={50}
            height={50}
          />
        </View>
        <View style={styles.main}>
          <View style={{ gap: 10, flexGrow: 1, maxWidth: "60%" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[globalStyles.baseTextBolder]}
            >
              {item.username}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[globalStyles.baseTextBolder]}
            >
              {item.message}
            </Text>
          </View>
          <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <Text style={[globalStyles.baseTextBolder]}>{item.createdAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
export default observer(NotificationsTabScreen);

const styles = StyleSheet.create({
  container: {},
  list: {},
  notificationRow: {
    flexDirection: "row",
    gap: 10,
  },
  header: {
    marginBottom: 20,
  },
  avatarContainer: {
    borderRadius: 55,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexGrow: 1,
  },
  separator: {
    height: 30, // Adjust this value to set the desired space between items
    backgroundColor: "transparent", // You can set a background color if needed
  },
});
