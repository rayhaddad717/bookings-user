import React, { useState } from "react";
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
import { Restaurant } from "../../../../../interfaces";
import { COLORS, theme } from "../../../../../theme";
import { AntDesign } from "@expo/vector-icons";
function RestaurantCard({
  restaurant,
  goToRestaurantDetails,
}: {
  restaurant: Restaurant;
  goToRestaurantDetails: (uid: string) => any;
}) {
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
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.restaurantCard}
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
            style={styles.restaurantMainImage}
          />
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
            <AntDesign
              onPress={() => console.log()}
              name="heart"
              size={20}
              color="red"
            />
          </View>
        </View>
        <View style={styles.bottom}>
          <View>
            <Text style={styles.restaurantCardHeader}>{restaurant.name}</Text>
            <Text style={theme.text.subtitle} numberOfLines={2}>
              50 meters away
            </Text>
            {true ? null : <View style={styles.separator}></View>}
          </View>
          {true ? null : (
            <View style={styles.restaurantCardDetails}>
              {/* occupied tables */}
              <View style={styles.restaurantCardDetailsItem}>
                <Entypo
                  name="info-with-circle"
                  size={16}
                  color={theme.primaryColor}
                />
                <Text>1/4</Text>
              </View>
              <View style={styles.restaurantCardDetailsItem}>
                <MaterialIcons
                  name="room"
                  size={16}
                  color={theme.primaryColor}
                />
                <Text>2</Text>
              </View>
              {/* working staff */}
              <View style={styles.restaurantCardDetailsItem}>
                <Ionicons name="person" size={16} color={theme.primaryColor} />
                <Text>3/10</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
export default React.memo(RestaurantCard);
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
    borderWidth: 2,
    borderColor: "#f7f7f7",
    padding: 8,
    borderRadius: 10,
    width: 280,
    marginBottom: 15,
    flexDirection: "column",
    // justifyContent: "space-between",
  },
  restaurantMainImage: {
    width: "100%",
    aspectRatio: 5 / 3,
    resizeMode: "cover",
    borderRadius: theme.borderRadius.soft,
    // minHeight: 100,
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
});
