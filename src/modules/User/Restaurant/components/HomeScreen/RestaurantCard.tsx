import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  Animated,
  Easing,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { Restaurant, userConverter } from "../../../../../interfaces";
import { COLORS, theme } from "../../../../../theme";
import { AntDesign } from "@expo/vector-icons";
import MyIconButton from "../../../../../components/MyIconButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../../stores";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "../../../../../../firebase";
import Toast from "react-native-toast-message";
import { ICONS, IMAGES } from "../../../../../icons";
function RestaurantCard({
  restaurant,
  goToRestaurantDetails,
  horizontal,
}: {
  restaurant: Restaurant;
  goToRestaurantDetails: (uid: string) => any;
  horizontal?: boolean;
}) {
  const hasFavorite = !horizontal;
  const showCuisineAndRating = horizontal;
  const hasNavigateArrow = horizontal;
  const { authenticationStore, restaurantStore } = useStore();
  const [scaleValue] = useState(new Animated.Value(1));
  const [isFavorite, setIsFavorite] = useState(
    restaurantStore.favoriteRestaurants.has(restaurant.uid)
  );
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
  
  const toggleFavorite = useCallback(
    async (value: boolean) => {
      try {
        setIsFavorite(value);
        const authenticatedUserRef = doc(
          firebaseDB,
          "users",
          authenticationStore.userUID as string
        ).withConverter(userConverter);
        const favoriteRestaurants =
          authenticationStore.currentUser?.favoriteRestaurants || new Set();
        if (value) favoriteRestaurants?.add(restaurant.uid);
        else favoriteRestaurants?.delete(restaurant.uid);
        await updateDoc(authenticatedUserRef, {
          favoriteRestaurants: Array.from(favoriteRestaurants),
        });
        authenticationStore.currentUser!.favoriteRestaurants =
          favoriteRestaurants;
        authenticationStore.setCurrentUser(authenticationStore.currentUser!);
        restaurantStore.toggleFavorite(restaurant.uid);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: "Try again later",
        });
        setIsFavorite(!value);
      }
    },
    [
      setIsFavorite,
      authenticationStore.currentUser,
      authenticationStore,
      restaurant,
    ]
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[
          styles.restaurantCard,
          horizontal && styles.restaurantCardHorizontal,
        ]}
        key={restaurant.uid}
        onPress={() => goToRestaurantDetails(restaurant.uid)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{
              uri:
                (restaurant.images?.length && restaurant?.images[0]?.url) ||
                "https://api.bklebanon.com/content/uploads/offers/384~Website-Offers-King-Towfir-540x225.jpg",
            }}
            style={[
              styles.restaurantMainImage,
              horizontal && styles.restaurantMainImageHorizontal,
            ]}
          />
          {hasFavorite ? (
            <View
              style={{
                position: "absolute",
                top: "3%",
                right: "3%",
                borderRadius: 24,
                backgroundColor: COLORS.WHITE,
                padding: 7,
              }}
            >
              <MyIconButton
                icon={
                  <AntDesign
                    onPress={() => toggleFavorite(!isFavorite)}
                    name={isFavorite ? "heart" : "hearto"}
                    size={20}
                    color="red"
                  />
                }
                onPress={function () {}}
                containerStyle={{}}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.bottom}>
          <View style={{ gap: 7 }}>
            <Text style={styles.restaurantCardHeader}>{restaurant.name}</Text>
            {showCuisineAndRating ? (
              <>
                <Text
                  style={[theme.text.subtitle, styles.subtitleSmaller]}
                  numberOfLines={2}
                >
                  {restaurant.cuisine}
                </Text>
                <Text
                  style={[theme.text.subtitle, styles.subtitleSmaller]}
                  numberOfLines={1}
                >
                  5-Star Rating
                </Text>
              </>
            ) : (
              <Text style={theme.text.subtitle} numberOfLines={2}>
                50 meters away
              </Text>
            )}
            {true ? null : <View style={styles.separator}></View>}
          </View>
        </View>
        {hasNavigateArrow ? (
          <View style={{ justifyContent: "flex-end" }}>
            <Image
              style={styles.chevronRight}
              source={ICONS.ICON_CHEVRON_RIGHT_CIRCLE}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}
export default React.memo(observer(RestaurantCard));
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  restaurantScrollView: {
    width: "100%",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  restaurantCard: {
    gap: 10,
    borderWidth: 0,
    ...theme.shadow.soft,
    padding: 8,
    backgroundColor: COLORS.WHITE,
    borderRadius: theme.borderRadius.soft,
    width: 280,
    marginBottom: 15,
    flexDirection: "column",
    // justifyContent: "space-between",
  },
  restaurantCardHorizontal: {
    flexDirection: "row",
    width: "100%",
    gap: 30,
  },
  restaurantMainImage: {
    width: "100%",
    aspectRatio: 5 / 3,
    resizeMode: "cover",
    borderRadius: theme.borderRadius.soft,
    // minHeight: 100,
  },
  restaurantMainImageHorizontal: {
    aspectRatio: 1,
    width: 90,
    flexGrow: 1,
  },
  bottom: { gap: 10, flexGrow: 1 },
  restaurantCardHeader: { fontSize: 18, fontWeight: "600" },
  restaurantCardSubHeader: { fontSize: 16, fontWeight: "500", color: "#777" },
  separator: {
    width: "100%",
    height: 0.5,
    backgroundColor: "gray",
    marginTop: 10,
  },
  restaurantCardDetails: {
    flexDirection: "row",
    gap: 7,
    width: "100%",
    marginVertical: 10,
  },
  restaurantCardDetailsItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    flexGrow: 1,
  },
  subtitleSmaller: {
    fontSize: 13,
  },
  chevronRight: { width: 22, height: 22 },
});
