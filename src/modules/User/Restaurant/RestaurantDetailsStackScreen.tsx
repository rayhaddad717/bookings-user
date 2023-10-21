import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../../../utils/RouteParamList/DashboardStackParamList";
import { Restaurant, RestaurantFields } from "../../../interfaces";
import { useStore } from "../../../stores";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import MyButton from "../../../components/MyButton";
import { firebaseDB } from "../../../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import MyIconButton from "../../../components/MyIconButton";
import MapComponent from "../../../components/MapComponent";
import { theme } from "../../../theme";
type Props = NativeStackScreenProps<HomeStackParamList, "RestaurantDetails">;
const RestaurantDetailsStackScreen = ({ navigation, route }: Props) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(
    null
  );
  const [loading, setLoading] = useState(true);
  const deleteActionSheetRef = useRef<ActionSheetRef>(null);

  const { restaurantStore, authenticationStore } = useStore();
  const handleEditRestaurant = useCallback(() => {
    restaurantStore.setAddEditRestaurant("edit");
    // navigation.navigate("AddEditRestaurantStack", { uid: restaurant?.uid });
  }, [restaurant]);

  const handleConfirmDeleteRestaurant = useCallback(() => {
    deleteActionSheetRef.current?.show();
  }, [restaurant]);
  const handleDeleteRestaurant = useCallback(async () => {
    try {
      await deleteDoc(
        doc(
          firebaseDB,
          "companies",
          authenticationStore.userUID!,
          `restaurants`,
          restaurant?.uid!
        )
      );
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Deleted restaurant",
      });
      restaurantStore.deleteRestaurant(restaurant!);
      navigation.navigate("HomeStack");
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "There was a problem deleting the restaurant",
      });
    }
  }, [restaurant]);
  useEffect(() => {
    setRestaurant(restaurantStore.restaurantsMap.get(route.params.uid));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [route, restaurantStore]);

  const DeleteActionSheet = (
    <ActionSheet
      ref={deleteActionSheetRef}
      closable={true}
      gestureEnabled={true}
      containerStyle={{ width: "100%" }}
    >
      <View
        style={{
          paddingTop: 20,
          paddingHorizontal: 10,
          gap: 40,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            gap: 10,
          }}
        >
          <Text>Are you sure you want to delete this restaurant?</Text>
          <Text>This action is not reversible</Text>
        </View>
        <View
          style={{
            gap: 10,
          }}
        >
          <MyButton
            onPress={handleDeleteRestaurant}
            title="Confirm"
            type="Primary"
          />
          <MyButton
            onPress={() => deleteActionSheetRef.current?.hide()}
            title="Cancel"
            type="Secondary"
          />
        </View>
      </View>
    </ActionSheet>
  );
  const RestaurantImages = restaurant?.images?.length ? (
    <>
      <View>
        <Text style={styles.header}>Images</Text>
      </View>
      <View style={styles.imageContainer}>
        {restaurant?.images?.length
          ? restaurant?.images.map((image, index) =>
              image?.url ? (
                <Image
                  key={index}
                  source={{ uri: image?.url }}
                  style={styles.image}
                />
              ) : null
            )
          : null}
      </View>
    </>
  ) : null;
  if (!restaurant)
    return (
      <View style={styles.container}>
        <Text>Loadintg</Text>
      </View>
    );
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: 40,
          width: "100%",
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 20,
            top: 60,
            zIndex: 20,
          }}
        >
          <MyIconButton
            containerStyle={[
              styles.absoluteActionButtons,
              { borderRadius: 100, padding: 0 },
            ]}
            icon={
              <Ionicons
                name="arrow-back-circle-outline"
                size={35}
                color={theme.primaryColor}
              />
            }
            onPress={() => navigation.goBack()}
          ></MyIconButton>
        </View>
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 60,
            zIndex: 20,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <MyIconButton
            containerStyle={styles.absoluteActionButtons}
            icon={
              <FontAwesome
                name="bookmark"
                size={25}
                color={theme.primaryColor}
              />
            }
            onPress={handleEditRestaurant}
          ></MyIconButton>
          <MyIconButton
            containerStyle={styles.absoluteActionButtons}
            icon={
              <AntDesign name="delete" size={25} color={theme.primaryColor} />
            }
            onPress={handleConfirmDeleteRestaurant}
          ></MyIconButton>
        </View>
        <Image
          source={{
            uri:
              (restaurant.images?.length && restaurant?.images[0]?.url) ||
              "https://api.bklebanon.com/content/uploads/offers/384~Website-Offers-King-Towfir-540x225.jpg",
          }}
          style={styles.restaurantMainImage}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 10 }}
        style={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(restaurant).map((key) =>
          typeof restaurant[key as RestaurantFields] === "string" ? (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.title}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Text>
              <Text>{restaurant[key as RestaurantFields]?.toString()}</Text>
            </View>
          ) : null
        )}
        {RestaurantImages}
        {restaurant.location?.latitude && restaurant.location?.longitude ? (
          <View style={styles.locationContainer}>
            <Text style={styles.header}>Location</Text>
            {loading ? null : (
              <MapComponent
                disabled={true}
                latitude={restaurant.location?.latitude || 33.91865710186577}
                longitude={restaurant.location?.longitude || 35.621339343488216}
                markerTitle={restaurant.name}
              />
            )}
          </View>
        ) : null}
      </ScrollView>
      {DeleteActionSheet}
    </View>
  );
};

export default RestaurantDetailsStackScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 0,
    // paddingHorizontal: 10,
    gap: 10,
  },
  restaurantMainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  body: {
    paddingHorizontal: 10,
    flex: 1,
    gap: 20,
    flexDirection: "column",
    display: "flex",
    width: "100%",
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontWeight: "600",
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#d1cdcd",
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
  },
  image: {
    width: "40%",
    height: "100%",
    aspectRatio: "4/3",
    flexGrow: 1,
    maxWidth: "50%",
  },
  header: {
    fontWeight: "600",
    fontSize: 22,
    marginTop: 20,
  },
  absoluteActionButtons: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
  locationContainer: {
    gap: 20,
  },
});
