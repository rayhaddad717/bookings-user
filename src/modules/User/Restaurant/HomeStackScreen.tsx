import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../utils/RouteParamList/DashboardStackParamList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { getDocs, limit, query } from "firebase/firestore";
import { companyRestaurantsRef, restaurantsRef } from "../../../collections";
import { Restaurant, restaurantConverter } from "../../../interfaces";
import RestaurantCard from "./components/HomeScreen/RestaurantCard";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, globalStyles, theme } from "../../../theme";
import { Image } from "expo-image";
import { ICONS, IMAGES } from "../../../icons";
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
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={[globalStyles.scrollContainer]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, gap: 20 }}>
          <View>
            <View
              style={{
                paddingVertical: 60,
                backgroundColor: "#0d2149",
                paddingHorizontal: "5%",
                width: "120%",
                marginLeft: "-5%",
              }}
            >
              <Text style={styles.header}>Discover places</Text>
              <Text style={styles.header}>and restaurants</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("Search")}
              style={{
                position: "relative",
                height: 30,
              }}
            >
              <View
                style={{
                  borderRadius: theme.borderRadius.soft,
                  borderColor: "red",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  zIndex: 10,
                  height: 60,
                  backgroundColor: COLORS.WHITE,
                  width: "100%",
                  marginHorizontal: "0%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  ...theme.shadow.soft,
                }}
              >
                <Text style={[theme.text.subtitle]}>
                  Type location or restaurant
                </Text>
                <Image
                  source={ICONS.ICON_ARROW_RIGHT}
                  style={{ width: 24, aspectRatio: 1 }}
                />
              </View>
            </Pressable>
          </View>
          <Text style={[theme.text.header]}>Near You</Text>
          <FlatList
            horizontal={true}
            data={restaurantStore.restaurants.concat(
              restaurantStore.restaurants,
              restaurantStore.restaurants,
              restaurantStore.restaurants
            )}
            style={{ minWidth: "120%", marginRight: "-5%" }}
            contentContainerStyle={styles.restaurantScrollView}
            keyExtractor={(item) => item.uid}
            renderItem={({ item: restaurant }) => (
              <RestaurantCard
                goToRestaurantDetails={goToRestaurantDetails}
                restaurant={restaurant}
              />
            )}
            ItemSeparatorComponent={({}) => <View style={{ width: 15 }}></View>}
            // refreshControl={
            //   <RefreshControl
            //     colors={[theme.primaryColor]}
            //     refreshing={refreshing}
            //     onRefresh={initRestaurants}
            //   />
            // }
            showsHorizontalScrollIndicator={false}
          ></FlatList>

          <Text style={[theme.text.header]}>Categories</Text>
          <View style={styles.categoriesContainer}>
            <Pressable>
              <View style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={ICONS.ICON_PIZZA_SLICE}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[globalStyles.baseText, styles.categoryTitle]}>
                  Pizza
                </Text>
              </View>
            </Pressable>
            <Pressable>
              <View style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={ICONS.ICON_HAMBURGER}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[globalStyles.baseText, styles.categoryTitle]}>
                  Burger
                </Text>
              </View>
            </Pressable>
            <Pressable>
              <View style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={ICONS.ICON_LEAF}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[globalStyles.baseText, styles.categoryTitle]}>
                  Vegan
                </Text>
              </View>
            </Pressable>
            <Pressable>
              <View style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={ICONS.ICON_KEBAB}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={[globalStyles.baseText, styles.categoryTitle]}>
                  Lebanese
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Roboto_700Bold",
  },
  restaurantScrollView: {
    paddingTop: 10,
    paddingRight: "15%",
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
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryCard: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  categoryImageContainer: {
    ...theme.shadow.soft,
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: theme.borderRadius.soft,
    alignItems: "center",
  },
  categoryImage: { aspectRatio: 1, width: 32 },
  categoryTitle: { fontSize: 16 },
});
