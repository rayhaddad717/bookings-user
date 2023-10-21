import { View, Text, StyleSheet, RefreshControl, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../utils/RouteParamList/DashboardStackParamList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { getDocs, limit, query } from "firebase/firestore";
import { companyRestaurantsRef, restaurantsRef } from "../../../collections";
import { Restaurant, restaurantConverter } from "../../../interfaces";
import RestaurantCard from "./components/HomeScreen/RestaurantCard";
import { globalStyles, theme } from "../../../theme";
type Props = NativeStackScreenProps<HomeStackParamList, "HomeStack">;
const HomeStackScreen = ({ navigation }: Props) => {
  const { restaurantStore, authenticationStore } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const goToRestaurantDetails = useCallback(
    (uid: string) => {
      navigation.navigate("RestaurantDetails", { uid });
    },
    [navigation]
  );
  const initRestaurants = useCallback(async () => {
    try {
      if (!authenticationStore || !restaurantStore) return;
      setRefreshing(true);
      const q = query(restaurantsRef, limit(10)).withConverter(
        restaurantConverter
      );
      const querySnapshot = await getDocs(q);
      const restaurants: Restaurant[] = [];
      querySnapshot.forEach((doc) => {
        try {
          const restaurant = doc.data()!;
          restaurant.uid = doc.id;
          restaurants.push(restaurant);
        } catch (error) {
          console.error(error);
        }
      });
      restaurantStore.initiazeRestaurants(restaurants);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  }, [restaurantStore, authenticationStore]);

  useEffect(() => {
    initRestaurants();
  }, [restaurantStore]);
  return (
    <View style={styles.container}>
      <Text style={globalStyles.headerText}>Near Me</Text>
      <FlatList
        data={restaurantStore.restaurants}
        style={styles.restaurantScrollView}
        keyExtractor={(item) => item.uid}
        renderItem={({ item: restaurant }) => (
          <RestaurantCard
            goToRestaurantDetails={goToRestaurantDetails}
            restaurant={restaurant}
          />
        )}
        refreshControl={
          <RefreshControl
            colors={[theme.primaryColor]}
            refreshing={refreshing}
            onRefresh={initRestaurants}
          />
        }
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </View>
  );
};

export default observer(HomeStackScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 25,
  },
  restaurantScrollView: {
    width: "100%",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  restaurantCard: {
    gap: 10,
    borderWidth: 2,
    borderColor: "#f7f7f7",
    padding: 8,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  restaurantMainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  bottom: { gap: 10 },
  restaurantCardHeader: { fontSize: 18, fontWeight: "600" },
  restaurantCardSubHeader: { fontSize: 16, fontWeight: "500", color: "#777" },
  separator: {
    width: "100%",
    height: 0.5,
    backgroundColor: "gray",
    marginTop: 10,
  },
  restaurantCardDetails: { flexDirection: "row", gap: 7, width: "100%" },
  restaurantCardDetailsItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    flexGrow: 1,
  },
});
