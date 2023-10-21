import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { COLORS, globalStyles } from "../../../../../theme";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../../stores";
import { Reservation } from "../../../../../interfaces/Reservation";
import { Ionicons } from "@expo/vector-icons";
import { ICONS } from "../../../../../icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserStackParamsList } from "../../../../../utils/RouteParamList/UserStackParamsList";
type Props = NativeStackScreenProps<
  UserStackParamsList,
  "ReservationListStack"
>;
const ReservationsListStackScreen = ({ route }: Props) => {
  const ref = useRef<FlatList | null>(null);
  const { reservationStore } = useStore();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loaded && ref.current) {
      const index = reservationStore.todaysReservations.findIndex((t) => {
        if (t.type === "data") return false;
        return t.title?.title === route.params.type;
      });
      ref.current.scrollToIndex({ animated: true, index: Math.max(index, 0) });
    }
  }, [loaded]);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 200);

    if (!reservationStore.isLoaded) {
      function getRandomDate() {
        const currentDate = new Date();
        const randomOffsetDays = Math.floor(Math.random() * 365); // Random offset in days (up to a year)
        currentDate.setDate(currentDate.getDate() + randomOffsetDays);

        const randomHour = Math.floor(Math.random() * 24); // Random hour (0-23)
        const randomMinute = Math.floor(Math.random() * 60); // Random minute (0-59)

        currentDate.setHours(randomHour, randomMinute, 0, 0);
        return currentDate;
      }

      const numberOfEntries = 6;
      const randomArray = [];

      for (let i = 0; i < numberOfEntries; i++) {
        randomArray.push({
          numberOfTables: Math.floor(Math.random() * 10) + 1, // Random number of tables (1-10)
          partySize: Math.floor(Math.random() * 50) + 1, // Random party size (1-50)
          reservationDate: getRandomDate(),
          username: [
            "Emma Smith",
            "Liam Johnson",
            "Olivia Brown",
            "Noah Davis",
            "Ava Wilson",
            "Isabella Martinez",
            "Sophia Anderson",
            "Mia Taylor",
            "Charlotte Garcia",
            "Amelia Rodriguez",
            "Harper Hernandez",
            "Evelyn Lopez",
            "Abigail Martinez",
            "Emily Gonzalez",
            "Elizabeth Perez",
            "Sofia Adams",
            "Avery Torres",
            "Ella Ramirez",
            "Scarlett Hall",
            "Grace Lewis",
            "Chloe White",
            "Victoria Moore",
            "Aubrey Clark",
            "Zoe King",
            "Riley Scott",
            "Lily Turner",
            "Layla Walker",
            "Mila Mitchell",
            "Addison Green",
            "Lily Lewis",
            "Natalie Adams",
            "Hannah Hill",
            "Ava Baker",
            "Zoe Turner",
            "Penelope Wright",
            "Lillian Collins",
            "Brooklyn King",
            "Savannah Garcia",
            "Claire Davis",
            "Victoria Lee",
            "Nora Wilson",
            "Stella Thompson",
            "Skylar Scott",
            "Aurora Martinez",
            "Sarah Turner",
            "Emery Carter",
            "Scarlett Bennett",
            "Hailey Nelson",
            "Kaylee Hall",
            "Paisley Lewis",
          ][Math.floor(Math.random() * 50)],
          uid: "uid-" + (i + 1),
        });
      }
      reservationStore.setReservations("upcomingReservations", randomArray);
    }
  }, [reservationStore, setLoaded]);
  if (!loaded)
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator color={COLORS.GREEN} />
      </View>
    );
  return (
    <View style={[globalStyles.container, { paddingTop: 0 }]}>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          // getItemCount={() => reservationStore.upcomingReservations.length}
          ref={ref}
          ItemSeparatorComponent={Separator}
          style={[
            globalStyles.scrollContainer,
            { paddingHorizontal: 10, paddingVertical: 10 },
          ]}
          keyExtractor={(item) =>
            item.element?.uid || item.title?.uid || Math.random().toString()
          }
          data={reservationStore.todaysReservations}
          renderItem={({ item, index }) => (
            <ReservationRenderItem item={item} index={index} />
          )}
        />
      </View>
    </View>
  );
};

export default observer(ReservationsListStackScreen);
const Separator = () => <View style={{ height: 10 }}></View>;
const ReservationRenderItem = React.memo(
  ({
    item,
    index,
  }: {
    item: {
      type: "title" | "data";
      element?: Reservation;
      title?: { title: string; uid: string };
    };
    index: number;
  }) => {
    const reservation = item.element as Reservation;
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
    const formatTime = useMemo(() => {
      try {
        if (item.type === "title") return null;
        const reservation = item.element as Reservation;
        const hours = reservation.reservationDate.getHours();
        const isPM = hours % 12 > 0;
        const minutes = reservation.reservationDate.getMinutes();
        const hourFormated = `0${hours % 12}`.slice(-2);
        const minuteFormated = `0${minutes}`.slice(-2);
        return `${hourFormated}:${minuteFormated} ${isPM ? "PM" : "AM"}`;
      } catch (error) {
        return `N/A`;
      }
    }, [item]);

    if (item.type === "title") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            height: 60,
            marginHorizontal: 5,
            marginTop: index ? 35 : 0,
          }}
        >
          <Text
            style={[
              globalStyles.baseTextBolder,
              { fontSize: 20, fontFamily: "Roboto_500Medium" },
            ]}
          >
            {item.title?.title}
          </Text>
          <View
            style={{ flexGrow: 1, height: 2, backgroundColor: COLORS.GREEN }}
          ></View>
        </View>
      );
    }
    return (
      <Animated.View
        style={[{ transform: [{ scale: scaleValue }], height: 60 }]}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={styles.reservationCard}
        >
          <View style={styles.reservationCardLeft}>
            <Text
              style={[
                globalStyles.baseTextBolder,
                { fontFamily: "Roboto_500Medium" },
              ]}
            >
              {formatTime}
            </Text>
            <View
              style={{
                height: 60,
                backgroundColor: COLORS.ICON_GRAY,
                width: 0.5,
              }}
            ></View>
            <Text
              style={[
                globalStyles.baseTextBolder,
                { fontFamily: "Roboto_500Medium" },
              ]}
            >
              {reservation.username}
            </Text>
          </View>
          <View style={styles.reservationIconContainer}>
            <View style={styles.reservationIconRow}>
              <Ionicons name="person" size={16} color={COLORS.ICON_GRAY} />
              <Text>{reservation.partySize}</Text>
            </View>
            <View style={styles.reservationIconRow}>
              <Image
                source={ICONS.icon_table_restaurant}
                style={{ width: 16, height: 16 }}
              />
              <Text>{reservation.numberOfTables}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);
const styles = StyleSheet.create({
  container: {},
  top: {},
  bottom: {},
  reservationCard: {
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "white",

    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 1.51,
    elevation: 2,
  },
  reservationCardLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    overflow: "hidden",
  },
  reservationIconContainer: {
    gap: 5,
    justifyContent: "flex-start",
    minWidth: 20,
    maxWidth: 40,
    flexGrow: 1,
    marginRight: 30,
    // flexShrink: 1,
  },
  reservationIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
