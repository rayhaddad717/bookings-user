import { View, Text, StatusBar } from "react-native";
import React from "react";
import { COLORS, globalStyles } from "../../../../../../theme";

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import MyIconButton from "../../../../../../components/MyIconButton";
type Props = NativeStackScreenProps<ParamListBase, string>;
const ReservationListHeader = ({ navigation, route }: Props) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: StatusBar.currentHeight || 0,
        width: "100%",
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          backgroundColor: COLORS.GREEN,
          width: "100%",
          borderRadius: 8,
          paddingVertical: 10,
          marginVertical: 20,
          paddingHorizontal: 10,
          alignItems: "center",
        }}
      >
        <MyIconButton
          icon={<Ionicons name="arrow-back" size={24} color="white" />}
          onPress={function () {
            navigation.goBack();
          }}
          containerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        />
        <Text
          style={[
            globalStyles.baseTextBolder,
            { fontSize: 22, color: COLORS.WHITE },
          ]}
        >
          Today's Resevations
        </Text>
      </View>
    </View>
  );
  return <Text>children</Text>;
};
export default ReservationListHeader;
