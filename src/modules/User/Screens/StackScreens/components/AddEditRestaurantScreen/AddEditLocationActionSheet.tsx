import { StyleSheet, Text, View } from "react-native";
import ActionSheet, {
  SheetProps,
  SheetManager,
} from "react-native-actions-sheet";
import MyButton from "../../../../../../components/MyButton";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { backendFunctions } from "../../../../../../../firebase";
import { theme } from "../../../../../../theme";

function AddEditLocationActionSheet({
  sheetId,
  payload,
}: SheetProps<{
  latitude: number;
  longitude: number;
  title?: string;
  isAdd: boolean;
}>) {
  const mapRef = useRef<MapView | null>(null);
  const [snapshotURI, setSnapshotURI] = useState("");
  const [takingSnapshot, setTakingSnapshot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: payload!.latitude,
    longitude: payload!.longitude,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    latitude: payload!.latitude,
    longitude: payload!.longitude,
  });

  const handleSubmit = useCallback(
    async (
      canceled: boolean,
      markerLocation: { latitude: number; longitude: number }
    ) => {
      if (canceled) {
        SheetManager.hide(sheetId, {
          payload: {
            canceled,
            markerLocation,
            completeAddress: "",
          },
        });
      }
      let completeAddress = "";
      setLoading(true);
      if (
        payload?.latitude != markerLocation.latitude ||
        payload.longitude != markerLocation.longitude
      ) {
        try {
          const res = await backendFunctions.reverseGeoCode({
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
          });
          if (res.data.statusCode === 200) {
            completeAddress = res.data.data.completeAddress;
            SheetManager.hide(sheetId, {
              payload: {
                canceled,
                markerLocation,
                completeAddress,
              },
            });
            return;
          } else
            Toast.show({
              type: "error",
              text1: "Something went wrong",
              text2: "Please try again later",
            });
        } catch (err) {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again later",
          });
        }
      }

      setLoading(false);
    },
    []
  );
  useEffect(() => {
    const getUserLocation = async () => {
      if (payload?.isAdd) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        } else {
          const location = await Location.getCurrentPositionAsync({});
          const { longitude, latitude } = location.coords;
          setRegion({ ...region, latitude, longitude });
          setMarker({ longitude, latitude });
        }
      }
    };
    getUserLocation();
  }, []);

  //for taking snapshot of map => unused for now
  useEffect(() => {
    if (takingSnapshot) {
      if (!mapRef?.current) {
        return;
      }

      const newRegion = {
        ...marker,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.0221,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 0);
      mapRef.current.forceUpdate(() => {
        if (!mapRef?.current) {
          return;
        }
        const snapshot = mapRef.current.takeSnapshot({
          // width: 250,      // optional, when omitted the view-width is used
          // height: 400,     // optional, when omitted the view-height is used
          region: newRegion, // iOS only, optional region to render
          format: "png", // image formats: 'png', 'jpg' (default: 'png')
          quality: 1, // image quality: 0..1 (only relevant for jpg, default: 1)
          result: "file", // result types: 'file', 'base64' (default: 'file')
        });
        snapshot.then((uri: string) => {
          setSnapshotURI(uri);
          setTakingSnapshot(false);
        });
      });
    }
  }, [takingSnapshot]);
  return (
    <ActionSheet
      id={sheetId}
      gestureEnabled={false}
      enableGesturesInScrollView={true}
    >
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.title}>{payload?.title || "Set Location"}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>
              Drag and drop the pin to set your location
            </Text>
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            region={region}
            style={styles.map}
            onRegionChangeComplete={(region, gesture) => {
              if (!gesture.isGesture) setRegion(region);
            }}
            showsUserLocation={!takingSnapshot}
          >
            <Marker
              pinColor={theme.primaryColor}
              draggable
              coordinate={marker}
              onDragEnd={(e) => {
                setMarker(e.nativeEvent.coordinate);
              }}
            />
          </MapView>
        </View>
        <View style={styles.actions}>
          <MyButton
            type={"Primary"}
            title={"Confirm"}
            onPress={() => handleSubmit(false, marker)}
            loading={loading}
          />
          <MyButton
            type={"Secondary"}
            title={"Cancel"}
            onPress={() => handleSubmit(true, marker)}
          />
        </View>
      </View>
    </ActionSheet>
  );
}

export default React.memo(AddEditLocationActionSheet);

const styles = StyleSheet.create({
  container: {
    gap: 40,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingTop: 15,
    justifyContent: "space-between",
    height: 600,
  },
  top: {
    gap: 15,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  bottom: {
    gap: 15,
  },
  actions: {
    gap: 20,
    paddingHorizontal: 10,
  },

  selectedTextStyle: {
    fontSize: 16,
  },
  mapContainer: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
