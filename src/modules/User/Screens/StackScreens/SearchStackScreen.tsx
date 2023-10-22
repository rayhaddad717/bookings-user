import {
  FlatList,
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { UserStackParamsList } from "../../../../utils/RouteParamList/UserStackParamsList";
import { COLORS, globalStyles, theme } from "../../../../theme";
import {
  Cuisines,
  Restaurant,
  restaurantConverter,
} from "../../../../interfaces";
import { collection, getDocs, query, where } from "firebase/firestore";
import { restaurantsRef } from "../../../../collections";
import RestaurantCard from "../../Restaurant/components/HomeScreen/RestaurantCard";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { SheetManager } from "react-native-actions-sheet";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import MyIconButton from "../../../../components/MyIconButton";
type Props = NativeStackScreenProps<UserStackParamsList, "Search">;
const SearchStackScreen = ({ navigation }: Props) => {
  const { restaurantStore } = useStore();
  const [searchKey, setSearchKey] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setfilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [filters, setFilters] = useState({
    selectedCuisines: new Set<Cuisines>(),
  });
  const handleInputChange = (value: string) => {
    setSearchKey(value);
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      setTimeout(() => {
        search(filters, value);
      }, 200)
    );
  };
  const getRestaurants = useCallback(async () => {
    if (
      restaurantStore.cacheTimestamp != null &&
      (new Date().getTime() - restaurantStore.cacheTimestamp.getTime()) / 1000 <
        5 * 60
    ) {
      //less than 5 minutes
      setRestaurants(restaurantStore.restaurantsForFilter);
      setfilteredRestaurants(restaurantStore.restaurantsForFilter);
      return;
    }
    const rests: Restaurant[] = [];
    const querySnapshot = await getDocs(
      restaurantsRef.withConverter(restaurantConverter)
    );
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        data.uid = doc.id;
        rests.push(data);
      }
    });
    restaurantStore.setRestaurantsForFilter(rests);
    setfilteredRestaurants(restaurantStore.restaurantsForFilter);
    setRestaurants(rests);
  }, [setRestaurants]);
  useEffect(() => {
    setTimeout(() => {
      getRestaurants();
    }, 300);

    return () => {};
  }, []);

  const search = useCallback(
    async (
      filter: { selectedCuisines: Set<Cuisines> } = filters,
      searchKeyValue = searchKey
    ) => {
      let nameFiltering = restaurants;
      if (filter.selectedCuisines.size) {
        nameFiltering = nameFiltering.filter(
          (r) => r.cuisine && filter.selectedCuisines.has(r.cuisine)
        );
      }
      let searchKeyToLower = searchKeyValue.toLowerCase();
      if (searchKeyToLower) {
        nameFiltering = nameFiltering.filter((r) =>
          r.name.toLowerCase().startsWith(searchKeyToLower)
        );
      }
      setfilteredRestaurants(nameFiltering);
    },
    [restaurants, setfilteredRestaurants, searchKey, filters]
  );

  const filterApplied = useMemo(() => {
    return !!filters.selectedCuisines.size;
  }, [filters.selectedCuisines]);
  const filter = useCallback(async () => {
    const result: {
      canceled: boolean;
      filters: {
        selectedCuisines: Set<Cuisines>;
      };
    } = await SheetManager.show("search-filter-sheet", {
      payload: {
        restaurants: searchKey.trim()
          ? restaurants.filter((r) =>
              r.name.toLowerCase().startsWith(searchKey.toLowerCase())
            )
          : restaurants, //already filtered by search by name
        filters: {
          selectedCuisines: filters.selectedCuisines, //previously filtered
        },
      },
    });
    if (!result) return;
    if (!result?.canceled) {
      setFilters(result.filters);
      search(result.filters);
    }
  }, [
    restaurants,
    setfilteredRestaurants,
    filteredRestaurants,
    filters,
    setFilters,
    search,
    searchKey,
  ]);
  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: 10 }]}>
      <View style={{ gap: 10 }}>
        <View style={[styles.container]}>
          <Text style={[theme.text.header, styles.header]}>
            Top Restaurants
          </Text>
          <View style={styles.searchBar}>
            <View
              style={[
                globalStyles.textInputContainer,
                styles.textInputContainer,
              ]}
            >
              <TextInput
                placeholder="Search for a restaurant"
                onChangeText={handleInputChange}
                value={searchKey}
              ></TextInput>
              <MyIconButton
                icon={
                  <Ionicons
                    name="search"
                    size={24}
                    color={theme.primaryColor}
                  />
                }
                onPress={() => search()}
                containerStyle={{}}
              />
            </View>
            <MyIconButton
              icon={
                filterApplied ? (
                  <MaterialCommunityIcons
                    name="filter"
                    size={28}
                    color={theme.primaryColor}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="filter-outline"
                    size={28}
                    color={theme.primaryColor}
                  />
                )
              }
              onPress={filter}
              containerStyle={undefined}
            />
          </View>
        </View>
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={[
            globalStyles.scrollContainer,
            styles.scrollContainer,
          ]}
          renderItem={({ item }) => (
            <RestaurantCard
              goToRestaurantDetails={(uid: string) => {
                navigation.navigate("RestaurantDetails", { uid });
              }}
              restaurant={item}
              horizontal={true}
            />
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(observer(SearchStackScreen));
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.screen.paddingHorizontal,
    marginBottom: 20,
    gap: 10,
  },
  header: { fontSize: 22, fontWeight: "600" },
  searchBar: { flexDirection: "row", gap: 10, alignItems: "center" },
  textInputContainer: {
    backgroundColor: COLORS.WHITE,
    flexGrow: 1,
    ...theme.shadow.soft,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  scrollContainer: { paddingTop: 5, minHeight: 0 },
});
