import React, { useCallback, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  ActivityIndicator,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { theme } from "../theme";
interface Props {
  disabled?: boolean;
  latitude: number;
  longitude: number;
  markerTitle: string;
}
function MapComponent({ disabled, latitude, longitude, markerTitle }: Props) {
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    latitude,
    longitude,
  });
  const onPress = useCallback(
    (lat: number | undefined, lng: number | undefined) => {
      if (!lat || !lng) return;
      const scheme = Platform.select({
        ios: "maps://0,0?q=",
        android: "geo:0,0?q=",
      });
      const latLng = `${lat},${lng}`;
      const label = markerTitle;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.openURL(url!);
    },
    []
  );

  if (
    !region.latitude ||
    !region.longitude ||
    !marker.latitude ||
    !marker.longitude
  )
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  return (
    <View style={styles.container}>
      <MapView
        onPress={() => onPress(marker.latitude, marker.longitude)}
        // initialRegion={region}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region, gesture) => {
          if (!gesture.isGesture) setRegion(region);
        }}
        showsUserLocation={false}
        provider={PROVIDER_GOOGLE}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        zoomTapEnabled={false}
      >
        <Marker
          pinColor={theme.primaryColor}
          draggable
          coordinate={marker}
          title={markerTitle}
          onDragEnd={(e) => {
            setMarker(e.nativeEvent.coordinate);
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
export default React.memo(MapComponent);
