import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import { globalStyles, theme } from "../../theme";
import { IMAGES } from "../../icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/RouteParamList";
import MyButton from "../../components/MyButton";
type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;
const Welcome = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={[globalStyles.container]}>
      {/* <ScrollView contentContainerStyle={[globalStyles.scrollContainer]}> */}
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          overflow: "hidden",
          paddingHorizontal: theme.screen.paddingHorizontal,
          gap: 0,
          paddingBottom: 20,
        }}
      >
        <Image style={styles.image} source={IMAGES.WELCOME} />
        <Text style={[theme.text.header, styles.header]}>
          Book your table in a few clicks
        </Text>
        <Text style={[theme.text.subtitle, styles.subtitle]}>
          Hundreds of restaurants with the best reviews waiting for you.
        </Text>
        <MyButton
          type={"Primary"}
          title={"Find a restaurant"}
          onPress={() => navigation.navigate("Login")}
        ></MyButton>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default React.memo(Welcome);
const styles = StyleSheet.create({
  header: {
    fontSize: 32,
  },
  subtitle: { fontSize: 20 },
  image: {
    width: "100%",
    resizeMode: "cover",
    maxHeight: "60%",
  },
});
